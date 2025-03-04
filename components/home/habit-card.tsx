// components/HabitCard.tsx
import { Habit } from '@/constants/data';
import { Flame } from 'lucide-react-native';
import React, { useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  Layout,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const HabitCard = ({ habit, onComplete, onDelete }: HabitCardProps) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const isDeleting = useRef(false);
  const isCompleting = useRef(false);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH);
        isCompleting.current = true;
        runOnJS(onComplete)(habit.id);
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        opacity.value = withTiming(0);
        isDeleting.current = true;
        runOnJS(onDelete)(habit.id);
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const rLeftActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value > 0 
      ? Math.min(1, translateX.value / SWIPE_THRESHOLD) 
      : 0;
    return { opacity };
  });

  const rRightActionStyle = useAnimatedStyle(() => {
    const opacity = translateX.value < 0 
      ? Math.min(1, -translateX.value / SWIPE_THRESHOLD) 
      : 0;
    return { opacity };
  });

  return (
    <Animated.View 
      className="w-full overflow-hidden mb-4" 
      style={rContainerStyle}
      layout={Layout.springify()}
    >
      <View className="absolute inset-0 flex-row justify-between">
        <Animated.View 
          className="bg-primary h-full justify-center pl-6 rounded-l-3xl"
          style={[{ width: SWIPE_THRESHOLD * 1.5, borderTopLeftRadius: 30, borderBottomLeftRadius: 30, padding: 10 }, rLeftActionStyle]}
        >
          <Text className="text-white font-sora-bold text-lg">Done</Text>
        </Animated.View>
        
        <Animated.View 
          className="bg-red-500 h-full items-end justify-end pr-6 rounded-r-3xl"
          style={[{ backgroundColor: '#ef4444', width: SWIPE_THRESHOLD * 1.5, borderTopRightRadius: 30, borderBottomRightRadius: 30, padding: 10 }, rRightActionStyle]}
        >
          <Text className="text-white w-full font-sora-bold text-lg">Delete</Text>
        </Animated.View>
      </View>

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View 
          className="w-full rounded-3xl"
          style={[rStyle, { backgroundColor: '#F0EFEF', paddingHorizontal: 20, paddingVertical: 16 }]}
        >
          <View className="flex-col justify-start items-start mb-2">
            <Text className="text-secondary font-sora-bold text-3xl">{habit.name}</Text>
            <View className="flex-row items-center">
              <Flame color="#00B865" size={24} strokeWidth={3} />
              <Text className="text-secondary font-sora-semibold text-xl">{habit.days} days</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <Text className="mr-2 text-lg">🌰</Text>
            <View className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#D9D9D9' }}>
              <View 
                className="rounded-full" 
                style={{ 
                  width: `${habit.progress}%`,
                  height: 10,
                  backgroundColor: habit.color
                }} 
              />
            </View>
            <Text className="ml-2 text-lg">🌴</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default HabitCard;