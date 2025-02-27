"use client"

import { router } from "expo-router"
import type React from "react"
import { useEffect, useState } from "react"
import { Text, SafeAreaView, Image, TouchableOpacity, View, Dimensions, StatusBar } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface StarProps {
  size: number
  top: number
  left: number
  delay: number
  duration: number
  color?: string
}

const Star: React.FC<StarProps> = ({ size, top, left, delay, duration, color = "white" }) => {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0.9, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }), -1, true),
    )

    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(-15, { duration: duration, easing: Easing.inOut(Easing.ease) }), -1, true),
    )

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration * 0.4, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: duration * 0.4, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    )
  }, [delay, duration, opacity, translateY, scale])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }))

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
        },
        animatedStyle,
      ]}
    />
  )
}

const StarryBackground: React.FC = () => {
  const { width, height } = Dimensions.get("window")
  const stars: React.ReactNode[] = []

  for (let i = 0; i < 70; i++) {
    const size = Math.random() * 4 + 1
    const top = Math.random() * height
    const left = Math.random() * width
    const delay = Math.random() * 2000
    const duration = Math.random() * 3000 + 3000
    const colors = ["white", "#8AABFF", "#FFD700", "#E6E6FA"]
    const color = colors[Math.floor(Math.random() * colors.length)]

    stars.push(<Star key={i} size={size} top={top} left={left} delay={delay} duration={duration} color={color} />)
  }

  return (
    <View style={{ position: "absolute", width: "100%", height: "100%" }}>
      {stars}
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 30, 0.3)",
        }}
      />
    </View>
  )
}

const AnimatedLogo: React.FC = () => {
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)

  useEffect(() => {
    translateY.value = withRepeat(withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true)

    scale.value = withRepeat(withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [scale, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }))

  return (
    <Animated.View entering={FadeIn.duration(1000)} style={animatedStyle}>
      <Image source={require("@/assets/icons/splash-icon-light.png")} className="size-[200px]" resizeMode="contain" />
    </Animated.View>
  )
}

interface AnimatedButtonProps {
  onPress?: () => void
  title: string
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onPress, title }) => {
  const scale = useSharedValue(1)

  const onPressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 })
  }

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 200 })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View entering={FadeInUp.duration(800).delay(600)} style={animatedStyle}>
      <TouchableOpacity
        className="flex items-center bg-primary rounded-full w-full py-5 px-32"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
        <Text className="font-sora-bold text-xl text-white">{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const Welcome: React.FC = () => {
  return (
    <View className="flex-1 bg-secondary">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <StarryBackground />

      <SafeAreaView className="flex-1 items-center justify-between px-5 w-full">
        <View className="flex items-center w-full mt-32">
          <AnimatedLogo />
          <Animated.Text
            entering={FadeInDown.duration(800).delay(300)}
            className="font-sora-bold text-5xl text-white mt-5 text-center"
          >
            Welcome to Streek
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(800).delay(500)}
            className="font-sora-semibold text-2xl text-white mt-2 text-center"
          >
            Become a better person...
          </Animated.Text>
        </View>
        <View className="flex items-center">
          <AnimatedButton title="Get Started" onPress={() => router.push('/sign-in')} />

          <Animated.Text entering={FadeIn.delay(1000)} className="font-sora-regular text-xs text-white opacity-50 mb-2">
            Version 1.0.0
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Welcome

