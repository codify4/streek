import React from "react";
import "../global.css"
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/context/auth";
import { useRouter, useSegments } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading, onboardingCompleted } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    console.log("Auth state:", { 
      session: !!session, 
      onboardingCompleted, 
      currentRoute: segments[0] || 'root',
      loading
    });
    
    // Get current route
    const currentRoute = segments[0] || '';
    
    if (!session) {
      // Not authenticated
      // Allow access to landing page and sign-in
      // No automatic redirects for unauthenticated users
      // They can freely navigate between / and /sign-in
      return;
    } else {
      // User is authenticated
      if (onboardingCompleted) {
        // User has completed onboarding - send to home
        const inAuthGroup = segments[0] === '(tabs)';
        const isLoadingScreen = segments[0] === 'loading-screen';
        
        if (!inAuthGroup && !isLoadingScreen) {
          router.replace('/(tabs)/home');
        }
      } else {
        // User hasn't completed onboarding - allow onboarding flow
        const isSeed = segments[0] === 'seed';
        const isOnboarding = segments[0] === 'onboarding';
        const isLoadingScreen = segments[0] === 'loading-screen';
        
        if (!isSeed && !isOnboarding && !isLoadingScreen) {
          router.replace('/seed');
        }
      }
    }
  }, [session, loading, onboardingCompleted, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="seed" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="loading-screen" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

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
    <GestureHandlerRootView>
      <AuthProvider>
        <RootLayoutNav />
        <StatusBar style="light" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
