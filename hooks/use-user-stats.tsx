'use client'

import { useState, useEffect, useCallback } from "react"
import type { Stat } from "@/constants/wins-data"
import { Habit } from "@/lib/habits"
import { 
    calculateCurrentStreaks, 
    calculateHabitsDone, 
    calculateLongestStreak, 
    getAllHabitCompletions
} from "@/lib/stats"

export interface UserStats {
    longestStreak: number
    currentStreaks: number
    habitsDone: number
  }
  

export const useUserStats = (userId: string | undefined, habits: Habit[]) => {
    const [stats, setStats] = useState<UserStats>({
      longestStreak: 0,
      currentStreaks: 0,
      habitsDone: 0,
    })
    const [loading, setLoading] = useState(false)
  
    const loadStats = useCallback(async () => {
      if (!userId || !habits || habits.length === 0) return
  
      setLoading(true)
      try {
        const longestStreak = calculateLongestStreak(habits)
        const currentStreaks = calculateCurrentStreaks(habits)
  
        const completions = await getAllHabitCompletions(userId)
        const habitsDone = completions ? calculateHabitsDone(completions) : 0
  
        setStats({
          longestStreak,
          currentStreaks,
          habitsDone,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }, [userId, habits])
  
    useEffect(() => {
      loadStats()
    }, [loadStats, habits])
  
    const getFormattedStats = (): Stat[] => [
      {
        id: "longest-streak",
        title: "Longest Streak",
        value: stats.longestStreak,
        subtitle: "Days",
        iconName: "flame",
      },
      {
        id: "current-streeks",
        title: "Current Streaks",
        value: stats.currentStreaks,
        subtitle: "Streaks",
        iconName: "refresh-cw",
      },
      {
        id: "habits-done",
        title: "Habits Done",
        value: stats.habitsDone,
        subtitle: "Habits",
        iconName: "target",
      },
    ]
  
    return {
      stats,
      loading,
      getFormattedStats,
      refreshStats: loadStats,
    }
  }