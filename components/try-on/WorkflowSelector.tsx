import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useWorkflowStore, WorkflowType } from "@/store/workflowStore";

interface WorkflowOption {
  type: WorkflowType;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  demoImage: any;
  isPopular?: boolean;
  isNew?: boolean;
}

const workflowOptions: WorkflowOption[] = [
  {
    type: "classic",
    title: "Classic Try-On",
    subtitle: "Upload your photo and try on clothes",
    description: "See how clothes look on you before you buy",
    icon: "camera-outline",
    demoImage: require("@/assets/images/try-on-model.png"),
    isPopular: true,
  },
  {
    type: "avatar",
    title: "Avatar Try-On",
    subtitle: "Use your AI avatar for consistent looks",
    description: "Create once, try on everything with your avatar",
    icon: "person-outline",
    demoImage: require("@/assets/images/avatar-model.png"),
  },
  {
    type: "product-to-model",
    title: "Product to Model",
    subtitle: "Generate model wearing your product",
    description: "Perfect for showcasing your business products",
    icon: "bag-outline",
    demoImage: require("@/assets/images/product-model.png"),
  },
  {
    type: "text-to-fashion",
    title: "Text to Fashion",
    subtitle: "Create fashion from text description",
    description: "Describe your dream outfit and see it come to life",
    icon: "create-outline",
    demoImage: require("@/assets/images/fashion-model.png"),
    isNew: true,
  },
];

interface WorkflowSelectorProps {
  onWorkflowSelect: (workflow: WorkflowType) => void;
}

const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
  onWorkflowSelect,
}) => {
  const { activeWorkflow, setActiveWorkflow } = useWorkflowStore();

  const handleWorkflowSelect = (workflowType: WorkflowType) => {
    setActiveWorkflow(workflowType);
    onWorkflowSelect(workflowType);
  };

  return (
    <View className="flex-1">
      <ScrollView
        className=" px-6"
        contentContainerStyle={{ paddingBottom: 20 }} // küçük bir padding yeterli
      >
        <View className="pb-4 gap-4">
          {workflowOptions.map((option, index) => (
            <MotiView
              key={option.type}
              from={{ opacity: 0, translateY: 50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300, delay: index * 100 }}
            >
              <TouchableOpacity
                onPress={() => handleWorkflowSelect(option.type)}
                activeOpacity={0.8}
                className="mb-4 "
              >
                <View
                  className={
                    activeWorkflow === option.type
                      ? "rounded-2xl border-[1px] border-virtual-primary bg-white "
                      : "rounded-2xl border border-gray-200 bg-white "
                  }
                >
                  {/* Demo Image */}
                  <View
                    className="overflow-hidden"
                    style={{
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    <Image
                      source={option.demoImage}
                      style={{
                        width: "100%",
                        height: 180,
                        aspectRatio: 370 / 175,
                      }}
                      contentFit="cover"
                      contentPosition="center"
                      cachePolicy="memory-disk"
                    />
                  </View>

                  {/* Content */}
                  <View className="py-4 px-2">
                    {/* Header with badges */}
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-gray-900 mb-1">
                          {option.title}
                        </Text>
                        <Text className="text-gray-600 text-base">
                          {option.subtitle}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text className="text-gray-500 text-sm leading-relaxed">
                      {option.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>

        {/* Additional Info */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-0">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#6B7280"
            />
            <Text className="text-lg font-semibold text-gray-900 ml-3">
              How it works
            </Text>
          </View>
          <Text className="text-gray-600 leading-relaxed">
            Each workflow uses advanced AI to create stunning fashion visuals.
            Processing time varies from 2-15 minutes depending on complexity.
            All results are saved to your wardrobe for future reference.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkflowSelector;
