"use client"

import { type CalendarDay, getCalendarDays } from "@/constants/data"
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, FlatList } from "react-native"

interface CalendarProps {
  onSelectDay: (day: CalendarDay) => void
  hasCompletionsOnDate?: (dateString: string) => boolean
}

const Calendar = ({ onSelectDay, hasCompletionsOnDate }: CalendarProps) => {
  const [days, setDays] = useState<CalendarDay[]>(getCalendarDays())
  const [lastCheckedDay, setLastCheckedDay] = useState<number>(new Date().getDay())
  const today = new Date()
  const currentDate = today.getDate()
  const currentDay = today.getDay()

  useEffect(() => {
    setLastCheckedDay(currentDay)

    const dayCheckInterval = setInterval(() => {
      const now = new Date()
      const nowDay = now.getDay()

      // If it's Monday or the day has changed
      if (nowDay !== lastCheckedDay) {
        // Update the calendar days
        const newDays = getCalendarDays()
        setDays(newDays)
        setLastCheckedDay(nowDay)

        // Reset selection to today
        const todayIndex = newDays.findIndex((day) => day.date === now.getDate())
        if (todayIndex >= 0) {
          onSelectDay(newDays[todayIndex])
        }
      }
    }, 3600000) // Check every hour

    return () => clearInterval(dayCheckInterval)
  }, [lastCheckedDay, onSelectDay])

  // Helper function to format date as YYYY-MM-DD
  const formatDateString = (day: CalendarDay): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // JavaScript months are 0-based

    // Calculate the actual date by finding the difference from today
    const dateDiff = day.date - currentDate
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + dateDiff)

    const targetYear = targetDate.getFullYear()
    const targetMonth = targetDate.getMonth() + 1
    const targetDay = targetDate.getDate()

    // Format as YYYY-MM-DD
    return `${targetYear}-${targetMonth.toString().padStart(2, "0")}-${targetDay.toString().padStart(2, "0")}`
  }

  return (
    <View className="w-full px-4 py-3 bg-[#F0EFEF] rounded-3xl mb-5 mt-2">
      <View className="flex-row justify-between">
        <FlatList
          data={days}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: day, index }) => {
            const isToday = day.date === currentDate
            const dateString = formatDateString(day)
            const hasCompletions = hasCompletionsOnDate ? hasCompletionsOnDate(dateString) : false

            // Determine background color based on completions and if it's today
            let bgColorClass = "bg-secondary"

            if (hasCompletions) {
              bgColorClass = "bg-primary"
            }

            if (isToday && !hasCompletions) {
              bgColorClass = "bg-secondary border-2 border-primary"
            } else if (isToday && hasCompletions) {
              bgColorClass = "bg-primary border-2 border-secondary"
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectDay(day)}
                className={`flex items-center justify-center h-[70px] mr-2 ${bgColorClass}`}
                style={{ padding: 10, width: 60, borderRadius: 20 }}
              >
                <Text className="text-white font-sora-semibold text-xs">{day.day}</Text>
                <Text className="text-white font-sora-bold text-2xl">{day.date}</Text>
              </TouchableOpacity>
            )
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  )
}

export default Calendar

