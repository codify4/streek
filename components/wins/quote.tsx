"use client"

import { useState, useEffect } from "react"
import { View, Text } from "react-native"
import { quotes } from "@/constants/wins-data"

const QuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  return (
      <View className="bg-secondary/10 rounded-3xl p-5 mb-6">
        <Text className="font-sora-bold text-secondary text-2xl mb-4">Quote of the day</Text>
        <View className="bg-white/60 rounded-3xl p-5">
          <Text className="font-sora-bold text-secondary text-xl mb-3">"{currentQuote.text}"</Text>
          <Text className="font-sora-medium text-secondary/70 text-right">By {currentQuote.author}</Text>
        </View>
      </View>
  )
}

export default QuoteSection