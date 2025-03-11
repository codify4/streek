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

// Create a new habit
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

// Update a habit
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

// Delete a habit
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
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

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

  // Set up Supabase real-time subscription
  useEffect(() => {
    if (!userId) return

    let subscription: RealtimeChannel

    const setupSubscription = async () => {
      // Subscribe to changes on the habit table for the current user
      subscription = supabase
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
            console.log("Real-time change received:", payload)

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
    }

    setupSubscription()

    // Clean up subscription when component unmounts
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [userId])

  // Fetch habits on hook initialization
  useEffect(() => {
    if (userId) {
      loadHabits()
    }
  }, [userId, loadHabits])

  // Handle completing a habit
  const completeHabit = async (id: string) => {
    try {
      // Find the habit to update
      const habit = habits.find((h) => h.id === id)
      if (!habit) return

      // Optimistically update UI
      setHabits((prevHabits) => prevHabits.map((h) => (h.id === id ? { ...h, streak: (h.streak || 0) + 1 } : h)))

      // Update habit in Supabase
      const updatedHabit = await updateHabit(id, { streak: (habit.streak || 0) + 1 })

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

  return {
    habits,
    loading,
    refreshing,
    onRefresh,
    completeHabit,
    removeHabit,
  }
}

