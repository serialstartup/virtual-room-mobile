import { View, Text } from 'react-native'

export function Footer() {
  return (
    <View className="bg-white border-t border-gray-100 py-4 mt-10">
      <View className="px-6">
        <Text className="text-xs text-gray-400 text-center font-outfit">
          © {new Date().getFullYear()} StyleTry. All rights reserved.
        </Text>
      </View>
    </View>
  )
}
