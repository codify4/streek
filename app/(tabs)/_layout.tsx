import { Tabs } from 'expo-router';
import { Home, Trophy, Plus } from 'lucide-react-native';
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';

function TabBarIcon(props: {
  name: React.ElementType;
  color: string;
}) {
  return <props.name color={props.color} size={24} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#00B865',
          borderTopWidth: 0,
          height: 60,
            position: 'absolute',
            borderTopColor: '#00B865',
            minHeight: Platform.OS === 'ios' ? 70 : 40,
            alignContent: 'center',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontFamily: 'Sora-Regular',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          animation: 'shift',
          tabBarIcon: ({ color }) => <TabBarIcon name={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              className="absolute -ml-7 items-center justify-center rounded-full bg-primary border-2 border-white"
              style={{ width: 70, height: 70, left: '45%', top: '-90%' }}
              onPress={() => router.push('/add')}
            >
              <Plus color="white" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="wins"
        options={{
          title: 'Wins',
          animation: 'shift',
          tabBarIcon: ({ color }) => <TabBarIcon name={Trophy} color={color} />,
        }}
      />
    </Tabs>
  );
}