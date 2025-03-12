'use client'

import { useState, useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { Alert } from "react-native"
import { deleteHabit, getHabitCompletions, getHabits, getTodayDateString, Habit, HabitCompletions, recordHabitCompletion, updateHabit } from "../lib/habits"

export interface CompletionsByDate {
  [date: string]: boolean // date string in format 'YYYY-MM-DD'
}

export const isHabitCompletedOnDate = (
  habitCompletions: HabitCompletions,
  habitId: string,
  date: string = getTodayDateString(),
): boolean => {
  return !!(habitCompletions[habitId] && habitCompletions[habitId][date])
}

export const useHabits = (userId: string | undefined) => {
    const [habits, setHabits] = useState<Habit[]>([])
    const [habitCompletions, setHabitCompletions] = useState<HabitCompletions>({})
    const [completionsByDate, setCompletionsByDate] = useState<CompletionsByDate>({})
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
  
    // Fetch habit completions
    const loadCompletions = useCallback(async () => {
      if (!userId) return
  
      const completions = await getHabitCompletions(userId)
      if (completions) {
        setHabitCompletions(completions)
  
        // Also update completionsByDate for the calendar
        const byDate: CompletionsByDate = {}
        Object.keys(completions).forEach((habitId) => {
          Object.keys(completions[habitId]).forEach((date) => {
            byDate[date] = true
          })
        })
        setCompletionsByDate(byDate)
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
        const completions = await getHabitCompletions(userId)
  
        if (fetchedHabits && completions) {
          // Mark habits as completed_today if they were completed today
          const today = getTodayDateString()
          const habitsWithCompletionStatus = fetchedHabits.map((habit) => ({
            ...habit,
            completed_today: isHabitCompletedOnDate(completions, habit.id, today),
          }))
  
          setHabits(habitsWithCompletionStatus)
          setHabitCompletions(completions)
  
          // Also update completionsByDate for the calendar
          const byDate: CompletionsByDate = {}
          Object.keys(completions).forEach((habitId) => {
            Object.keys(completions[habitId]).forEach((date) => {
              byDate[date] = true
            })
          })
          setCompletionsByDate(byDate)
        } else if (fetchedHabits) {
          setHabits(fetchedHabits)
        } else {
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
                  prevHabits.map((habit) => {
                    if (habit.id === updatedHabit.id) {
                      // Preserve the completed_today status
                      return { ...updatedHabit, completed_today: habit.completed_today }
                    }
                    return habit
                  }),
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
  
              if (payload.eventType === "INSERT") {
                const completion = payload.new
                const habitId = completion.habit_id
                const date = completion.completion_date
  
                // Update habitCompletions
                setHabitCompletions((prev) => {
                  const updated = { ...prev }
                  if (!updated[habitId]) {
                    updated[habitId] = {}
                  }
                  updated[habitId][date] = true
                  return updated
                })
  
                // Update completionsByDate for the calendar
                setCompletionsByDate((prev) => ({
                  ...prev,
                  [date]: true,
                }))
  
                // Update the completed_today status of the habit
                const today = getTodayDateString()
                if (date === today) {
                  setHabits((prevHabits) =>
                    prevHabits.map((habit) => (habit.id === habitId ? { ...habit, completed_today: true } : habit)),
                  )
                }
              } else {
                // For other changes (UPDATE, DELETE), just reload completions
                loadCompletions()
              }
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
  
    // Check if a habit has been completed today
    const isHabitCompletedToday = useCallback(
      (habitId: string): boolean => {
        const today = getTodayDateString()
        return isHabitCompletedOnDate(habitCompletions, habitId, today)
      },
      [habitCompletions],
    )
  
    // Handle completing a habit
    const completeHabit = async (id: string) => {
      try {
        if (!userId) return
  
        // Check if the habit has already been completed today
        if (isHabitCompletedToday(id)) {
          console.log("Habit already completed today")
          return
        }
  
        // Find the habit to update
        const habit = habits.find((h) => h.id === id)
        if (!habit) return
  
        // Optimistically update UI
        setHabits((prevHabits) =>
          prevHabits.map((h) => (h.id === id ? { ...h, streak: (h.streak || 0) + 1, completed_today: true } : h)),
        )
  
        // Get today's date in YYYY-MM-DD format
        const today = getTodayDateString()
  
        // Optimistically update completions
        setHabitCompletions((prev) => {
          const updated = { ...prev }
          if (!updated[id]) {
            updated[id] = {}
          }
          updated[id][today] = true
          return updated
        })
  
        // Update completionsByDate for the calendar
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
          setHabits((prevHabits) =>
            prevHabits.map((h) => (h.id === id ? { ...h, streak: habit.streak, completed_today: false } : h)),
          )
  
          // Revert completion tracking
          setHabitCompletions((prev) => {
            const updated = { ...prev }
            if (updated[id] && updated[id][today]) {
              delete updated[id][today]
            }
            return updated
          })
  
          Alert.alert("Error", "Failed to update habit. Please try again.")
        }
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
      isHabitCompletedToday,
    }
  }