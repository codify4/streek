import React from "react";
import "../global.css"
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Sora-Regular': require('@/assets/fonts/Sora-Regular.ttf'),
    'Sora-Medium': require('@/assets/fonts/Sora-Medium.ttf'),
    'Sora-SemiBold': require('@/assets/fonts/Sora-SemiBold.ttf'),
    'Sora-Bold': require('@/assets/fonts/Sora-Bold.ttf'),
    'Sora-ExtraBold': require('@/assets/fonts/Sora-ExtraBold.ttf'),
    'Sora-Thin': require('@/assets/fonts/Sora-Thin.ttf'),
    'Sora-Light': require('@/assets/fonts/Sora-Light.ttf'),
    'Sora-ExtraLight': require('@/assets/fonts/Sora-ExtraLight.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
