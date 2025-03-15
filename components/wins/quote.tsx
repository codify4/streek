"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Platform } from "react-native"
import { quotes } from "@/constants/wins-data"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from "react-native-reanimated"
import { Quote } from "lucide-react-native"

const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [quoteIndex, setQuoteIndex] = useState(0)

  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)
  const quoteMarkOpacity = useSharedValue(0.2)
  const quoteMarkScale = useSharedValue(1)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuoteIndex(randomIndex)
    setCurrentQuote(quotes[randomIndex])

    // Initial animation
    opacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })

    // Subtle animation for quote mark
    quoteMarkOpacity.value = withSequence(withTiming(0.3, { duration: 1500 }), withTiming(0.15, { duration: 1500 }))

    // Set up interval for subtle animations
    const interval = setInterval(() => {
      quoteMarkScale.value = withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const changeQuote = () => {
    // Animate out
    opacity.value = withTiming(0, { duration: 300 })
    translateY.value = withTiming(10, { duration: 300 })

    setTimeout(() => {
      // Change quote
      const newIndex = (quoteIndex + 1) % quotes.length
      setQuoteIndex(newIndex)
      setCurrentQuote(quotes[newIndex])

      // Animate in
      opacity.value = withTiming(1, { duration: 500 })
      translateY.value = withTiming(0, { duration: 500 })
    }, 300)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }
  })

  const quoteMarkStyle = useAnimatedStyle(() => {
    return {
      opacity: quoteMarkOpacity.value,
      transform: [{ scale: quoteMarkScale.value }],
    }
  })

  return (
    <TouchableOpacity onPress={changeQuote} activeOpacity={0.9}>
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
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-sora-bold text-secondary text-2xl">Quote of the day</Text>
          <Quote color="#00B865" size={20} />
        </View>

        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 20,
            padding: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background quote mark */}
          <Animated.View
            style={[
              quoteMarkStyle,
              {
                position: "absolute",
                right: -10,
                bottom: -10,
              },
            ]}
          >
            <Quote color="#00B865" size={100} />
          </Animated.View>

          <Animated.View style={animatedStyle}>
            <Text className="font-sora-bold text-secondary text-xl mb-4">"{currentQuote.text}"</Text>
            <Text className="font-sora-medium text-secondary/70 text-right">By {currentQuote.author}</Text>
          </Animated.View>
        </View>

        <Text className="font-sora-medium text-secondary/50 text-xs text-center mt-2">Tap to see another quote</Text>
      </View>
    </TouchableOpacity>
  )
}

export default QuoteSection

