import { Tabs } from 'expo-router';
import { Home, Trophy } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
            backgroundColor: '#00B865',
            position: 'absolute',
            borderTopColor: '#00B865',
            borderTopWidth: Platform.OS === 'ios' ? 1 : 0,
            minHeight: Platform.OS === 'ios' ? 70 : 40,
            alignContent: 'center',
        },
        tabBarActiveTintColor: '#fff',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
            fontFamily: 'Sora-Regular'
        }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color='white' size={size} />
          ),
          tabBarLabelStyle: {
            fontFamily: 'Sora-Medium',
            color: '#fff'
          }
        }}
      />
      <Tabs.Screen
        name="wins"
        options={{
          title: 'Wins',
          tabBarIcon: ({ color, size }) => (
            <Trophy color='white' size={size} />
          ),
          tabBarLabelStyle: {
            fontFamily: 'Sora-Medium',
            color: '#fff'
          }
        }}
      />
    </Tabs>
  );
}
