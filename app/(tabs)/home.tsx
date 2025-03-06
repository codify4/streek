// app/home.tsx
import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Settings } from 'lucide-react-native';
import Calendar from '@/components/home/calendar';
import HabitCard from '@/components/home/habit-card';
import { habits as initialHabits, calendarDays, CalendarDay, Habit } from '@/constants/data';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Header from '@/components/header';

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
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

  const handleCompleteHabit = (id: string) => {
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Update habit progress or mark as complete
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { ...habit, progress: 100 } 
          : habit
      )
    );
    
    // You might want to add some delay before removing the habit or showing a success message
    setTimeout(() => {
      // Optional: Remove the completed habit or show a success message
    }, 500);
  };

  const handleDeleteHabit = (id: string) => {
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    // Remove the habit from the list
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  const scrollGesture = Gesture.Pan().activeOffsetY([-10, 10]);


  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title='Habits'/>

      <View className='px-5'>
        <Calendar days={calendarDays} onSelectDay={handleSelectDay} />
      </View>

      <GestureDetector gesture={scrollGesture}>
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          renderItem={({item: habit}) => (
            <HabitCard
              habit={habit}
              onComplete={handleCompleteHabit} 
              onDelete={handleDeleteHabit}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ListFooterComponent={() => <View className="h-24" />}
        />
      </GestureDetector>
    </SafeAreaView>
  );
};

export default Home;