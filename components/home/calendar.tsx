"use client"

import { type CalendarDay, getCalendarDays } from "@/constants/data"
import { useEffect, useState, useRef } from "react"
import { View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated"

interface CalendarProps {
  onSelectDay: (day: CalendarDay) => void
  hasCompletionsOnDate?: (dateString: string) => boolean
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const DAY_ITEM_WIDTH = 70
const DAY_ITEM_MARGIN = 8
const VISIBLE_ITEMS = Math.floor(SCREEN_WIDTH / (DAY_ITEM_WIDTH + DAY_ITEM_MARGIN))

const Calendar = ({ onSelectDay, hasCompletionsOnDate }: CalendarProps) => {
  const [days, setDays] = useState<CalendarDay[]>(getCalendarDays())
  const [lastCheckedDay, setLastCheckedDay] = useState<number>(new Date().getDay())
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const flatListRef = useRef<FlatList>(null)

  const today = new Date()
  const currentDate = today.getDate()
  const currentDay = today.getDay()
  const currentMonth = today.toLocaleString("default", { month: "long" })
  const currentYear = today.getFullYear()

  // Animation values
  const monthOpacity = useSharedValue(0)
  const monthTranslateY = useSharedValue(-10)

  useEffect(() => {
    // Animate month header on mount
    monthOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    monthTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })

    // Find today's index and select it
    const todayIndex = days.findIndex((day) => day.date === currentDate)
    if (todayIndex >= 0) {
      setSelectedIndex(todayIndex)
      onSelectDay(days[todayIndex])

      // Scroll to today with a slight delay to ensure the list is rendered
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: Math.max(0, todayIndex - Math.floor(VISIBLE_ITEMS / 2)),
          animated: true,
        })
      }, 100)
    }

    setLastCheckedDay(currentDay)

    const dayCheckInterval = setInterval(() => {
      const now = new Date()
      const nowDay = now.getDay()

      // If the day has changed
      if (nowDay !== lastCheckedDay) {
        // Update the calendar days
        const newDays = getCalendarDays()
        setDays(newDays)
        setLastCheckedDay(nowDay)

        // Reset selection to today
        const todayIndex = newDays.findIndex((day) => day.date === now.getDate())
        if (todayIndex >= 0) {
          setSelectedIndex(todayIndex)
          onSelectDay(newDays[todayIndex])

          flatListRef.current?.scrollToIndex({
            index: Math.max(0, todayIndex - Math.floor(VISIBLE_ITEMS / 2)),
            animated: true,
          })
        }
      }
    }, 3600000) // Check every hour

    return () => clearInterval(dayCheckInterval)
  }, [lastCheckedDay, onSelectDay, days])

  // Helper function to format date as YYYY-MM-DD
  const formatDateString = (day: CalendarDay): string => {
    const now = new Date()
    const dateDiff = day.date - currentDate
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + dateDiff)

    const targetYear = targetDate.getFullYear()
    const targetMonth = (targetDate.getMonth() + 1).toString().padStart(2, "0")
    const targetDay = targetDate.getDate().toString().padStart(2, "0")

    return `${targetYear}-${targetMonth}-${targetDay}`
  }

  // Get day status (past, today, future)
  const getDayStatus = (day: CalendarDay, index: number): "past" | "today" | "future" => {
    const todayIndex = days.findIndex((d) => d.date === currentDate)
    if (index < todayIndex) return "past"
    if (index === todayIndex) return "today"
    return "future"
  }

  const monthHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: monthOpacity.value,
      transform: [{ translateY: monthTranslateY.value }],
    }
  })

  return (
    <View className="w-full bg-[#1B1B3A0D] rounded-3xl mb-5 mt-2 pt-2 pb-3 px-2">
      {/* Month header */}
      <Animated.View className="px-4 mb-2 flex-row justify-between items-center" style={monthHeaderStyle}>
        <Text className="font-sora-bold text-lg text-secondary">
          {currentMonth} {currentYear}
        </Text>
        <View className="flex-row">
          <View className="flex-row items-center mr-4">
            <View className="w-3 h-3 rounded-full bg-primary mr-1" />
            <Text className="text-xs text-gray-600">Completed</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full border border-primary mr-1" />
            <Text className="text-xs text-gray-600">Today</Text>
          </View>
        </View>
      </Animated.View>

      {/* Days list */}
      <FlatList
        ref={flatListRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        onScrollToIndexFailed={() => {
          // Fallback for scroll failure
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({ offset: 0, animated: true })
            }
          }, 100)
        }}
        renderItem={({ item: day, index }) => {
          const isToday = day.date === currentDate
          const isSelected = index === selectedIndex
          const dateString = formatDateString(day)
          const hasCompletions = hasCompletionsOnDate ? hasCompletionsOnDate(dateString) : false
          const dayStatus = getDayStatus(day, index)

          // Determine styles based on state
          let cardStyle = "bg-white"
          let dateTextStyle = "text-secondary"
          let dayTextStyle = "text-gray-500"

          if (isSelected) {
            cardStyle = hasCompletions ? "bg-primary" : "bg-secondary"
            dateTextStyle = "text-white"
            dayTextStyle = "text-white"
          } else if (hasCompletions) {
            cardStyle = "bg-primary"
            dayTextStyle = "text-white"
            dateTextStyle = "text-white"
          } else if (dayStatus === "past") {
            cardStyle = "bg-secondary"
            dateTextStyle = "text-gray-300"
            dayTextStyle = "text-gray-300"
          }

          // Add border for today
          if (isToday) {
            cardStyle += " border-2 border-primary"
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedIndex(index)
                onSelectDay(day)
              }}
              className={`items-center justify-center mx-1 ${cardStyle}`}
              style={{
                width: DAY_ITEM_WIDTH,
                height: 80,
                borderRadius: 16,
                shadowColor: isSelected ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.1 : 0,
                shadowRadius: 4,
                elevation: isSelected ? 2 : 0,
              }}
            >
              <Text className={`font-sora-medium text-xs mb-1 ${dayTextStyle}`}>{day.day}</Text>
              <Text className={`font-sora-bold text-2xl ${dateTextStyle}`}>{day.date}</Text>

              {/* Completion indicator dot */}
              {hasCompletions && !isSelected && <View className="w-2 h-2 rounded-full bg-primary mt-1" />}
            </TouchableOpacity>
          )
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  )
}

export default Calendar

