"use client"

import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native"
import * as Linking from "expo-linking";
import { Image } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ChevronRight } from 'lucide-react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated"
import Input from "@/components/input";
import { router } from "expo-router";
import { createSessionFromUrl, performOAuth } from "@/lib/auth-lib";

const quotes = [
  "Build better habits, one streak at a time.",
  "Consistency is the key to success.",
  "Small steps lead to big changes.",
  "Track your progress, celebrate your wins.",
  "Every day is a new opportunity to improve."
]
const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

const AnimatedQuotes = () => {
    const [currentQuote, setCurrentQuote] = useState(0);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Fade out
            opacity.value = withTiming(0, {
                duration: 500,
                easing: Easing.out(Easing.ease)
            });

            // Change quote and fade in
            setTimeout(() => {
                setCurrentQuote((prev) => (prev + 1) % quotes.length);
                opacity.value = withTiming(1, {
                    duration: 500,
                    easing: Easing.in(Easing.ease)
                });
            }, 500);
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={{ height: 40, justifyContent: 'center', alignItems: 'center', width: '90%' }}>
            <Animated.Text
                style={[
                    animatedStyle,
                    {
                        width: '100%',
                        textAlign: 'center'
                    }
                ]}
                className="font-sora-medium text-xl text-neutral-300 text-center"
            >
                {quotes[currentQuote]}
            </Animated.Text>
        </View>
    );
}

const SignIn = () => {
    const [email, setEmail] = useState("")
    const url = Linking.useURL();
    
    useEffect(() => {
        if (url) {
            createSessionFromUrl(url).catch(error => {
                console.error("Error processing URL:", error);
            });
        }
    }, [url]);

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={"padding"}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <View className="flex-1 bg-secondary">
                {/* Purple top section with extreme curve */}
                <View
                    className="justify-end pb-8"
                    style={{
                        height: "55%",
                    }}
                >
                    <View className="flex-1 items-center justify-center">
                        <Image source={require("@/assets/icons/splash-icon-light.png")} className="size-[200px]" resizeMode="contain" />
                        <Text className="font-sora-bold text-5xl text-white">Streek</Text>
                        <View className="mb-4">
                            <AnimatedQuotes />
                        </View>
                    </View>
                </View>

                {/* Form section */}
                <View 
                    className="flex-1 bg-white rounded-t-[40px] px-8 pt-10" 
                >
                    {/* Email input */}
                    <View className="mb-5">
                        <Input 
                            mode="outlined" 
                            value={email} 
                            onChangeText={setEmail} 
                            placeholder="Email" 
                            focus={false} 
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Continue button */}
                    <TouchableOpacity className="flex items-center bg-primary rounded-full w-full py-5 px-32 mb-3" activeOpacity={0.8}>
                        <Text className="font-sora-semibold text-xl text-white text-center">Continue</Text>
                    </TouchableOpacity>

                    {/* Or divider */}
                    <View className="items-center mb-3">
                        <Text className="text-gray-500 font-sora-regular">or</Text>
                    </View>

                    {/* Google Sign In button */}
                    <TouchableOpacity
                        className={`bg-[#e7e7e7] rounded-full py-5 flex-row items-center justify-center ${Platform.OS === 'ios' ? 'mb-7' : 'mb-5'}`}
                        activeOpacity={0.8}
                        onPress={performOAuth}
                    >
                        <FontAwesome name="google" size={24} color="#1B1B3A" className="mr-2"/>
                        <Text className="font-sora-semibold text-lg text-secondary">Sign In with Google</Text>
                    </TouchableOpacity>

                    {/* Skip button */}
                    <TouchableOpacity className={`flex flex-row items-center justify-center border border-gray-300 rounded-full py-5 ${Platform.OS === 'ios' ? 'mt-10' : 'mt-0'}`} activeOpacity={0.8} onPress={() => router.push('/seed')}>
                        <Text className="font-sora-semibold text-lg text-secondary text-center">Skip for now</Text>
                        <ChevronRight color="#1B1B3A"/>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignIn

