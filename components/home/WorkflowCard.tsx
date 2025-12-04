import { View, Text, TouchableOpacity, Image } from "react-native";
import { MotiView } from "moti";

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
        className="w-[280px] h-[280px] bg-white rounded-2xl overflow-hidden border border-gray-200"
      >
        {/* Image Section */}
        <View className="relative h-[180px] bg-gray-100">
          {image ? (
            <View className="w-full h-full relative overflow-hidden">
              {/* Blurred Background */}
              <Image
                source={image}
                className="absolute w-full h-full opacity-50"
                resizeMode="cover"
                blurRadius={15}
              />
              {/* Main Image */}
              <Image
                source={image}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          ) : (
            <View className=" p-4 w-64 bg-black/80 rounded-2xl h-auto items-center justify-center m-auto">
              <Text className="text-sm text-center font-outfit-semibold text-white">
                {text || "?"}
              </Text>
            </View>
          )}

          {/* Step Badge */}
          {badge && (
            <View className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full">
              <Text className="text-xs font-outfit-semibold text-gray-700">
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
                className="text-xs font-outfit-semibold"
                style={{ color: accentColor }}
              >
                {id}
              </Text>
            </View>
            <Text
              className="text-base font-outfit-semibold text-gray-900 flex-1"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          <Text className="text-sm font-outfit text-gray-600 leading-5" numberOfLines={2}>
            {description}
          </Text>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default WorkflowCard;
