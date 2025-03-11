"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, Alert } from "react-native"
import Input from "./input"
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  type returnedResults,
} from "reanimated-color-picker"
import { createHabit } from "@/lib/habits"
import * as Haptics from "expo-haptics"
import { useAuth } from "@/context/auth"

interface AddHabitProps {
  onClose: () => void
  onHabitCreated?: (habit: any) => void // Optional callback to refresh habits list
}

const AddHabit: React.FC<AddHabitProps> = ({ onClose, onHabitCreated }) => {
    const [title, setTitle] = useState("")
    const [color, setColor] = useState("#00B865")
    const [isLoading, setIsLoading] = useState(false)

    const { session } = useAuth()
    const user = session?.user

    const onChangeText = (text: string) => {
        setTitle(text)
    }

    const onSelectColor = (colors: returnedResults) => {
        setColor(colors.hex)
    }

    const handleCreateHabit = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter a habit name")
            return
        }

        if (!user?.id) {
            Alert.alert("Error", "You must be logged in to create a habit")
            return
        }

        setIsLoading(true)
        try {
        const newHabit = {
            name: title.trim(),
            color,
            streak: 0,
            user_id: user.id,
            created_at: new Date().toISOString(),
        }

        const result = await createHabit(newHabit)

        if (result) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

            // Call onHabitCreated callback if provided
            if (onHabitCreated) {
                onHabitCreated(result)
            }

            // Use onClose instead of router.back()
            onClose()
        } else {
            throw new Error("Failed to create habit")
        }
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
            Alert.alert("Error", "Failed to create habit. Please try again.")
            console.error("Error creating habit:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Text className="text-secondary font-sora-bold text-3xl mb-5">Add a new habit</Text>
            <View className="flex-col items-start justify-center" style={{ width: "90%" }}>
                <Text className="text-secondary font-sora-semibold text-xl mb-2">Enter the name of your new habit</Text>
                <Input
                    mode="outlined"
                    value={title}
                    onChangeText={onChangeText}
                    placeholder={"Enter habit name"}
                    keyboardType="default"
                    moreStyles={{ width: "100%", marginBottom: 20, backgroundColor: "#ffffff", fontFamily: "Sora-Medium" }}
                />
            </View>
            <View className="flex-col items-start justify-center" style={{ width: "90%" }}>
                <Text className="text-secondary font-sora-semibold text-xl mb-2">Select a color</Text>
                <ColorPicker style={{ width: "100%", gap: 10 }} value={color} onComplete={onSelectColor}>
                    <Preview />
                    <Panel1 />
                    <HueSlider />
                    <OpacitySlider />
                    <Swatches />
                </ColorPicker>
            </View>
            <TouchableOpacity
                className="bg-primary p-5 rounded-full items-center mb-8 flex-row justify-center gap-2 mt-5"
                style={{ width: "90%" }}
                onPress={handleCreateHabit}
                disabled={isLoading}
                activeOpacity={0.7}
            >
                <Text className="text-white text-xl font-sora-semibold">{isLoading ? "Creating..." : "Create Habit"}</Text>
            </TouchableOpacity>
        </>
    );
}

export default AddHabit

