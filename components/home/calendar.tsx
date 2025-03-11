// components/Calendar.tsx
import { CalendarDay, getCalendarDays } from '@/constants/data';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

interface CalendarProps {
  onSelectDay: (day: CalendarDay) => void;
}

const Calendar = ({ onSelectDay }: CalendarProps) => {
  const [days, setDays] = useState<CalendarDay[]>(getCalendarDays());
  const [lastCheckedDay, setLastCheckedDay] = useState<number>(new Date().getDay());
  const today = new Date();
  const currentDate = today.getDate();
  const currentDay = today.getDay();
  
  useEffect(() => {
    setLastCheckedDay(currentDay);
    
    const dayCheckInterval = setInterval(() => {
      const now = new Date();
      const nowDay = now.getDay();
      
      // If it's Monday or the day has changed
      if (nowDay !== lastCheckedDay) {
        // Update the calendar days
        const newDays = getCalendarDays();
        setDays(newDays);
        setLastCheckedDay(nowDay);
        
        // Reset selection to today
        const todayIndex = newDays.findIndex(day => day.date === now.getDate());
        if (todayIndex >= 0) {
          onSelectDay(newDays[todayIndex]);
        }
      }
    }, 3600000); // Check every hour
    
    return () => clearInterval(dayCheckInterval);
  }, [lastCheckedDay, onSelectDay]);

  return (
    <View className="w-full px-4 py-3 bg-[#F0EFEF] rounded-3xl mb-5 mt-2">
      <View className="flex-row justify-between">
        <FlatList
          data={days}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: day, index }) => {
            const isToday = day.date === currentDate;
            const isPast = day.date < currentDate;

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