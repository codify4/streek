import { View, Text } from "react-native"
import { treeProgress } from "@/constants/wins-data"

const TreeSection = () => {
  const getTreeEmoji = (progress: number) => {
    if (progress < 20) return "🌱"
    if (progress < 40) return "🌿"
    if (progress < 60) return "🌳"
    if (progress < 80) return "🌲"
    return "🌴"
  }

  return (
    <View className="bg-secondary/10 rounded-3xl p-5 mb-6">
      <Text className="font-sora-bold text-secondary text-2xl mb-4">My Tree</Text>

      <View className="bg-white/60 rounded-3xl items-center justify-center p-10 mb-6">
        <Text className="text-8xl">{getTreeEmoji(treeProgress)}</Text>
      </View>

      <View className="flex-row items-center">
        <Text className="mr-2 text-2xl">🌰</Text>
        <View className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
          <View className="h-full bg-primary rounded-full" style={{ width: `${treeProgress}%` }} />
        </View>
        <Text className="ml-2 text-2xl">🌴</Text>
      </View>
    </View>
  )
}

export default TreeSection