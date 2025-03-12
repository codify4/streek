"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "./supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { Alert } from "react-native"

export interface Habit {
  id: string
  name: string
  color: string
  streak: number
  user_id: string
  created_at?: string
  completed_dates?: string[]
}

export interface CompletionsByDate {
  [date: string]: boolean // date string in format 'YYYY-MM-DD'
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

    return habits;
  } catch (error: any) {
    console.error("Error fetching habits:", error.message)
    return null
  }
}

// Get habit completions for the last 7 days
export const getHabitCompletions = async (userId: string): Promise<CompletionsByDate | null> => {
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
      .select("completion_date")
      .eq("user_id", userId)
      .gte("completion_date", sevenDaysAgo.toISOString().split("T")[0])

    if (error) {
      console.error("Error fetching habit completions:", error.message)
      throw error
    }

    // Convert to a map of date -> true
    const completionsByDate: CompletionsByDate = {}
    if (data) {
      data.forEach((completion) => {
        // Format date as YYYY-MM-DD
        const date = completion.completion_date
        completionsByDate[date] = true
      })
    }

    return completionsByDate
  } catch (error: any) {
    console.error("Error fetching habit completions:", error.message)
    return null
  }
}

// Record a habit completion
export const recordHabitCompletion = async (
  habitId: string,
  userId: string,
  date: string = new Date().toISOString().split("T")[0],
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("habit_completion").insert({
      habit_id: habitId,
      user_id: userId,
      completion_date: date,
    })

    if (error) {
      console.error("Error recording habit completion:", error.message)
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error recording habit completion:", error.message)
    return false
  }
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

// Custom hook for habits with real-time updates
export const useHabits = (userId: string | undefined) => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completionsByDate, setCompletionsByDate] = useState<CompletionsByDate>({})
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch habit completions
  const loadCompletions = useCallback(async () => {
    if (!userId) return

    const completions = await getHabitCompletions(userId)
    if (completions) {
      setCompletionsByDate(completions)
    }
  }, [userId])

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
        Alert.alert("Error", "Failed to load habits. Please try again.")
      }

      // Also load completions
      await loadCompletions()
    } catch (error) {
      console.error("Error in loadHabits:", error)
      Alert.alert("Error", "Something went wrong while loading your habits.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [userId, loadCompletions])

  // Set up Supabase real-time subscription
  useEffect(() => {
    if (!userId) return

    let habitsSubscription: RealtimeChannel
    let completionsSubscription: RealtimeChannel

    const setupSubscriptions = async () => {
      // Subscribe to changes on the habit table for the current user
      habitsSubscription = supabase
        .channel("habit-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "habit", // Make sure this matches your table name
            filter: `user_id=eq.${userId}`, // Only listen to changes for the current user
          },
          (payload) => {
            console.log("Real-time habit change received:", payload)

            // Handle different types of changes
            if (payload.eventType === "INSERT") {
              const newHabit = payload.new as Habit
              setHabits((prevHabits) => [newHabit, ...prevHabits])
            } else if (payload.eventType === "UPDATE") {
              const updatedHabit = payload.new as Habit
              setHabits((prevHabits) =>
                prevHabits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit)),
              )
            } else if (payload.eventType === "DELETE") {
              const deletedHabitId = payload.old.id
              setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== deletedHabitId))
            }
          },
        )
        .subscribe()

      // Subscribe to changes on the habit_completion table for the current user
      completionsSubscription = supabase
        .channel("completion-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "habit_completion", // Make sure this matches your table name
            filter: `user_id=eq.${userId}`, // Only listen to changes for the current user
          },
          (payload) => {
            console.log("Real-time completion change received:", payload)

            // Reload completions when they change
            loadCompletions()
          },
        )
        .subscribe()
    }

    setupSubscriptions()

    // Clean up subscriptions when component unmounts
    return () => {
      if (habitsSubscription) {
        supabase.removeChannel(habitsSubscription)
      }
      if (completionsSubscription) {
        supabase.removeChannel(completionsSubscription)
      }
    }
  }, [userId, loadCompletions])

  // Fetch habits on hook initialization
  useEffect(() => {
    if (userId) {
      loadHabits()
    }
  }, [userId, loadHabits])

  // Handle completing a habit
  const completeHabit = async (id: string) => {
    try {
      if (!userId) return

      // Find the habit to update
      const habit = habits.find((h) => h.id === id)
      if (!habit) return

      // Optimistically update UI
      setHabits((prevHabits) => prevHabits.map((h) => (h.id === id ? { ...h, streak: (h.streak || 0) + 1 } : h)))

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0]

      // Optimistically update completions
      setCompletionsByDate((prev) => ({
        ...prev,
        [today]: true,
      }))

      // Update habit in Supabase
      const updatedHabit = await updateHabit(id, { streak: (habit.streak || 0) + 1 })

      // Record the completion
      await recordHabitCompletion(id, userId)

      if (!updatedHabit) {
        // If update fails, revert the optimistic update
        setHabits((prevHabits) => prevHabits.map((h) => (h.id === id ? habit : h)))
        Alert.alert("Error", "Failed to update habit. Please try again.")
      }
      // No need to manually update the state here as the real-time subscription will handle it
    } catch (error) {
      console.error("Error completing habit:", error)
      Alert.alert("Error", "Something went wrong while updating your habit.")
      // Refresh habits to ensure UI is in sync with database
      loadHabits()
    }
  }

  // Handle deleting a habit
  const removeHabit = async (id: string) => {
    try {
      // Find the habit to delete
      const habitToDelete = habits.find((h) => h.id === id)
      if (!habitToDelete) return

      // Optimistically update UI
      setHabits((prevHabits) => prevHabits.filter((h) => h.id !== id))

      // Delete habit from Supabase
      const success = await deleteHabit(id)

      if (!success) {
        // If deletion fails, revert the optimistic update
        setHabits((prevHabits) => [...prevHabits, habitToDelete])
        Alert.alert("Error", "Failed to delete habit. Please try again.")
      }
      // No need to manually update the state here as the real-time subscription will handle it
    } catch (error) {
      console.error("Error deleting habit:", error)
      Alert.alert("Error", "Something went wrong while deleting your habit.")
      // Refresh habits to ensure UI is in sync with database
      loadHabits()
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadHabits()
  }, [loadHabits])

  // Helper function to check if a date has any completions
  const hasCompletionsOnDate = useCallback(
    (date: string) => {
      return !!completionsByDate[date]
    },
    [completionsByDate],
  )

  return {
    habits,
    loading,
    refreshing,
    onRefresh,
    completeHabit,
    removeHabit,
    completionsByDate,
    hasCompletionsOnDate,
  }
}

