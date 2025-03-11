"use client"

import { router, Tabs } from "expo-router"
import { Home, Trophy, Plus, ChevronLeft } from "lucide-react-native"
import type React from "react"
import { useCallback, useRef, useState } from "react"
import { View, TouchableOpacity, Platform, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import BotSheet from "@/components/bot-sheet"
import type BottomSheet from "@gorhom/bottom-sheet"
import * as Haptics from "expo-haptics"
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from "reanimated-color-picker"
import Input from "@/components/input"
import AddHabit from "@/components/add-habit"
import { Habit } from "@/lib/habits"

function TabBarIcon(props: {
  name: React.ElementType
  color: string
  size?: number
}) {
  return <props.name color={props.color} size={props.size || 24} strokeWidth={2} />
}

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [value, setValue] = useState("")

  const handleOpenBottomSheet = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    bottomSheetRef.current?.expand()
  }

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleHabitCreated = useCallback(
    (habit: Habit) => {
      // Close the bottom sheet
      handleCloseBottomSheet()

      // Navigate to home tab to see the new habit
      // This is optional - you can remove this if you don't want to navigate
      router.push("/(tabs)/home")

      // You could also emit an event here that the home screen listens for
      // to refresh its habit list, if you prefer that approach
    },
    [handleCloseBottomSheet],
  )


  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#00B865",
            borderTopWidth: 0,
            minHeight: Platform.OS === "ios" ? 80 : 65,
            position: "absolute",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
            paddingTop: 10,
            paddingBottom: Platform.OS === "ios" ? 25 : 10,
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
          tabBarLabelStyle: {
            fontFamily: "Sora-Medium",
            fontSize: 12,
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View className={`p-2 rounded-full`}>
                <TabBarIcon name={Home} color={color} size={focused ? 26 : 24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "",
            tabBarButton: () => (
              <TouchableOpacity
                className="absolute items-center justify-center rounded-full bg-primary shadow-md"
                style={{
                  width: 70,
                  height: 70,
                  left: "50%",
                  marginLeft: -35,
                  top: -25,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
                onPress={handleOpenBottomSheet}
              >
                <Plus color="white" size={32} strokeWidth={2.5} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="wins"
          options={{
            title: "Wins",
            tabBarIcon: ({ color, focused }) => (
              <View className={`p-2 rounded-full`}>
                <TabBarIcon name={Trophy} color={color} size={focused ? 26 : 24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen 
          name='(settings)/privacy-policy' 
          options={{
              href: null,
              title: 'Privacy Policy',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleStyle: {
                color: '#1B1B3A',
                fontSize: 18,
                fontWeight: '600',
              },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/(tabs)/(settings)/settings')}>
                    <ChevronLeft size={30} color={'#1B1B3A'} />
                </TouchableOpacity>
              ),
          }}
        />
        <Tabs.Screen 
          name='(settings)/tos' 
          options={{
              href: null,
              title: 'Terms of Service',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleStyle: {
                color: '#1B1B3A',
                fontSize: 18,
                fontWeight: '600',
              },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/(tabs)/(settings)/settings')}>
                    <ChevronLeft size={30} color={'#1B1B3A'} />
                </TouchableOpacity>
              ),
          }}
        />
        <Tabs.Screen 
          name='(settings)/settings' 
          options={{
              href: null,
              title: 'Settings',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTitleStyle: {
                color: '#1B1B3A',
                fontSize: 18,
                fontWeight: '600',
              },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                    <ChevronLeft size={30} color={'#1B1B3A'} />
                </TouchableOpacity>
              ),
          }}
        />
      </Tabs>

      <BotSheet ref={bottomSheetRef} snapPoints={["80%"]}>
        <AddHabit onClose={handleCloseBottomSheet} onHabitCreated={handleHabitCreated} />
      </BotSheet>
    </>
  )
}

