import { View, Text, TouchableOpacity, Image } from "react-native";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";

interface WorkflowCardProps {
  id: number;
  title: string;
  description: string;
  image: any;
  text?: string;
  badge?: string;
  accentColor: string;
  onPress?: () => void;
  index: number;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  id,
  title,
  description,
  image,
  text,
  badge,
  accentColor,
  onPress,
  index,
}) => {
  const { t } = useTranslation();

  return (
    <MotiView
      from={{ opacity: 0, translateX: 30 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: "timing",
        duration: 300,
        delay: index * 80,
      }}
      className="mr-4"
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="w-[280px] bg-white rounded-2xl overflow-hidden border border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Image Section */}
        <View className="relative h-[160px] bg-gray-50">
          {image ? (
            <Image
              source={image}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <Text>{text}</Text>
          )}

          {/* Step Badge */}
          {badge && (
            <View className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full">
              <Text className="text-xs font-semibold text-gray-700">
                {badge}
              </Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View className="p-4">
          <View className="flex-row items-center mb-2">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: accentColor + "20" }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: accentColor }}
              >
                {id}
              </Text>
            </View>
            <Text
              className="text-base font-bold text-gray-900 flex-1"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <Text className="text-sm text-gray-600 leading-5" numberOfLines={2}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default WorkflowCard;
