import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useWorkflowStore, WorkflowType } from "@/store/workflowStore";
import { useTranslation } from "react-i18next";

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

interface WorkflowSelectorProps {
  onWorkflowSelect: (workflow: WorkflowType) => void;
}

const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
  onWorkflowSelect,
}) => {
  const { t } = useTranslation();
  const { activeWorkflow, setActiveWorkflow } = useWorkflowStore();

  const workflowOptions: WorkflowOption[] = [
    {
      type: "classic",
      title: t("tryOn.workflowSelector.options.classic.title"),
      subtitle: t("tryOn.workflowSelector.options.classic.subtitle"),
      description: t("tryOn.workflowSelector.options.classic.description"),
      icon: "camera-outline",
      demoImage: require("@/assets/images/try-on-model.png"),
      isPopular: true,
    },
    {
      type: "avatar",
      title: t("tryOn.workflowSelector.options.avatar.title"),
      subtitle: t("tryOn.workflowSelector.options.avatar.subtitle"),
      description: t("tryOn.workflowSelector.options.avatar.description"),
      icon: "person-outline",
      demoImage: require("@/assets/images/avatar-model.png"),
    },
    {
      type: "product-to-model",
      title: t("tryOn.workflowSelector.options.productToModel.title"),
      subtitle: t("tryOn.workflowSelector.options.productToModel.subtitle"),
      description: t(
        "tryOn.workflowSelector.options.productToModel.description"
      ),
      icon: "bag-outline",
      demoImage: require("@/assets/images/product-model.png"),
    },
    {
      type: "text-to-fashion",
      title: t("tryOn.workflowSelector.options.textToFashion.title"),
      subtitle: t("tryOn.workflowSelector.options.textToFashion.subtitle"),
      description: t(
        "tryOn.workflowSelector.options.textToFashion.description"
      ),
      icon: "create-outline",
      demoImage: require("@/assets/images/fashion-model.png"),
      isNew: true,
    },
  ];

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
                        aspectRatio: 340 / 170,
                        // aspectRatio: 16 / 9,
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
                        <Text className="text-xl font-outfit-semibold text-gray-900 mb-1">
                          {option.title}
                        </Text>
                        <Text className="text-gray-500 text-base font-outfit">
                          {option.subtitle}
                        </Text>
                      </View>
                    </View>
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
            <Text className="text-lg font-outfit-semibold text-gray-900 ml-3">
              {t("tryOn.workflowSelector.howItWorks")}
            </Text>
          </View>
          <Text className="text-gray-600 font-outfit leading-relaxed">
            {t("tryOn.workflowSelector.howItWorksDesc")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkflowSelector;
