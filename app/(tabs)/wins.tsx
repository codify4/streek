import { SafeAreaView, ScrollView, View } from "react-native"
import StatsSection from "@/components/wins/stats"
import TreeSection from "@/components/wins/tree"
import QuoteSection from "@/components/wins/quote"
import Header from "@/components/header"

const Wins = () => {
  return (
    <SafeAreaView className="flex-1 bg-white mt-10">
      <Header title="Your Wins" />
      <ScrollView className="flex-1 px-5">
        <StatsSection />
        <TreeSection />
        <QuoteSection />
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Wins

