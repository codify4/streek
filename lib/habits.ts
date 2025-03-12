"use client"

import { supabase } from "./supabase"

export interface Habit {
  id: string
  name: string
  color: string
  streak: number
  user_id: string
  created_at?: string
  completed_dates?: string[]
  completed_today?: boolean
  last_completed_date?: string | null // Track the last date the habit was completed
}

// Interface to track which habits are completed on which dates
export interface HabitCompletions {
  [habitId: string]: {
    [date: string]: boolean
  }
}

// Get today's date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0]
}

// Get yesterday's date in YYYY-MM-DD format
export const getYesterdayDateString = (): string => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split("T")[0]
}

// Check if a date is consecutive to another date
export const isConsecutiveDay = (prevDate: string, currentDate: string): boolean => {
  if (!prevDate || !currentDate) return false

  const prev = new Date(prevDate)
  const current = new Date(currentDate)

  // Reset hours to avoid timezone issues
  prev.setHours(0, 0, 0, 0)
  current.setHours(0, 0, 0, 0)

  // Calculate the difference in days
  const diffTime = current.getTime() - prev.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  // If the difference is 1 day, they are consecutive
  return diffDays === 1
}

// Read all habits
export const getHabits = async (userId: string): Promise<Habit[] | null> => {
  try {
    if (!userId) {
      console.error("User ID is required to fetch habits")
      return null
    }

    const { data: habits, error } = await supabase
      .from("habit")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching habits:", error.message)
      throw error
    }

    return habits
  } catch (error: any) {
    console.error("Error fetching habits:", error.message)
    return null
  }
}

// Get habit completions for all habits
export const getHabitCompletions = async (userId: string): Promise<HabitCompletions | null> => {
  try {
    if (!userId) {
      console.error("User ID is required to fetch habit completions")
      return null
    }

    // Get the date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data, error } = await supabase
      .from("habit_completion")
      .select("habit_id, completion_date")
      .eq("user_id", userId)
      .gte("completion_date", sevenDaysAgo.toISOString().split("T")[0])
      .order("completion_date", { ascending: false })

    if (error) {
      console.error("Error fetching habit completions:", error.message)
      throw error
    }

    // Convert to a map of habitId -> date -> true
    const habitCompletions: HabitCompletions = {}
    if (data) {
      data.forEach((completion) => {
        if (!habitCompletions[completion.habit_id]) {
          habitCompletions[completion.habit_id] = {}
        }
        habitCompletions[completion.habit_id][completion.completion_date] = true
      })
    }

    return habitCompletions
  } catch (error: any) {
    console.error("Error fetching habit completions:", error.message)
    return null
  }
}

// Get the most recent completion date for a habit
export const getLastCompletionDate = (habitCompletions: HabitCompletions, habitId: string): string | null => {
  if (!habitCompletions[habitId]) return null

  // Get all completion dates for this habit
  const dates = Object.keys(habitCompletions[habitId])
  if (dates.length === 0) return null

  // Sort dates in descending order (most recent first)
  dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  // Return the most recent date
  return dates[0]
}

// Check if a habit's streak should be reset
export const shouldResetStreak = (habitCompletions: HabitCompletions, habitId: string): boolean => {
  const today = getTodayDateString()
  const yesterday = getYesterdayDateString()

  // If completed today, streak is valid
  if (isHabitCompletedOnDate(habitCompletions, habitId, today)) {
    return false
  }

  // If completed yesterday, streak is still valid
  if (isHabitCompletedOnDate(habitCompletions, habitId, yesterday)) {
    return false
  }

  // Get the last completion date
  const lastCompletionDate = getLastCompletionDate(habitCompletions, habitId)

  // If never completed or last completion is before yesterday, reset streak
  if (!lastCompletionDate || new Date(lastCompletionDate) < new Date(yesterday)) {
    return true
  }

  return false
}

export const createHabit = async (habit: Omit<Habit, "id">): Promise<Habit | null> => {
  try {
    if (!habit.user_id) {
      console.error("User ID is required to create a habit")
      return null
    }

    const { data, error } = await supabase.from("habit").insert(habit).select().single()

    if (error) {
      console.error("Error creating habit:", error.message)
      throw error
    }

    return data
  } catch (error: any) {
    console.error("Error creating habit:", error.message)
    return null
  }
}

export const updateHabit = async (id: string, updates: Partial<Habit>): Promise<Habit | null> => {
  try {
    if (!id) {
      console.error("Habit ID is required for updates")
      return null
    }

    const { data, error } = await supabase.from("habit").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating habit:", error.message)
      throw error
    }

    return data
  } catch (error: any) {
    console.error("Error updating habit:", error.message)
    return null
  }
}

export const deleteHabit = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      console.error("Habit ID is required for deletion")
      return false
    }

    const { error } = await supabase.from("habit").delete().eq("id", id)

    if (error) {
      console.error("Error deleting habit:", error.message)
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error deleting habit:", error.message)
    return false
  }
}

// Check if a habit has been completed on a specific date
export const isHabitCompletedOnDate = (
  habitCompletions: HabitCompletions,
  habitId: string,
  date: string = getTodayDateString(),
): boolean => {
  return !!(habitCompletions[habitId] && habitCompletions[habitId][date])
}

// Record a habit completion
export const recordHabitCompletion = async (
  habitId: string,
  userId: string,
  date: string = getTodayDateString(),
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("habit_completion").insert({
      habit_id: habitId,
      user_id: userId,
      completion_date: date,
    })

    if (error) {
      // If the error is a duplicate key violation, it means the habit was already completed today
      if (error.code === "23505") {
        console.log("Habit already completed today")
        return true
      }
      console.error("Error recording habit completion:", error.message)
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error recording habit completion:", error.message)
    return false
  }
}

// Reset a habit's streak to 0
export const resetHabitStreak = async (habitId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("habit").update({ streak: 0 }).eq("id", habitId)

    if (error) {
      console.error("Error resetting habit streak:", error.message)
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error resetting habit streak:", error.message)
    return false
  }
}