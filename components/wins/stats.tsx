"use client"

import { useEffect } from "react"
import type React from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { Flame, RefreshCw, Target } from "lucide-react-native"
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing 
} from "react-native-reanimated"
import type { Stat } from "@/constants/wins-data"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  index: number
}

const StatCard = ({ title, value, subtitle, icon, index }: StatCardProps) => {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)
  const scale = useSharedValue(0.95)

  useEffect(() => {
    opacity.value = withDelay(
      index * 150, 
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    )
    translateY.value = withDelay(
      index * 150, 
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    )
    scale.value = withDelay(
      index * 150, 
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    )
  }, [index, opacity, translateY, scale])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    }
  })

  return (
    <Animated.View 
      style={[
        animatedStyle,
        {
          flex: 1,
          borderRadius: 24,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          backgroundColor: "#1B1B3A0D"
        }
      ]}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View 
          style={{
            backgroundColor: "rgba(0, 184, 101, 0.15)",
            borderRadius: 12,
            padding: 8
          }}
        >
          {icon}
        </View>
      </View>
      <View>
        <Text className="font-sora-bold text-secondary text-4xl mb-1">{value}</Text>
        <Text className="font-sora-medium text-secondary/70 text-sm">{title}</Text>
      </View>
    </Animated.View>
  )
}

interface StatsSectionProps {
  stats: Stat[]
  loading?: boolean
}

const StatsSection = ({ stats, loading = false }: StatsSectionProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "flame":
        return <Flame color="#00B865" size={24} strokeWidth={2.5} />
      case "refresh-cw":
        return <RefreshCw color="#00B865" size={24} strokeWidth={2.5} />
      case "target":
        return <Target color="#00B865" size={24} strokeWidth={2.5} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <View className="flex-row justify-center items-center py-8">
        <ActivityIndicator size="large" color="#00B865" />
      </View>
    )
  }

  return (
    <View className="flex-row justify-between gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={getIcon(stat.iconName)}
          index={index}
        />
      ))}
    </View>
  )
}

export default StatsSection
