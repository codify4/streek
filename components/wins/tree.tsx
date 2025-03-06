"use client"

import React, { useState, useCallback } from "react"
import { View, Text, TouchableOpacity, Dimensions } from "react-native"
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
import { treeProgress } from "@/constants/wins-data"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const TreeSection = () => {
  const [isModalVisible, setModalVisible] = useState(false)
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)

  const toggleModal = useCallback(() => {
    setModalVisible(!isModalVisible)
    rotation.value = withRepeat(withSequence(withSpring(10), withSpring(-10), withSpring(0)), 2, true)
    scale.value = withSequence(withSpring(1.2), withSpring(1))
  }, [isModalVisible, rotation, scale])

  const getTreeEmoji = (progress: number) => {
    if (progress < 20) return "🌱"
    if (progress < 40) return "🌿"
    if (progress < 60) return "🌳"
    if (progress < 80) return "🌲"
    return "🌴"
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
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
      progressBarWidth.value = withTiming(treeProgress, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    } else {
      progressBarWidth.value = 0
    }
  }, [isModalVisible, progressBarWidth])

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <View className="bg-secondary/10 rounded-3xl p-6 mb-8">
          <Text className="font-sora-bold text-secondary text-2xl mb-4">My Tree</Text>

          <View className="bg-white/60 rounded-3xl items-center justify-center p-10 mb-6">
            <Animated.Text style={animatedStyles} className="text-8xl">
              {getTreeEmoji(treeProgress)}
            </Animated.Text>
          </View>

          <View className="flex-row items-center">
            <Text className="mr-2 text-2xl">🌰</Text>
            <View className="flex-1 h-4 bg-white rounded-full overflow-hidden">
              <View className="h-full bg-primary rounded-full" style={{ width: `${treeProgress}%` }} />
            </View>
            <Text className="ml-2 text-2xl">🌴</Text>
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
        <View className="bg-white rounded-3xl p-6" style={{ width: SCREEN_WIDTH * 0.9 }}>
          <Text className="font-sora-bold text-secondary text-3xl mb-6">Tree Progress</Text>

          <Animated.View style={animatedStyles} className="items-center mb-8">
            <Text className="text-9xl mb-4">{getTreeEmoji(treeProgress)}</Text>
            <Text className="font-sora-semibold text-secondary text-2xl">{treeProgress}% Growth</Text>
          </Animated.View>

          <View className="mb-6">
            <Text className="font-sora-medium text-secondary text-lg mb-2">Growth Progress</Text>
            <View className="h-6 bg-[#E2E8F0] rounded-full overflow-hidden">
              <Animated.View className="h-3 bg-primary rounded-full" style={progressBarStyles} />
            </View>
          </View>

          <View className="mb-6">
            <Text className="font-sora-medium text-secondary text-lg mb-2">Tree Stages</Text>
            <View className="flex-row justify-between">
              <Text className="text-2xl">🌰</Text>
              <Text className="text-2xl">🌱</Text>
              <Text className="text-2xl">🌿</Text>
              <Text className="text-2xl">🌳</Text>
              <Text className="text-2xl">🌲</Text>
              <Text className="text-2xl">🌴</Text>
            </View>
          </View>

          <TouchableOpacity onPress={toggleModal} className="bg-primary rounded-full py-3 items-center">
            <Text className="font-sora-bold text-white text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  )
}

export default TreeSection

