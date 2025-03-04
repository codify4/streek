// components/HabitCard.tsx
import { Habit } from '@/constants/data';
import { Flame } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard = ({ habit }: HabitCardProps) => {
  return (
    <View className="w-full rounded-3xl mb-4" style={{ backgroundColor: '#F0EFEF', paddingHorizontal: 20, paddingVertical: 16 }}>
      <View className="flex-col justify-start items-start mb-2">
        <Text className="text-secondary font-sora-bold text-3xl">{habit.name}</Text>
        <View className="flex-row items-center">
          <Flame color="#00B865" size={24} strokeWidth={3} />
          <Text className="text-secondary font-sora-semibold text-xl">{habit.days} days</Text>
        </View>
      </View>
      
      <View className="flex-row items-center">
        <Text className="mr-2 text-lg">🌰</Text>
        <View className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#D9D9D9' }}>
          <View 
            className="rounded-full" 
            style={{ 
              width: `${habit.progress}%`,
              height: 10,
              backgroundColor: habit.color
            }} 
          />
        </View>
        <Text className="ml-2 text-lg">🌴</Text>
      </View>
    </View>
  );
};

export default HabitCard;