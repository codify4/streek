"use client"

import { useEffect } from "react"
import { View, Text, SafeAreaView, TouchableOpacity, Platform } from "react-native"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { StarryBackground } from "./index"
import { router } from "expo-router"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

const Seed = () => {
  // Animation values
  const cardScale = useSharedValue(0.8)
  const cardOpacity = useSharedValue(0)
  const titleOpacity = useSharedValue(0)
  const buttonOpacity = useSharedValue(0)
  const seedRotation = useSharedValue(0)
  const seedScale = useSharedValue(0.9)

  // Floating animation for the seed
  useEffect(() => {
    // Initial entrance animations
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }))
    cardOpacity.value = withDelay(600, withTiming(1, { duration: 800 }))
    cardScale.value = withDelay(600, withSpring(1, { damping: 12 }))
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }))

    // Continuous floating animation for the seed
    const interval = setInterval(() => {
      seedScale.value = withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      )

      seedRotation.value = withSequence(
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }))

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: interpolate(titleOpacity.value, [0, 1], [-20, 0]) }],
  }))

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: interpolate(buttonOpacity.value, [0, 1], [20, 0]) }],
  }))

  const seedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: seedScale.value }, { rotate: `${seedRotation.value}rad` }],
  }))

  return (
    <View className="flex-1 bg-secondary">
      <StarryBackground />
      <SafeAreaView className="flex-1 items-center">
        <View className="flex flex-col items-center justify-center gap-12 w-full h-full px-5">
          <Animated.View className="flex flex-col items-center w-full" style={titleAnimatedStyle}>
            <Text className="font-sora-bold text-3xl text-white mb-2">You just won a seedling!</Text>
            <Text className="font-sora-medium text-lg text-white text-center">
              By staying consistent with your habits, you can grow the seed into a big tree.
            </Text>
          </Animated.View>

          <Animated.View style={[{ width: 320, height: 380, borderRadius: 24, overflow: "hidden" }, cardAnimatedStyle]}>
            <LinearGradient
              colors={["#00B865", "#2E7D32"]}
              style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
            >
              <View
                style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.1)" }}
              />
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 999, padding: 32 }}>
                  <Animated.View style={seedAnimatedStyle}>
                    <MaterialCommunityIcons name="seed" size={150} color="#FFEB3B" />
                  </Animated.View>
                </View>
                <Text style={{ fontFamily: "sora-medium", color: "white", fontSize: 20, marginTop: 16 }}>
                  Your New Seedling
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFEB3B" />
                  <Text style={{ fontFamily: "sora-medium", color: "white", fontSize: 14, marginLeft: 4 }}>
                    Ready to grow
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={buttonAnimatedStyle} className="w-full">
            <TouchableOpacity
              className="bg-primary rounded-full w-full py-5 shadow-lg"
              activeOpacity={0.8}
              onPress={() => router.push("/onboarding")}
              style={Platform.OS === "ios" ? { paddingHorizontal: 80 } : { paddingHorizontal: 90 }}
            >
              <LinearGradient
                colors={["#FF9800", "#F57C00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="absolute inset-0 rounded-full"
              />
              <Text className="font-sora-semibold text-xl text-white text-center">Grow your seedling</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Seed

