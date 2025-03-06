import type React from "react"
import { View, Text } from "react-native"
import { Flame, RefreshCw, Target } from "lucide-react-native"
import { stats } from "@/constants/wins-data"

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
}

const StatCard = ({ title, value, subtitle, icon }: StatCardProps) => {
    return (
        <View className="bg-secondary/10 rounded-3xl p-4 flex-1">
            <View className="flex-row justify-between items-start mb-2">{icon}</View>
            <View>
                <Text className="font-sora-bold text-secondary text-4xl mb-1">{value}</Text>
                <Text className="font-sora-medium text-secondary/70 text-sm">{title}</Text>
            </View>
        </View>
    )
}

const StatsSection = () => {
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

    return (
        <View className="flex-row justify-between gap-4 mb-6">
            {stats.map((stat) => (
                <StatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                    icon={getIcon(stat.iconName)}
                />
            ))}
        </View>
    )
}

export default StatsSection