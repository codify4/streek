"use client"

import { Platform, SafeAreaView, ScrollView, View, RefreshControl } from "react-native"
import StatsSection from "@/components/wins/stats"
import TreeSection from "@/components/wins/tree"
import QuoteSection from "@/components/wins/quote"
import Header from "@/components/header"
import { useAuth } from "@/context/auth"
import { useState, useCallback } from "react"
import { useHabits } from "@/hooks/use-habits"
import { useUserStats } from "@/hooks/use-user-stats"

const Wins = () => {
  const { session } = useAuth()
  const userId = session?.user?.id
  const { habits } = useHabits(userId)
  const { getFormattedStats, loading, refreshStats } = useUserStats(userId, habits)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshStats()
    setRefreshing(false)
  }, [refreshStats])

  return (
    <SafeAreaView className="flex-1 bg-white" style={Platform.OS === "ios" ? { marginTop: 0 } : { marginTop: 40 }}>
      <Header title="Your Wins" />
      <ScrollView
        className="flex-1 px-5"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <StatsSection stats={getFormattedStats()} loading={loading} />
        <TreeSection />
        <QuoteSection />
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Wins

