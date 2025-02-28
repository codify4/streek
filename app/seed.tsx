import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StarryBackground } from './index';
import { router } from 'expo-router';

const Seed = () => {
  return (
    <View className="flex-1 bg-secondary">
      <StarryBackground />
      <SafeAreaView className='flex-1 items-center'>
        <View className='flex flex-col items-center justify-center gap-12 w-full h-full px-5'>
          <View className='flex flex-col items-center w-full'>
            <Text className='font-sora-bold text-3xl text-white'>You just won a seedling!</Text>
            <Text className='font-sora-semibold text-lg text-white text-center'>By staying consistent with your habits, you can grow the seed into a big tree.</Text>
          </View>
          <View className='bg-primary w-80 h-96 rounded-3xl flex items-center justify-center'>
            <MaterialCommunityIcons name="seed" size={200} color="black" />        
          </View>
          
          <TouchableOpacity className="flex items-center bg-primary rounded-full w-full py-5 px-32" activeOpacity={0.8} onPress={() => router.push('/onboarding')}>
            <Text className="font-sora-semibold text-xl text-white text-center">Grow your seedling</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}
export default Seed