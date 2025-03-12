"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "./supabase"
import type { Habit, HabitCompletions } from "./habits"
import type { Stat } from "@/constants/wins-data"


export const calculateLongestStreak = (habits: Habit[]): number => {
  if (!habits || habits.length === 0) return 0

  return Math.max(...habits.map((habit) => habit.streak || 0))
}

export const calculateCurrentStreaks = (habits: Habit[]): number => {
  if (!habits || habits.length === 0) return 0

  return habits.filter((habit) => (habit.streak || 0) > 0).length
}

export const calculateHabitsDone = (habitCompletions: HabitCompletions): number => {
  if (!habitCompletions) return 0

  let total = 0

  // Count all completions across all habits
  Object.keys(habitCompletions).forEach((habitId) => {
    total += Object.keys(habitCompletions[habitId]).length
  })

  return total
}

export const getAllHabitCompletions = async (userId: string): Promise<HabitCompletions | null> => {
  try {
    if (!userId) {
      console.error("User ID is required to fetch habit completions")
      return null
    }

    const { data, error } = await supabase
      .from("habit_completion")
      .select("habit_id, completion_date")
      .eq("user_id", userId)

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
