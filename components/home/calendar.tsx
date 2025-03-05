// components/Calendar.tsx
import { CalendarDay } from '@/constants/data';
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

interface CalendarProps {
  days: CalendarDay[];
  onSelectDay: (day: CalendarDay) => void;
}

const Calendar: React.FC<CalendarProps> = ({ days, onSelectDay }) => {
  const today = new Date().getDate();

  return (
    <View className="w-full px-4 py-3 bg-[#F0EFEF] rounded-3xl mb-5 mt-2">
      <View className="flex-row justify-between">
        <FlatList
          data={days}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: day, index }) => {
            const isToday = day.date === today;
            const isPast = day.date < today;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => onSelectDay(day)}
                className={`flex items-center justify-center h-[70px] mr-2 ${
                  isPast ? 'bg-primary' : 
                  isToday ? 'bg-secondary border-2 border-primary' : 
                  'bg-secondary'
                }`}
                style={{ padding: 10, width: 60, borderRadius: 20 }}
              >
                <Text className="text-white font-sora-semibold text-xs">{day.day}</Text>
                <Text className="text-white font-sora-bold text-2xl">{day.date}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default Calendar;