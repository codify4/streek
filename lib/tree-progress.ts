"use client"

import { supabase } from "./supabase"

// Define tree stages with their point thresholds
export interface TreeStage {
  id: number
  name: string
  emoji: string
  minPoints: number
  maxPoints: number
}

export const POINTS_PER_COMPLETION = 2
export const MAX_POINTS = 1000

export const TREE_STAGES: TreeStage[] = [
  { id: 1, name: "Seed", emoji: "🌰", minPoints: 0, maxPoints: 99 },
  { id: 2, name: "Sprout", emoji: "🌱", minPoints: 100, maxPoints: 299 },
  { id: 3, name: "Sapling", emoji: "🌿", minPoints: 300, maxPoints: 499 },
  { id: 4, name: "Young Tree", emoji: "🌳", minPoints: 500, maxPoints: 699 },
  { id: 5, name: "Mature Tree", emoji: "🌲", minPoints: 700, maxPoints: 999 },
  { id: 6, name: "Mighty Tree", emoji: "🌴", minPoints: 1000, maxPoints: 1000 },
]

// Get the current tree stage based on points
export const getTreeStage = (points: number): TreeStage => {
  const stage = TREE_STAGES.find((stage) => points >= stage.minPoints && points <= stage.maxPoints)
  return stage || TREE_STAGES[0] // Default to first stage if not found
}

// Calculate progress percentage (0-100)
export const calculateProgressPercentage = (points: number): number => {
  // Calculate exact percentage with 1 decimal place
  const exactPercentage = (points / MAX_POINTS) * 100

  // If less than 1%, return the exact value with 1 decimal place
  if (exactPercentage < 1) {
    return Number.parseFloat(exactPercentage.toFixed(1))
  }

  // Otherwise round to nearest integer
  return Math.min(Math.round(exactPercentage), 100)
}

// Calculate progress to next stage (0-100)
export const calculateProgressToNextStage = (points: number): number => {
  const currentStage = getTreeStage(points)

  // If at max stage, return 100%
  if (currentStage.id === TREE_STAGES.length) {
    return 100
  }

  // Calculate progress within the current stage
  const stageRange = currentStage.maxPoints - currentStage.minPoints
  const pointsInCurrentStage = points - currentStage.minPoints

  // Calculate percentage within current stage (0-100)
  const percentage = Math.round((pointsInCurrentStage / stageRange) * 100)

  return percentage
}

// Get user's tree progress from database
export const getUserProgress = async (userId: string): Promise<number> => {
  try {
    console.log("Getting progress for user ID:", userId)

    const { data, error } = await supabase.from("user_profiles").select("progress").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user progress:", error)
      return 0
    }

    console.log("User progress data:", data)
    return data?.progress || 0
  } catch (error) {
    console.error("Error in getUserProgress:", error)
    return 0
  }
}

// Update user's tree progress in database
export const updateUserProgress = async (userId: string, points: number): Promise<boolean> => {
  try {
    console.log("Updating progress for user ID:", userId, "to", points, "points")

    const { error } = await supabase.from("user_profiles").update({ progress: points }).eq("id", userId)

    if (error) {
      console.error("Error updating user progress:", error)
      return false
    }

    console.log("Progress updated successfully")
    return true
  } catch (error) {
    console.error("Error in updateUserProgress:", error)
    return false
  }
}

// Add points to user's progress
export const addProgressPoints = async (userId: string, pointsToAdd: number): Promise<number> => {
  try {
    // Get current progress
    const currentPoints = await getUserProgress(userId)
    console.log("Current points:", currentPoints, "Adding:", pointsToAdd)

    // Calculate new total (cap at MAX_POINTS)
    const newTotal = Math.min(currentPoints + pointsToAdd, MAX_POINTS)

    // Update in database
    await updateUserProgress(userId, newTotal)

    return newTotal
  } catch (error) {
    console.error("Error adding progress points:", error)
    return 0
  }
}

