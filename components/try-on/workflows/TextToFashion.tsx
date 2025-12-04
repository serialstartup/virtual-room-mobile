import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useWorkflowStore } from "@/store/workflowStore";
import { useTextToFashion } from "@/hooks/useMultiModalTryOn";
import ReusableButton from "@/components/ui/ReusableButton";
// import { analytics } from "@/services/analytics";
import { useTranslation } from "react-i18next";

interface TextToFashionProps {
  onTryOnCreate: (tryOnId: string) => void;
}

const TextToFashion: React.FC<TextToFashionProps> = ({ onTryOnCreate }) => {
  const { t } = useTranslation();
  
  // Get localized examples from translation files
  const fashionPromptExamples = t("textToFashion.examples.fashionPrompts", { returnObjects: true }) as string[];
  const scenePromptExamples = t("textToFashion.examples.scenePrompts", { returnObjects: true }) as string[];

  const {
    workflowData,
    currentStep,
    nextStep,
    previousStep,
    setFashionDescription,
    setFashionScenePrompt,
    isCurrentWorkflowValid,
    getWorkflowProgress,
  } = useWorkflowStore();

  const { createTextToFashion, isCreating, error, hasCredits } =
    useTextToFashion();

  const textToFashionData = workflowData.textToFashion;

  const handleNext = () => {
    if (currentStep === 1 && !textToFashionData.fashionDescription.trim()) {
      Alert.alert("Missing Description", "Please describe your fashion idea.");
      return;
    }
    nextStep();
  };

  const handleCreateTextToFashion = async () => {
    if (!isCurrentWorkflowValid()) {
      Alert.alert("Incomplete Data", "Please complete all required steps.");
      return;
    }

    if (!hasCredits) {
      // analytics.trackOutOfCredits("text_to_fashion");
      Alert.alert("No Credits", "You need credits to create a fashion design.");
      return;
    }

    try {
      // Track start
      // analytics.trackTryOnStarted("text_to_fashion");
      const startTime = Date.now();

      const textToFashionRequestData = {
        fashion_description: textToFashionData.fashionDescription,
        scene_prompt: textToFashionData.scenePrompt || "modern urban setting",
      };

      const newTryOn = await createTextToFashion(textToFashionRequestData);

      // Track completion and credit usage
      const processingTime = Date.now() - startTime;
      // analytics.trackTryOnCompleted("text_to_fashion", 2, processingTime);
      // analytics.trackCreditUsed(2, "text_to_fashion");

      onTryOnCreate(newTryOn.id);
    } catch (err: any) {
      // analytics.trackTryOnFailed(
      //   "text_to_fashion",
      //   err.message || "Unknown error"
      // );
      Alert.alert("Error", err.message || "Failed to create fashion design");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <View className="p-6 bg-gray-50 rounded-3xl">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-orange-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="create-outline" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-2xl font-outfit-semibold text-gray-900">
                    Step 1
                  </Text>
                  <Text className="text-lg font-outfit text-gray-600">
                    Describe Your Fashion Idea
                  </Text>
                </View>
              </View>

              {/* Fashion Description */}
              <View className="mb-6">
                <Text className="text-lg font-outfit-semibold text-gray-900 mb-3">
                  Fashion Description *
                </Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 min-h-[120px]"
                  placeholder="Describe your dream outfit in detail... Include style, colors, materials, accessories, and overall look."
                  value={textToFashionData.fashionDescription}
                  onChangeText={setFashionDescription}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text className="text-sm font-outfit text-gray-500 mt-2">
                  {textToFashionData.fashionDescription.length}/500 characters
                </Text>
              </View>

              {/* Examples */}
              <View className="mb-6">
                <Text className="text-lg font-outfit-semibold text-gray-900 mb-3">
                  Example Ideas
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="-mx-2"
                >
                  {fashionPromptExamples.map((example, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setFashionDescription(example)}
                      className="bg-white border border-gray-200 rounded-2xl p-3 mr-3 min-w-[200px]"
                    >
                      <Text className="text-gray-700 font-outfit text-sm">{example}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Tips */}
              <View className="bg-orange-50 rounded-2xl p-4">
                <View className="flex-row items-start">
                  <Ionicons name="bulb-outline" size={20} color="#F97316" />
                  <View className="ml-3 flex-1">
                    <Text className="font-outfit-semibold text-orange-900 mb-2">
                      Tips for Better Results
                    </Text>
                    <Text className="text-orange-800 text-sm font-outfit leading-relaxed">
                      • Be specific about colors, styles, and materials{"\n"}•
                      Include details about accessories and shoes{"\n"}• Mention
                      the overall vibe (casual, formal, edgy, elegant){"\n"}•
                      Specify gender if important for the design
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </MotiView>
        );

      case 2:
        return (
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <View className="p-6 bg-gray-50 rounded-3xl">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-orange-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="white"
                  />
                </View>
                <View>
                  <Text className="text-2xl font-outfit-semibold text-gray-900">
                    Step 2
                  </Text>
                  <Text className="text-lg font-outfit text-gray-600">Ready to Create</Text>
                </View>
              </View>

              {/* Scene Setting (Optional) */}
              <View className="mb-6">
                <Text className="text-lg font-outfit-semibold text-gray-900 mb-3">
                  Scene Setting (Optional)
                </Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 min-h-[100px]"
                  placeholder="Describe the setting where this outfit will be showcased (e.g. modern urban street, elegant ballroom, cozy café)"
                  value={textToFashionData.scenePrompt}
                  onChangeText={setFashionScenePrompt}
                  multiline
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text className="text-sm font-outfit text-gray-500 mt-2">
                  {textToFashionData.scenePrompt.length}/200 characters
                </Text>
              </View>

              {/* Scene Examples */}
              <View className="mb-6">
                <Text className="text-base font-outfit-medium text-gray-900 mb-3">
                  Scene Ideas
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="-mx-2"
                >
                  {scenePromptExamples.map((example, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setFashionScenePrompt(example)}
                      className="bg-white border border-gray-200 rounded-xl p-3 mr-3 min-w-[160px]"
                    >
                      <Text className="text-gray-700 font-outfit text-sm">{example}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Summary */}
              <View className="bg-white rounded-2xl p-4 mb-6">
                <Text className="text-lg font-outfit-semibold text-gray-900 mb-4">
                  Summary
                </Text>

                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="shirt-outline"
                    size={20}
                    color="#6B7280"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-gray-700 font-outfit ml-3 flex-1">
                    Fashion:{" "}
                    {textToFashionData.fashionDescription ||
                      "No description provided"}
                  </Text>
                </View>

                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#6B7280"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-gray-700 font-outfit ml-3 flex-1">
                    Scene:{" "}
                    {textToFashionData.scenePrompt || "Modern urban setting"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-outfit ml-3">
                    Processing time: ~8-15 minutes
                  </Text>
                </View>
              </View>

              <ReusableButton
                title={
                  isCreating ? t("textToFashion.buttons.creating") : t("textToFashion.buttons.createDesign")
                }
                onPress={handleCreateTextToFashion}
                disabled={
                  !isCurrentWorkflowValid() || isCreating || !hasCredits
                }
                bgColor={
                  isCurrentWorkflowValid() && hasCredits
                    ? "bg-orange-500"
                    : "bg-gray-400"
                }
                textColor="text-white"
                variant="filled"
                buttonShadow
              />

              {error && (
                <Text className="text-red-500 font-outfit text-center mt-4">
                  {error.message}
                </Text>
              )}
            </View>
          </MotiView>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1">
      {/* Progress Bar */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-outfit-semibold text-gray-600">
            Step {currentStep} of 2
          </Text>
          <Text className="text-sm font-outfit-semibold text-orange-500">
            {getWorkflowProgress()}% Complete
          </Text>
        </View>

        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <MotiView
            className="h-full bg-orange-500"
            from={{ width: "0%" }}
            animate={{ width: `${getWorkflowProgress()}%` }}
            transition={{ type: "timing", duration: 300 }}
          />
        </View>
      </View>

      {/* Step Content */}
      <View className="flex-1 px-6">{renderStepContent()}</View>

      {/* Navigation Buttons */}
      {currentStep < 2 && (
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={previousStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-2xl ${
              currentStep === 1 ? "bg-gray-200" : "bg-gray-100"
            }`}
          >
            <Text
              className={`font-outfit-semibold ${
                currentStep === 1 ? "text-gray-400" : "text-gray-700"
              }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            className="px-6 py-3 bg-orange-500 rounded-2xl"
          >
            <Text className="text-white font-outfit-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default TextToFashion;
