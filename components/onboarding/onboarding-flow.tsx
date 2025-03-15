import React, { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Input from '../input';
import { Picker } from '@react-native-picker/picker';
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

    if(slide.type === 'age') {
        const [selectedAge, setSelectedAge] = useState(value);
        
        const ageValues = Array.from({ length: 101 }, (_, i) => 5 + i);

        const handleAgeChange = (age: string) => {
            setSelectedAge(age);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        };

        return (
            <View className="flex-1 ml-2">
                <View className={`bg-transparent rounded-2xl overflow-hidden ${Platform.OS === 'ios' ? '' : 'border border-secondary'}`}>
                    <Picker
                        selectedValue={selectedAge}
                        onValueChange={setSelectedAge}
                        dropdownIconColor="white"
                        style={{ color: 'black' }}
                        itemStyle={{ color: 'black' }}
                    >
                        {ageValues.map((age) => (
                            <Picker.Item
                                key={age}
                                label={age.toString()}
                                value={age.toString()}
                                color={Platform.OS === 'android' ? 'black' : 'black'}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        )
    }

    if (slide.type === 'choice') {
        const onSelect = (choice: string) => {
            onChangeText(choice);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        };
        return (
            <ScrollView 
                showsVerticalScrollIndicator={false}
                className='space-y-3 mb-5'
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