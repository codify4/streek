"use client"

// components/HabitCard.tsx
import type { Habit } from "@/constants/data"
import { Flame, Check } from "lucide-react-native"
import { useRef, useState } from "react"
import { View, Text, Dimensions } from "react-native"
import { PanGestureHandler, type PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Layout,
} from "react-native-reanimated"

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
  const [isCompleted, setIsCompleted] = useState(false)
  const isDeleting = useRef(false)

  // Function to handle completion safely
  const handleComplete = (id: string) => {
    setIsCompleted(true)
    onComplete(id)
  }

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD) {
        // Simpler completion animation - just return to center
        translateX.value = withTiming(0, { duration: 300 })
        runOnJS(handleComplete)(habit.id)
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // Delete animation
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })
        isDeleting.current = true
        runOnJS(onDelete)(habit.id)
      } else {
        // Reset position
        translateX.value = withTiming(0)
      }
    },
  })

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const rLeftActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 ? Math.min(1, translateX.value / SWIPE_THRESHOLD) : 0
    return { opacity }
  })

  const rRightActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 ? Math.min(1, -translateX.value / SWIPE_THRESHOLD) : 0
    return { opacity }
  })

  return (
    <Animated.View className="w-full overflow-hidden mb-4" style={rContainerStyle} layout={Layout.springify()}>
      {/* Background action views that extend full width */}
      <View className="absolute inset-0 flex-row justify-between">
        {/* Done action (right swipe) */}
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
          <Text className="text-white font-sora-bold text-lg ml-4">Done</Text>
        </Animated.View>

        {/* Delete action (left swipe) */}
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

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View
          className={`w-full rounded-3xl ${isCompleted ? "bg-primary/10" : ""}`}
          style={[
            rStyle,
            { backgroundColor: isCompleted ? "#e6f7ef" : "#F0EFEF", paddingHorizontal: 20, paddingVertical: 16 },
          ]}
        >
          <View className="flex-col justify-start items-start mb-2">
            <View className="flex-row items-center">
              <Text className="text-secondary font-sora-bold text-3xl">{habit.name}</Text>
              {isCompleted && (
                <View className="ml-3 bg-primary rounded-full p-1">
                  <Check color="white" size={18} strokeWidth={3} />
                </View>
              )}
            </View>
            <View className="flex-row items-center">
              <Flame color="#00B865" size={24} strokeWidth={3} />
              <Text className="text-secondary font-sora-semibold text-xl">{habit.days} days</Text>
            </View>
          </View>
          
          {/* a level up system for the tree */}
          <View className="flex-row items-center">
            <Text className="mr-2 text-lg">🌰</Text>
            <View className="flex-1 h-3 rounded-full" style={{ backgroundColor: "#D9D9D9" }}>
              <View
                className="rounded-full"
                style={{
                  width: `${isCompleted ? 100 : habit.progress}%`, 
                  height: 10,
                  backgroundColor: habit.color,
                }}
              />
            </View>
            <Text className="ml-2 text-lg">🌴</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

export default HabitCard
