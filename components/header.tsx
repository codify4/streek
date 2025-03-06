import { router } from 'expo-router'
import { Settings } from 'lucide-react-native'
import { View, Text, TouchableOpacity, Image } from 'react-native'

const Header = ({ title }: { title: string }) => {
    return (
        <View className="flex-row items-center justify-between px-5 py-4 w-full">
        <View className="flex-row justify-center items-center">
          <Image 
            source={require('@/assets/icons/splash-icon-light.png')} 
            className="mr-2" 
            style={{ width: 50, height: 50 }} 
            resizeMode="contain" 
          />
          <View>
            <Text className="text-secondary text-2xl font-sora-bold">Streek</Text>
            <Text className="text-secondary text-base font-sora-semibold">
              {title}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/(settings)/settings')}>
          <Settings color="#1B1B3A" size={26} strokeWidth={3} />
        </TouchableOpacity>
      </View>
    )
}
export default Header