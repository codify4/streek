// app/loading-screen.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import CircularProgress from "@/components/onboarding/circular-progress";

const LoadingScreen: React.FC = () => {
  // Navigate to home after the loading animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 4000); // Slightly longer than the animation duration to ensure it completes

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#1B1B3A]">
      <CircularProgress />
    </View>
  );
};

export default LoadingScreen;