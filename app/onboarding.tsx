
"use client"

import { useState, useEffect } from "react"
import { View, Text, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native"
import Animated, { SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight } from "react-native-reanimated"
import { useRouter } from "expo-router"
import { OnboardingInput } from "@/components/onboarding/onboarding-flow"
import { OnboardingData, slides } from "@/constants/slides"
// import { useAuth } from "@/context/auth"

const Onboarding = () => {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"forward" | "backward">("forward")
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    birthDate: "",
    measurements: "",
    goal: "",
    frequency: "",
    experience: "",
    min: (0).toString(),
    max: (999).toString(),
    gender: "",
    loading: '',
    age: (0).toString()
  })
  const router = useRouter()
  // const { session } = useAuth()
  const keyboardVerticalOffset = Platform.OS === "ios" ? 50 : 0

  // // If we already have a session, redirect to home
  // useEffect(() => {
  //   if (session) {
  //     router.replace("/(tabs)/home")
  //   }
  // }, [session, router])

  const currentSlide = slides[step]
  const currentValue = formData[currentSlide.field]
  const isValidInput = currentSlide.validation(currentValue)

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentSlide.field]: value,
    }))
  }

  const nextStep = () => {
    if (!isValidInput || isAnimating) return

    if (step < slides.length - 1) {
      setSlideDirection("forward")
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      // Navigate to loading screen on last step
      router.push("/loading-screen");
    }
  }

  const prevStep = () => {
    if (isAnimating || step === 0) return

    setSlideDirection("backward")
    setIsAnimating(true)
    setTimeout(() => {
      setStep(step - 1)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={"padding"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View className="flex-1 px-6 pt-20">
        {/* Progress Indicator */}
        <View className="h-1.5 bg-neutral-300 rounded-full overflow-hidden mb-12">
          <View className="h-full bg-primary rounded-full" style={{ width: `${((step + 1) / slides.length) * 100}%` }} />
        </View>

        {/* Question and Input */}
        <Animated.View
          key={step}
          entering={slideDirection === "forward" ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
          exiting={slideDirection === "forward" ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
          className="flex-1"
        >
          <View className="flex-1 space-y-8 mt-24">
            <Text className="text-secondary text-4xl tracking-wider mb-3 font-sora-semibold">{currentSlide.field !== "loading" && currentSlide.title}</Text>

            <OnboardingInput slide={currentSlide} value={currentValue} onChangeText={handleInputChange} />
          </View>
        </Animated.View>

        {/* Buttons */}
        {currentSlide.type !== 'loading' && (
          <View className="mb-12 gap-4">
            <TouchableOpacity
              onPress={nextStep}
              className={`py-5 rounded-full w-full items-center ${
                isValidInput && !isAnimating ? "bg-primary" : "bg-primary/50"
              }`}
              disabled={!isValidInput || isAnimating}
            >
              <Text
                className={`text-xl font-sora-semibold ${
                  isValidInput && !isAnimating ? "text-white" : "text-neutral-400"
                }`}
              >
                {step === slides.length - 1 ? "Let's Go" : "Next"}
              </Text>
            </TouchableOpacity>

            {step > 0 && (
              <TouchableOpacity
                onPress={prevStep}
                className="flex flex-row items-center justify-center border border-gray-300 rounded-full py-5"
                disabled={isAnimating}
              >
                <Text className="text-lg text-secondary font-sora-semibold">Back</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default Onboarding
