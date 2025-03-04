import { Tabs } from 'expo-router';
import { Home, Trophy, Plus } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BotSheet from '@/components/bot-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import Input from '@/components/input';


function TabBarIcon(props: {
  name: React.ElementType;
  color: string;
  size?: number;
}) {
  return <props.name color={props.color} size={props.size || 24} strokeWidth={2} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [value, setValue] = useState('');
  

  const handleOpenBottomSheet = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    bottomSheetRef.current?.expand();
  };

  const onSelectColor = ({ hex }: { hex: string }) => {
    // do something with the selected color.
    console.log(hex);
  };

  const onChangeText = (text: string) => {
    setValue(text);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#00B865',
            borderTopWidth: 0,
            minHeight: Platform.OS === 'ios' ? 70 : 40,
            position: 'absolute',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarLabelStyle: {
            fontFamily: 'Sora-Medium',
            fontSize: 12,
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View className={`p-2 rounded-full ${focused ? 'bg-white/20' : ''}`}>
                <TabBarIcon name={Home} color={color} size={focused ? 26 : 24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarButton: () => (
              <TouchableOpacity
                className="absolute -ml-9 items-center justify-center rounded-full bg-primary shadow-lg"
                style={{ 
                  width: 70, 
                  height: 70, 
                  left: '27%', 
                  top: '-50%', 
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 8, 
                }}
                onPress={handleOpenBottomSheet}
              >
                <Plus color="white" size={32} strokeWidth={2.5} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="wins"
          options={{
            title: 'Wins',
            tabBarIcon: ({ color, focused }) => (
              <View className={`p-2 rounded-full ${focused ? 'bg-white/20' : ''}`}>
                <TabBarIcon name={Trophy} color={color} size={focused ? 26 : 24} />
              </View>
            ),
          }}
        />
      </Tabs>
      <BotSheet ref={bottomSheetRef} snapPoints={['80%']}>
        <Text className='text-secondary font-sora-bold text-3xl mb-5'>Add a new habit</Text>
        <View className='flex-col items-start justify-center' style={{ width: '90%' }}>
          <Text className='text-secondary font-sora-semibold text-xl mb-2'>Enter the name of your new habit</Text>
          <Input mode='outlined' value={value} onChangeText={onChangeText} placeholder={'Enter habit name'} keyboardType='default' moreStyles={{ width: '100%', marginBottom: 20 }} />
        </View>
        <View className='flex-col items-start justify-center' style={{ width: '90%' }}>
          <Text className='text-secondary font-sora-semibold text-xl mb-2'>Select a color</Text>
          <ColorPicker style={{ width: '100%', gap: 10 }} value='red' onComplete={onSelectColor}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>
        </View>
        <TouchableOpacity className="bg-primary p-5 rounded-full items-center mb-8 flex-row justify-center gap-2 mt-5"  style={{ width: '90%' }}>
          <Text className="text-white text-xl font-sora-semibold">Create Routine</Text>
        </TouchableOpacity>
      </BotSheet>
    </>
  );
}