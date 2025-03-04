// app/home.tsx
import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import Calendar from '@/components/home/calendar';
import HabitCard from '@/components/home/habit-card';
import { habits, calendarDays, CalendarDay } from '@/constants/data';

const Home = () => {
  const [selectedDay, setSelectedDay] = useState<CalendarDay>(
    calendarDays.find(day => day.isActive) || calendarDays[0]
  );

  const handleSelectDay = (day: CalendarDay) => {
    const updatedDays = calendarDays.map(d => ({
      ...d,
      isActive: d.day === day.day
    }));
    setSelectedDay(day);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 w-full">
        <View className="flex-row items-center">
          <Image 
            source={require('@/assets/icons/splash-icon-light.png')} 
            className="mr-2" 
            style={{ width: 40, height: 40 }} 
            resizeMode="contain" 
          />
          <Text className="font-sora-bold text-[#1B1B3A] text-3xl">Streek</Text>
        </View>
        <TouchableOpacity>
          <Settings color="#1B1B3A" size={26} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 bg-white">
        {/* Calendar */}
        <Calendar days={calendarDays} onSelectDay={handleSelectDay} />
        
        {/* Habit Cards */}
        {habits.map(habit => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
        
        {/* Add some padding at the bottom for the tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;