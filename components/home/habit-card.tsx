"use client"

import { Check, Flame, Calendar, Award, TrendingUp } from "lucide-react-native"
import { useRef, useState, useEffect } from "react"
import { View, Text, Dimensions, Platform } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Layout,
  withSequence,
} from "react-native-reanimated"
import type { Habit } from "@/lib/habits"

interface HabitCardProps {
  habit: Habit
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3

const HabitCard = ({ habit, onComplete, onDelete }: HabitCardProps) => {
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const isDeleting = useRef(false)

  // Initialize isCompleted state based on habit.completed_today
  useEffect(() => {
    setIsCompleted(habit.completed_today || false)
  }, [habit.completed_today])

  const handleComplete = (id: string) => {
    // Only mark as completed if not already completed
    if (!isCompleted) {
      // Animate the card when completed
      scale.value = withSequence(withTiming(1.05, { duration: 200 }), withTiming(1, { duration: 200 }))
      setIsCompleted(true)
      onComplete(id)
    } else {
      // If already completed, just bounce back
      translateX.value = withTiming(0, { duration: 300 })
    }
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = event.translationX
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(0, { duration: 300 })
        runOnJS(handleComplete)(habit.id)
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })
        isDeleting.current = true
        runOnJS(onDelete)(habit.id)
      } else {
        translateX.value = withTiming(0)
      }
    })

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }))

  const rContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const rLeftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? Math.min(1, translateX.value / SWIPE_THRESHOLD) : 0,
  }))

  const rRightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(1, -translateX.value / SWIPE_THRESHOLD) : 0,
  }))

  // Get a lighter shade of the habit color for the background
  const getLighterColor = () => {
    // If habit.color is a hex value, convert it to a lighter shade
    if (habit.color.startsWith("#")) {
      return habit.color + "30" // Adding 15 for 15% opacity
    }
    // For named colors, return a light background
    return isCompleted ? "#e6f7ef" : "#F0EFEF"
  }

  // Calculate streak milestone
  const getStreakMilestone = () => {
    if (habit.streak >= 100) return "💯"
    if (habit.streak >= 50) return "🔥"
    if (habit.streak >= 30) return "🌟"
    if (habit.streak >= 14) return "✨"
    if (habit.streak >= 7) return "👏"
    return ""
  }

  return (
    <Animated.View className="w-full overflow-hidden mb-4" style={rContainerStyle} layout={Layout.springify()}>
      <View className="absolute inset-0 flex-row justify-between">
        <Animated.View
          className="bg-primary h-full justify-center pl-6 rounded-3xl"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              borderRadius: 24,
            },
            rLeftActionStyle,
          ]}
        >
          <Text className="text-white font-sora-bold text-lg ml-4">{isCompleted ? "Already Done" : "Done"}</Text>
        </Animated.View>

        <Animated.View
          className="bg-red-500 h-full items-end justify-center pr-6 rounded-3xl"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              borderRadius: 24,
              backgroundColor: "#ef4444",
            },
            rRightActionStyle,
          ]}
        >
          <Text className="text-white font-sora-bold text-lg mr-4">Delete</Text>
        </Animated.View>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            rStyle,
            {
              backgroundColor: getLighterColor(),
              borderRadius: 24,
              padding: 20,
            },
            Platform.OS === "ios" ? { 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            } : {},
          ]}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-secondary font-sora-bold text-2xl">{habit.name}</Text>
                {isCompleted && (
                  <View className="ml-3 bg-primary rounded-full p-1">
                    <Check color="white" size={16} strokeWidth={3} />
                  </View>
                )}
              </View>

              <View className="flex-row items-center mt-1">
                <Calendar size={14} color="#666" />
                <Text className="text-gray-500 font-sora-medium text-sm ml-1">Daily</Text>
              </View>
            </View>

            {/* Streak badge */}
            <View
              style={{
                backgroundColor: isCompleted ? habit.color : "#f0f0f0",
                borderRadius: 12,
                padding: 8,
                minWidth: 70,
                alignItems: "center",
              }}
            >
              <View className="flex-row items-center justify-center">
                <Flame
                  size={16}
                  color={isCompleted ? "white" : habit.color}
                  fill={isCompleted ? "white" : habit.color}
                />
                <Text
                  style={{
                    fontFamily: "sora-semibold",
                    fontSize: 16,
                    marginLeft: 4,
                    color: isCompleted ? "white" : "#333",
                  }}
                >
                  {habit.streak}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "sora-medium",
                  fontSize: 12,
                  color: isCompleted ? "white" : "#666",
                }}
              >
                {habit.streak === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>

          {/* Stats section */}
          <View className="flex-row justify-between mt-4 pt-3 border-t border-white">
            {/* Milestone */}
            <View className="flex-row items-center">
              <Award size={16} color="#666" />
              <Text className="text-gray-600 font-sora-medium text-sm ml-1">
                {getStreakMilestone() ? `${getStreakMilestone()} Milestone` : "Keep going!"}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}

export default HabitCard

