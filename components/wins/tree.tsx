"use client"

import React, { useState, useCallback, useEffect } from "react"
import { View, Text, TouchableOpacity, Dimensions, Platform } from "react-native"
import Modal from "react-native-modal"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  withTiming,
} from "react-native-reanimated"
import { Sparkles } from "lucide-react-native"
import { useTreeProgress } from "@/hooks/use-tree"
import { useAuth } from "@/context/auth"
import { TREE_STAGES } from "@/lib/tree-progress"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const TreeSection = () => {
  const { session } = useAuth()
  const userId = session?.user?.id
  const { treeStage, nextStageProgress, points, loading, refreshProgress } = useTreeProgress(userId)

  const [isModalVisible, setModalVisible] = useState(false)
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)
  const breathe = useSharedValue(1)
  const sparkleOpacity = useSharedValue(0)
  const sparkleScale = useSharedValue(0.8)

  // Start breathing animation for the tree
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, // Infinite repeat
      true, // Reverse
    )

    // Sparkle animation
    const animateSparkles = () => {
      sparkleOpacity.value = withSequence(withTiming(0.8, { duration: 1000 }), withTiming(0, { duration: 1000 }))
      sparkleScale.value = withSequence(withTiming(1.2, { duration: 1000 }), withTiming(0.8, { duration: 1000 }))

      // Schedule next animation after a random delay
      setTimeout(animateSparkles, Math.random() * 3000 + 2000)
    }

    animateSparkles()
  }, [])

  const toggleModal = useCallback(() => {
    if (!isModalVisible) {
      refreshProgress()
    }

    setModalVisible(!isModalVisible)
    rotation.value = withRepeat(withSequence(withSpring(10), withSpring(-10), withSpring(0)), 2, true)
    scale.value = withSequence(withSpring(1.2), withSpring(1))
  }, [isModalVisible, rotation, scale, refreshProgress])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value * breathe.value }],
    }
  })

  const sparkleStyles = useAnimatedStyle(() => {
    return {
      opacity: sparkleOpacity.value,
      transform: [{ scale: sparkleScale.value }],
    }
  })

  const progressBarWidth = useSharedValue(0)
  const progressBarStyles = useAnimatedStyle(() => {
    return {
      width: `${progressBarWidth.value}%`,
    }
  })

  React.useEffect(() => {
    if (isModalVisible) {
      progressBarWidth.value = withTiming(nextStageProgress, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    } else {
      progressBarWidth.value = 0
    }
  }, [isModalVisible, progressBarWidth, nextStageProgress])

  // Default to seed emoji if loading or no tree stage
  const treeEmoji = treeStage?.emoji || "🌰"
  const progress = loading ? 0 : nextStageProgress

  // Calculate points needed for next stage
  const getNextStage = () => {
    if (!treeStage) return TREE_STAGES[1]

    // If at max stage, return the current stage
    if (treeStage.id === TREE_STAGES.length) {
      return treeStage
    }

    return TREE_STAGES[treeStage.id]
  }

  const nextStage = getNextStage()
  const pointsNeeded = nextStage.minPoints - points

  return (
    <>
      <TouchableOpacity onPress={toggleModal} activeOpacity={0.9}>
        <View
          style={[{
              borderRadius: 24,
              padding: 24,
              backgroundColor: "#1B1B3A0D",
              marginBottom: 32,
            },
            Platform.OS === "ios" ? { 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            } : {},
          ]}
        >
          <Text className="font-sora-bold text-secondary text-2xl mb-4">My Tree</Text>

          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              marginBottom: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background gradient */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                backgroundColor: "rgba(0, 184, 101, 0.1)",
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
              }}
            />

            {/* Sparkles */}
            <Animated.View
              style={[
                sparkleStyles,
                {
                  position: "absolute",
                  top: "20%",
                  right: "25%",
                },
              ]}
            >
              <Sparkles size={20} color="#FFD700" />
            </Animated.View>

            <Animated.View
              style={[
                sparkleStyles,
                {
                  position: "absolute",
                  top: "40%",
                  left: "30%",
                },
              ]}
            >
              <Sparkles size={16} color="#FFD700" />
            </Animated.View>

            {/* Increased container size for the emoji */}
            <View style={{ width: 120, height: 120, alignItems: "center", justifyContent: "center" }}>
              <Animated.Text style={[animatedStyles, { fontSize: 80 }]}>{treeEmoji}</Animated.Text>
            </View>
          </View>

          <View className="flex-row items-center">
            {/* Adjusted container sizes for progress bar emojis */}
            <View style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 24 }}>{treeStage?.emoji || "🌰"}</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 16,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 999,
                overflow: "hidden",
                marginHorizontal: 8,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  backgroundColor: "#00B865",
                  borderRadius: 999,
                }}
              />
            </View>
            <View style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 24 }}>{nextStage.emoji}</Text>
            </View>
          </View>

          <View className="flex-row justify-center mt-3">
            <Text className="font-sora-semibold text-secondary/70 text-sm">
              {treeStage?.id === TREE_STAGES.length
                ? "Maximum Growth Achieved!"
                : `${progress}% to ${nextStage.name} (${pointsNeeded} points needed)`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        useNativeDriver={true}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View
          style={[
            {
              backgroundColor: "white",
              borderRadius: 24,
              padding: 24,
              width: SCREEN_WIDTH * 0.9,
              height: 600,
            },
            Platform.OS === "ios" ? { 
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            } : {
              top: 350
            },
          ]}
        >
          <Text className="font-sora-bold text-secondary text-3xl mb-6">Tree Progress</Text>

          <Animated.View style={animatedStyles} className="items-center mb-8">
            {/* Adjusted container size and emoji size in modal */}
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "rgba(0, 184, 101, 0.1)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 100 }}>{treeEmoji}</Text>
            </View>
            <Text className="font-sora-semibold text-secondary text-2xl">{treeStage?.name || "Seed"}</Text>
            <Text className="font-sora-medium text-secondary/70 mt-1">
              {treeStage?.id === TREE_STAGES.length
                ? "Maximum Growth Achieved!"
                : `${points} points (${pointsNeeded} more to ${nextStage.name})`}
            </Text>
          </Animated.View>

          <View className="mb-6">
            <Text className="font-sora-medium text-secondary text-lg mb-2">
              {treeStage?.id === TREE_STAGES.length ? "Growth Complete" : `Progress to ${nextStage.name}`}
            </Text>
            <View
              style={{
                backgroundColor: "#E2E8F0",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <Animated.View className="h-3 bg-primary rounded-full" style={progressBarStyles} />
            </View>
          </View>

          <View className="mb-8">
            <Text className="font-sora-medium text-secondary text-lg mb-4">Tree Stages</Text>
            {/* Adjusted container sizes for tree stage emojis */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "rgba(0, 184, 101, 0.05)",
                borderRadius: 16,
                padding: 12,
              }}
            >
              {TREE_STAGES.map((stage) => (
                <View
                  key={stage.id}
                  style={{
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{stage.emoji}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleModal}
            style={{
              backgroundColor: "#00B865",
              borderRadius: 999,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text className="font-sora-bold text-white text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

export default TreeSection

