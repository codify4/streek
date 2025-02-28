import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Input from '../input';
// import MeasurementPicker from './picker';
// import RNDateTimePicker  from "@react-native-community/datetimepicker"
// import CircularProgress from './loading-circle';
// import { Picker } from '@react-native-picker/picker';
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
    // const [loadingProgress, setLoadingProgress] = useState(0);


    // // Loading animation effect
    // React.useEffect(() => {
    //   if (slide.type === 'loading') {
    //     const interval = setInterval(() => {
    //       setLoadingProgress(prev => {
    //         if (prev >= 100) {
    //           clearInterval(interval);
    //           return 100;
    //         }
    //         return prev + 1;
    //       });
    //     }, 30);

    //     return () => clearInterval(interval);
    //   }
    // }, [slide.type]);

    // if (slide.type === 'loading') {
    //   return <CircularProgress />;
    // }

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

    // if (slide.type === 'date') {
    //     const date = value ? new Date(value) : new Date();
    //     const formattedDate = value 
    //     ? new Date(value).toLocaleDateString('en-US', {
    //             month: 'long',
    //             day: 'numeric',
    //             year: 'numeric'
    //         })
    //     : 'Select date';

    //     const onChange = (event: any, selectedDate?: Date) => {
    //         if (selectedDate) {
    //           onChangeText(selectedDate.toISOString())
    //         }
    //     }
      
    //     return (
    //         <View className='w-full'>
    //             <View className="rounded-xl p-4">
    //                 <RNDateTimePicker 
    //                     value={date}
    //                     mode="date"
    //                     display="spinner"
    //                     onChange={onChange}
    //                     maximumDate={new Date()}
    //                     minimumDate={new Date(1900, 0, 1)}
    //                     textColor="white"
    //                     style={styles.datePicker}
    //                 />
    //             </View>
    //         </View>
    //     );
    // }

    // if (slide.type === 'measurement') {
    //     const [height, weight, heightUnit, weightUnit] = value.split(',');
    //     return (
    //         <View className='w-full h-full'>
    //             <MeasurementPicker
    //                 initialHeight={parseInt(height) || 165}
    //                 initialWeight={parseInt(weight) || 63}
    //                 onHeightChange={(newHeight, unit) => {
    //                     onChangeText(`${newHeight},${weight || ''},${unit},${weightUnit || ''}`);
    //                 }}
    //                 onWeightChange={(newWeight, unit) => {
    //                     onChangeText(`${height || ''},${newWeight},${heightUnit || ''},${unit}`);
    //                 }}
    //             />
    //         </View>
    //     );
    // }

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
                                : 'border border-secondary bg-neutral-400/50'
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