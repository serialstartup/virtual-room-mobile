import { View, Text } from 'react-native'
import { Sparkles } from 'lucide-react-native'

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showIcon?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showIcon = false }) => {
  return (
    <View className="bg-white p-4">
      <View className="flex-col items-center justify-center">
        {/* Optional Fashion Icon */}
        {showIcon && (
          <View className="mb-4">
            <View className="bg-virtual-primary/10 p-3 rounded-full">
              <Sparkles color="#ec4899" size={24} />
            </View>
          </View>
        )}
        
        {/* Title */}
        <Text className="text-center text-gray-800 font-bold text-3xl mb-2">
          {title}
        </Text>
        
        {/* Decorative underline */}
        <View className="w-16 h-1 bg-virtual-primary rounded-full mb-4" />
        
        {/* Subtitle */}
        {subtitle && (
          <Text className="text-center text-gray-500 text-base leading-6 max-w-sm">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  )
}

export default PageHeader