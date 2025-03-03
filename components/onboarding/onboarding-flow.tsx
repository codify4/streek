import React from 'react';
import { ScrollView,  Text, TouchableOpacity } from 'react-native';
import Input from '../input';
import * as Haptics from 'expo-haptics';

interface OnboardingSlide {
  type: 'text' | 'choice' | 'date' | 'number' | 'measurement' | 'loading' | 'age';
  title: string;
  placeholder?: string;
  choices?: string[];
  unit?: string;
  min?: number;
  max?: number;
}

interface OnboardingInputProps {
  slide: OnboardingSlide;
  value: string;
  onChangeText: (text: string) => void;
}

export const OnboardingInput: React.FC<OnboardingInputProps> = ({
  slide,
  value,
  onChangeText,
}) => {

    if (slide.type === 'text') {
        return (
            <Input mode='outlined' value={value} onChangeText={onChangeText} placeholder={slide.placeholder} keyboardType='default' />
        );
    }

    if (slide.type === 'age') {
        return (
            <Input mode='outlined' value={value} onChangeText={onChangeText} placeholder={slide.placeholder} keyboardType='numeric' />
        );
    }

    if (slide.type === 'choice') {
        const onSelect = (choice: string) => {
            onChangeText(choice);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        };
        return (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                className='space-y-3'
            >
                {slide.choices?.map((choice, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelect(choice)}
                        className={`px-5 py-5 mt-4 rounded-2xl ${
                            value === choice 
                                ? 'bg-primary' 
                                : 'border border-secondary bg-white'
                        }`}
                    >
                        <Text 
                            className={`text-lg font-sora-medium ${
                                value === choice ? 'text-white' : 'text-secondary'
                            }`}
                        >
                            {choice}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }
};