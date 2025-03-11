"use client"

import { useState, useEffect, useCallback } from "react"
import { View, SafeAreaView, FlatList, Platform, Alert, RefreshControl } from "react-native"
import Calendar from "@/components/home/calendar"
import HabitCard from "@/components/home/habit-card"
import { calendarDays, type CalendarDay } from "@/constants/data"
import * as Haptics from "expo-haptics"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Header from "@/components/header"
import { StatusBar } from "expo-status-bar"
import { getHabits, updateHabit, deleteHabit, type Habit } from "@/lib/habits"
import { useAuth } from "@/context/auth"
import { Text } from "react-native"

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDay, setSelectedDay] = useState<CalendarDay>(
    calendarDays.find((day) => day.isActive) || calendarDays[0],
  )

  const { session } = useAuth()
  const userId = session?.user?.id

  // Fetch habits function
  const loadHabits = useCallback(async () => {
    if (!userId) {
      console.log("No user ID available")
      return
    }

    setLoading(true)
    try {
      const fetchedHabits = await getHabits(userId)
      if (fetchedHabits) {
        setHabits(fetchedHabits)
      } else {
        // If null is returned, there was an error
        Alert.alert("Error", "Failed to load habits. Please try again.")
      }
    } catch (error) {
      console.error("Error in loadHabits:", error)
      Alert.alert("Error", "Something went wrong while loading your habits.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [userId])

  // Fetch habits on component mount
  useEffect(() => {
    if (userId) {
      loadHabits()
    }
  }, [userId, loadHabits])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadHabits()
  }, [loadHabits])

  const handleSelectDay = (day: CalendarDay) => {
    setSelectedDay(day)
  }

  const handleCompleteHabit = async (id: string) => {
    try {
      // Find the habit to update
      const habit = habits.find((h) => h.id === id)
      if (!habit) return

      // Optimistically update UI
      setHabits((prevHabits) => prevHabits.map((h) => (h.id === id ? { ...h, streak: (h.streak || 0) + 1 } : h)))

      // Provide haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      // Update habit in Supabase
      const updatedHabit = await updateHabit(id, { streak: (habit.streak || 0) + 1 })

      if (!updatedHabit) {
        // If update fails, revert the optimistic update
        setHabits((prevHabits) => prevHabits.map((h) => (h.id === id ? habit : h)))
        Alert.alert("Error", "Failed to update habit. Please try again.")
      }
    } catch (error) {
      console.error("Error completing habit:", error)
      Alert.alert("Error", "Something went wrong while updating your habit.")
      // Refresh habits to ensure UI is in sync with database
      loadHabits()
    }
  }

  const handleDeleteHabit = async (id: string) => {
    try {
      // Ask for confirmation
      Alert.alert("Delete Habit", "Are you sure you want to delete this habit?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Optimistically update UI
            const habitToDelete = habits.find((h) => h.id === id)
            setHabits((prevHabits) => prevHabits.filter((h) => h.id !== id))

            // Provide haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)

            // Delete habit from Supabase
            const success = await deleteHabit(id)

            if (!success && habitToDelete) {
              // If deletion fails, revert the optimistic update
              setHabits((prevHabits) => [...prevHabits, habitToDelete])
              Alert.alert("Error", "Failed to delete habit. Please try again.")
            }
          },
        },
      ])
    } catch (error) {
      console.error("Error deleting habit:", error)
      Alert.alert("Error", "Something went wrong while deleting your habit.")
      // Refresh habits to ensure UI is in sync with database
      loadHabits()
    }
  }

  const scrollGesture = Gesture.Pan().activeOffsetY([-10, 10])

  return (
    <SafeAreaView className="flex-1 bg-white" style={Platform.OS === "ios" ? { marginTop: 0 } : { marginTop: 40 }}>
      <StatusBar style="dark" />
      <Header title="Habits" />

      <View className="px-5">
        <Calendar onSelectDay={handleSelectDay} />
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