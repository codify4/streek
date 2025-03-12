"use client"

import { useState } from "react"
import { View, SafeAreaView, FlatList, Platform, RefreshControl } from "react-native"
import Calendar from "@/components/home/calendar"
import HabitCard from "@/components/home/habit-card"
import { calendarDays, type CalendarDay } from "@/constants/data"
import * as Haptics from "expo-haptics"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Header from "@/components/header"
import { StatusBar } from "expo-status-bar"
import { useHabits } from "@/lib/habits"
import { useAuth } from "@/context/auth"
import { Text } from "react-native"

const Home = () => {
  const [selectedDay, setSelectedDay] = useState<CalendarDay>(
    calendarDays.find((day) => day.isActive) || calendarDays[0],
  )

  const { session } = useAuth()
  const userId = session?.user?.id

  // Use our custom hook to get habits with real-time updates
  const { habits, loading, refreshing, onRefresh, completeHabit, removeHabit, hasCompletionsOnDate } = useHabits(userId)

  const handleSelectDay = (day: CalendarDay) => {
    setSelectedDay(day)
  }

  const handleCompleteHabit = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await completeHabit(id)
  }

  const handleDeleteHabit = async (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    await removeHabit(id)
  }

  const scrollGesture = Gesture.Pan().activeOffsetY([-10, 10])

  return (
    <SafeAreaView className="flex-1 bg-white" style={Platform.OS === "ios" ? { marginTop: 0 } : { marginTop: 40 }}>
      <StatusBar style="dark" />
      <Header title="Habits" />

      <View className="px-5">
        <Calendar onSelectDay={handleSelectDay} hasCompletionsOnDate={hasCompletionsOnDate} />
      </View>

      <GestureDetector gesture={scrollGesture}>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item: habit }) => (
            <HabitCard habit={habit} onComplete={handleCompleteHabit} onDelete={handleDeleteHabit} />
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListEmptyComponent={
            !loading ? (
              <View className="flex items-center justify-center py-10">
                <Text className="text-gray-500 text-lg">No habits yet. Add your first habit!</Text>
              </View>
            ) : null
          }
          ListFooterComponent={() => <View className="h-24" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </GestureDetector>
    </SafeAreaView>
  )
}

export default Home

