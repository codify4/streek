"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getUserProgress,
  getTreeStage,
  calculateProgressPercentage,
  calculateProgressToNextStage,
  addProgressPoints,
  POINTS_PER_COMPLETION,
  type TreeStage,
} from "@/lib/tree-progress"

export const useTreeProgress = (userId: string | undefined) => {
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [treeStage, setTreeStage] = useState<TreeStage | null>(null)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [nextStageProgress, setNextStageProgress] = useState(0)

  // Load user's progress
  const loadProgress = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided to useTreeProgress")
      return
    }

    setLoading(true)
    try {
      console.log("Loading tree progress for user:", userId)
      const userPoints = await getUserProgress(userId)
      console.log("Loaded points:", userPoints)

      setPoints(userPoints)

      // Calculate derived state
      const stage = getTreeStage(userPoints)
      setTreeStage(stage)
      console.log("Current tree stage:", stage)

      const overallProgress = calculateProgressPercentage(userPoints)
      setProgressPercentage(overallProgress)
      console.log("Progress percentage:", overallProgress)

      const nextProgress = calculateProgressToNextStage(userPoints)
      setNextStageProgress(nextProgress)
    } catch (error) {
      console.error("Error loading tree progress:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Add points for completing a habit
  const addHabitCompletionPoints = useCallback(async () => {
    if (!userId) return

    try {
      const newTotal = await addProgressPoints(userId, POINTS_PER_COMPLETION)

      // Update local state
      setPoints(newTotal)

      // Update derived state
      const stage = getTreeStage(newTotal)
      setTreeStage(stage)

      const overallProgress = calculateProgressPercentage(newTotal)
      setProgressPercentage(overallProgress)

      const nextProgress = calculateProgressToNextStage(newTotal)
      setNextStageProgress(nextProgress)

      return true
    } catch (error) {
      console.error("Error adding habit completion points:", error)
      return false
    }
  }, [userId])

  // Load progress on mount
  useEffect(() => {
    if (userId) {
      loadProgress()
    }
  }, [userId, loadProgress])

  return {
    points,
    treeStage,
    progressPercentage,
    nextStageProgress,
    loading,
    addHabitCompletionPoints,
    refreshProgress: loadProgress,
  }
}