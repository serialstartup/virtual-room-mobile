import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { Home, Shirt, User, Settings, Mail } from 'lucide-react-native'

interface FooterProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Footer({ currentPage, onNavigate }: FooterProps) {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@styletry.com')
  }

  const isActive = (page: string) => currentPage === page

  return (
    <View className="border-t border-gray-200 bg-white mt-auto">
      <View className="px-4 py-8 gap-8">
        {/* Brand */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Shirt size={20} color="#d946ef" />
            <Text className="text-lg font-semibold text-gray-900">StyleTry</Text>
          </View>
          <Text className="text-sm text-gray-600 leading-5">
            Virtual fashion try-on. Experience personalized fashion before you buy.
          </Text>
        </View>

        {/* Navigation */}
        <View className="gap-3">
          <Text className="text-base font-semibold text-gray-900 mb-2">Navigation</Text>
          <View className="gap-2">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-1"
              onPress={() => onNavigate('home')}
            >
              <Home size={16} color={isActive('home') ? '#d946ef' : '#6b7280'} />
              <Text className={`text-sm ${isActive('home') ? 'text-pink-500' : 'text-gray-600'}`}>
                Home
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-row items-center gap-2 py-1"
              onPress={() => onNavigate('tryon')}
            >
              <Shirt size={16} color={isActive('tryon') ? '#d946ef' : '#6b7280'} />
              <Text className={`text-sm ${isActive('tryon') ? 'text-pink-500' : 'text-gray-600'}`}>
                Try On
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-row items-center gap-2 py-1"
              onPress={() => onNavigate('wardrobe')}
            >
              <Shirt size={16} color={isActive('wardrobe') ? '#d946ef' : '#6b7280'} />
              <Text className={`text-sm ${isActive('wardrobe') ? 'text-pink-500' : 'text-gray-600'}`}>
                Wardrobe
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account */}
        <View className="gap-3">
          <Text className="text-base font-semibold text-gray-900 mb-2">Account</Text>
          <View className="gap-2">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-1"
              onPress={() => onNavigate('profile')}
            >
              <User size={16} color={isActive('profile') ? '#d946ef' : '#6b7280'} />
              <Text className={`text-sm ${isActive('profile') ? 'text-pink-500' : 'text-gray-600'}`}>
                Profile
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-row items-center gap-2 py-1"
              onPress={() => onNavigate('settings')}
            >
              <Settings size={16} color={isActive('settings') ? '#d946ef' : '#6b7280'} />
              <Text className={`text-sm ${isActive('settings') ? 'text-pink-500' : 'text-gray-600'}`}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View className="gap-3">
          <Text className="text-base font-semibold text-gray-900 mb-2">Support</Text>
          <View className="gap-2">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-1"
              onPress={handleEmailPress}
            >
              <Mail size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600">Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom bar */}
        <View className="mt-8 pt-8 border-t border-gray-200 items-center">
          <Text className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} StyleTry. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  )
}
