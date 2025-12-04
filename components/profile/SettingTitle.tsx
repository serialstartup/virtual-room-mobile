import { View, Text } from "react-native";
import { Bell, Globe, Shield, Smartphone, Mail, Sparkles } from 'lucide-react-native';

interface SettingTitleProps {
  title: string;
  iconName: 'Bell' | 'Globe' | 'Shield' | 'Smartphone' | 'Mail' | 'Sparkles';
  iconColor?: string;
  iconSize?: number;
  children?: React.ReactNode;
}

const SettingTitle: React.FC<SettingTitleProps> = ({
  title,
  iconName,
  iconColor = "#6b7280",
  iconSize = 20,
  children
}) => {
  const getIcon = () => {
    const iconProps = { color: iconColor, size: iconSize };
    
    switch (iconName) {
      case 'Bell':
        return <Bell {...iconProps} />;
      case 'Globe':
        return <Globe {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Smartphone':
        return <Smartphone {...iconProps} />;
      case 'Mail':
        return <Mail {...iconProps} />;
      case 'Sparkles':
        return <Sparkles {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  return (
    <View className="bg-white border border-gray-100 rounded-2xl  mb-4 overflow-hidden">
      <View className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <View className="bg-white p-2 rounded-full">
            {getIcon()}
          </View>
          <Text className="text-lg font-outfit-semibold text-gray-800">{title}</Text>
        </View>
      </View>
      <View className="p-4">
        {children}
      </View>
    </View>
  );
};

export default SettingTitle;
