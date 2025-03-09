"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, SafeAreaView, TouchableOpacity, Switch, Platform, Image } from "react-native"
import { ChevronRight, LogOut, User } from "lucide-react-native"
import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { signOut } from "@/lib/auth-lib"

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  const [hapticFeedback, setHapticFeedback] = useState(true)

  // Mock user data - replace with actual user data
  const user = {
    name: "Username",
    email: "username@email.com",
    avatar: null,
  }

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (hapticFeedback && Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setter((prev) => !prev)
  }

  const handleLogout = async () => {
    try {
      if (hapticFeedback && Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }
      await signOut();
      router.replace('/');
    }
    catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Profile Section */}
      <View className="items-center mt-5 mb-6">
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} className="w-20 h-20 rounded-full mb-3 p-5" />
        ) : (
          <View className="w-20 h-20 rounded-full bg-[#1B1B3A] items-center justify-center mb-3 p-5">
            <User color="white" size={40} />
          </View>
        )}
        <Text className="font-sora-bold text-[#1B1B3A] text-3xl">{user.name}</Text>
        <Text className="font-sora-medium text-gray-500 text-xl">{user.email}</Text>
      </View>

      {/* Settings List */}
      <View className="mx-5 bg-white rounded-3xl overflow-hidden mt-5 gap-2 flex justify-between">
        <View className="gap-2">
          {/* Notifications */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200 bg-[#F0EFEF] rounded-2xl">
            <Text className="font-sora-medium text-[#1B1B3A] text-base">Notifications</Text>
            <Switch
              trackColor={{ false: "#D9D9D9", true: "#34C759" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D9D9D9"
              onValueChange={() => toggleSwitch(setNotifications)}
              value={notifications}
            />
          </View>

          {/* Haptic Feedback */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200 bg-[#F0EFEF] rounded-2xl">
            <Text className="font-sora-medium text-[#1B1B3A] text-base">Haptic Feedback</Text>
            <Switch
              trackColor={{ false: "#D9D9D9", true: "#34C759" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#D9D9D9"
              onValueChange={() => toggleSwitch(setHapticFeedback)}
              value={hapticFeedback}
            />
          </View>

          {/* Terms of Service */}
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-5 border-b border-gray-200 bg-[#F0EFEF] rounded-2xl"
            onPress={() => router.push('/(tabs)/(settings)/tos')}
          >
            <Text className="font-sora-medium text-[#1B1B3A] text-base">Terms of Service</Text>
            <ChevronRight color="#1B1B3A" size={20} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-5 bg-[#F0EFEF] rounded-2xl"
            onPress={() => router.push('/(tabs)/(settings)/privacy-policy')}
          >
            <Text className="font-sora-medium text-[#1B1B3A] text-base">Privacy Policy</Text>
            <ChevronRight color="#1B1B3A" size={20} />
          </TouchableOpacity>
        </View>
        {/* Logout Button */}
        <View>
          <TouchableOpacity
            className="flex-row items-center justify-center py-5 bg-red-50 rounded-2xl"
            onPress={handleLogout}
          >
            <LogOut color="#ef4444" size={20} />
            <Text className="font-sora-semibold text-base ml-2" style={{ color: "#ef4444" }}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center mb-8">
          <Text className="font-sora-medium text-gray-400 text-sm">Streek v1.0.0</Text>
        </View>
      </View>

    </SafeAreaView>
  )
}

export default Settings