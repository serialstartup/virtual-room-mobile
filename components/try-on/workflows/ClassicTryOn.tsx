import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useWorkflowStore } from "@/store/workflowStore";
import { useClassicTryOn } from "@/hooks/useMultiModalTryOn";
import UploadDressTab from "../tabs/UploadDressTab";
import DescriptionDressTab from "../tabs/DescriptionDressTab";
import ReusableButton from "@/components/ui/ReusableButton";
import UploadTab from "../tabs/UploadTab";
import { UserAvatar } from "@/hooks/useUserAvatars";
// import { analytics } from "@/services/analytics";
import { useTranslation } from "react-i18next";

interface ClassicTryOnProps {
  onTryOnCreate: (tryOnId: string) => void;
}

const ClassicTryOn: React.FC<ClassicTryOnProps> = ({ onTryOnCreate }) => {
  const { t } = useTranslation();
  const {
    workflowData,
    currentStep,
    nextStep,
    previousStep,
    setClassicSelfImage,
    setClassicDressImage,
    setClassicDressDescription,
    setClassicSelectedAvatar,
    isCurrentWorkflowValid,
    getWorkflowProgress,
  } = useWorkflowStore();

  const { createTryOn, isCreating, error, hasCredits } = useClassicTryOn();

  const [activeTab, setActiveTab] = useState<"image" | "description">("image");

  const classicData = workflowData.classic;

  const handlePersonImageSelect = (imageUrl: string) => {
    setClassicSelfImage(imageUrl);
    // Clear selected avatar when uploading a new image
    setClassicSelectedAvatar(null);
  };

  const handleAvatarSelect = (avatar: UserAvatar | null) => {
    setClassicSelectedAvatar(avatar);
    // Clear self image when selecting an avatar
    if (avatar) {
      setClassicSelfImage(null);
    }
  };

  const handleDressImageSelect = (imageUrl: string) => {
    setClassicDressImage(imageUrl);
    setActiveTab("image");
  };

  const handleDressDescriptionChange = (description: string) => {
    setClassicDressDescription(description);
    setActiveTab("description");
  };

  const handleNext = () => {
    if (
      currentStep === 1 &&
      !classicData.selfImage &&
      !classicData.selectedAvatar
    ) {
      Alert.alert(
        "Missing Image",
        "Please upload your photo or select an avatar first."
      );
      return;
    }
    if (
      currentStep === 2 &&
      !classicData.dressImage &&
      !classicData.dressDescription
    ) {
      Alert.alert(
        "Missing Garment",
        "Please select a garment image or add a description."
      );
      return;
    }
    nextStep();
  };

  const handleCreateTryOn = async () => {
    if (!isCurrentWorkflowValid()) {
      Alert.alert("Incomplete Data", "Please complete all required steps.");
      return;
    }

    if (!hasCredits) {
      // analytics.trackOutOfCredits("classic_try_on");
      Alert.alert("No Credits", "You need credits to create a try-on.");
      return;
    }

    try {
      const tryOnData = {
        self_image:
          classicData.selectedAvatar?.avatar_image_url ||
          classicData.selfImage!,
        ...(classicData.dressImage && { dress_image: classicData.dressImage }),
        ...(classicData.dressDescription && {
          dress_description: classicData.dressDescription,
        }),
      };

      const newTryOn = await createTryOn(tryOnData);

      onTryOnCreate(newTryOn.id);
    } catch (err: any) {
      // analytics.trackTryOnFailed("classic", err.message || "Unknown error");
      Alert.alert("Error", err.message || "Failed to create try-on");
    }
  };

  // Check if current step is valid for Next button
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!(classicData.selfImage || classicData.selectedAvatar);
      case 2:
        return !!(classicData.dressImage || classicData.dressDescription);
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView>
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 300 }}
            >
              <View className="p-6 bg-gray-50 rounded-3xl">
                <View className="flex-row items-center mb-6">
                  <View className="w-12 h-12 bg-virtual-primary rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="person-outline" size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-2xl font-outfit-semibold text-gray-900">
                      Step 1
                    </Text>
                    <Text className="text-lg font-outfit text-gray-600">
                      Upload Your Photo
                    </Text>
                  </View>
                </View>

                <UploadTab
                  onImageSelect={handlePersonImageSelect}
                  selectedImage={classicData.selfImage || undefined}
                  title="Model ekle"
                  skeletonTitle="Model seçmek için tıkla"
                  enableAvatarSelection={true}
                  onAvatarSelect={handleAvatarSelect}
                  selectedAvatar={classicData.selectedAvatar}
                />
                {/* <UploadModelTab 
                onImageSelect={handlePersonImageSelect}
                selectedImage={classicData.selfImage || undefined}
              /> */}
              </View>
            </MotiView>
          </ScrollView>
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
                <View className="w-12 h-12 bg-virtual-primary rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="shirt-outline" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-2xl font-outfit-semibold text-gray-900">
                    Step 2
                  </Text>
                  <Text className="text-lg font-outfit text-gray-600">Choose Garment</Text>
                </View>
              </View>

              {/* Tab Selector */}
              <View className="flex-row rounded-2xl bg-gray-300 p-1 mb-6">
                <TouchableOpacity
                  className={`flex-1 mx-1 py-3 rounded-xl ${
                    activeTab === "image" ? "bg-white" : "bg-transparent"
                  }`}
                  onPress={() => setActiveTab("image")}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-center font-outfit-semibold ${
                      activeTab === "image"
                        ? "text-virtual-primary"
                        : "text-gray-500"
                    }`}
                  >
                    Upload Image
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 mx-1 py-3 rounded-xl ${
                    activeTab === "description" ? "bg-white" : "bg-transparent"
                  }`}
                  onPress={() => setActiveTab("description")}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-center font-outfit-semibold ${
                      activeTab === "description"
                        ? "text-virtual-primary"
                        : "text-gray-500"
                    }`}
                  >
                    Describe
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              {activeTab === "image" ? (
                <UploadDressTab
                  onImageSelect={handleDressImageSelect}
                  selectedImage={classicData.dressImage || undefined}
                />
              ) : (
                <DescriptionDressTab
                  onDescriptionChange={handleDressDescriptionChange}
                  selectedDescription={
                    classicData.dressDescription || undefined
                  }
                />
              )}
            </View>
          </MotiView>
        );

      case 3:
        return (
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <View className="p-6 bg-gray-50 rounded-3xl">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-virtual-primary rounded-2xl items-center justify-center mr-4">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="white"
                  />
                </View>
                <View>
                  <Text className="text-2xl font-outfit-semibold text-gray-900">
                    Step 3
                  </Text>
                  <Text className="text-lg text-gray-600">Ready to Create</Text>
                </View>
              </View>

              {/* Summary */}
              <View className="bg-white rounded-2xl p-4 mb-6">
                <Text className="text-lg font-outfit-semibold text-gray-900 mb-4">
                  Summary
                </Text>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-outfit ml-3">
                    {classicData.selfImage
                      ? "Your photo uploaded ✓"
                      : classicData.selectedAvatar
                        ? `Avatar selected: ${classicData.selectedAvatar.name || "Unnamed"} ✓`
                        : "No photo or avatar selected"}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="shirt-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-outfit ml-3">
                    {classicData.dressImage
                      ? "Garment image uploaded ✓"
                      : classicData.dressDescription
                        ? `Described: "${classicData.dressDescription.substring(0, 30)}..."`
                        : "No garment selected"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 font-outfit ml-3">
                    Processing time: ~2-5 minutes
                  </Text>
                </View>
              </View>

              <ReusableButton
                title={isCreating ? t("workflows.buttons.creating") : t("tryOn.buttons.createTryOn")}
                onPress={handleCreateTryOn}
                disabled={
                  !isCurrentWorkflowValid() || isCreating || !hasCredits
                }
                bgColor={
                  isCurrentWorkflowValid() && hasCredits
                    ? "bg-virtual-primary"
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
    <View className="flex-1">
      {/* Progress Bar */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-outfit-semibold text-gray-600">
            Step {currentStep} of 3
          </Text>
          <Text className="text-sm font-outfit-semibold text-virtual-primary">
            {getWorkflowProgress()}% Complete
          </Text>
        </View>

        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <MotiView
            className="h-full bg-virtual-primary"
            from={{ width: "0%" }}
            animate={{ width: `${getWorkflowProgress()}%` }}
            transition={{ type: "timing", duration: 300 }}
          />
        </View>
      </View>

      {/* Step Content */}
      <View className="flex-1 px-6">{renderStepContent()}</View>

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <View className="px-6 py-4 bg-white border-t border-gray-100">
          <View className="flex-row items-center gap-3">
            {/* Previous Button */}
            <TouchableOpacity
              onPress={previousStep}
              disabled={currentStep === 1}
              className={`flex-row items-center justify-center px-5 py-3.5 rounded-xl border-2 ${
                currentStep === 1
                  ? "bg-gray-50 border-gray-200"
                  : "bg-white border-gray-300"
              }`}
              style={{
                shadowColor: currentStep === 1 ? "transparent" : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: currentStep === 1 ? 0 : 1,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={currentStep === 1 ? "#9CA3AF" : "#374151"}
              />
              <Text
                className={`font-outfit-semibold ml-1 ${
                  currentStep === 1 ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Previous
              </Text>
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNext}
              disabled={!isCurrentStepValid()}
              className={`flex-1 flex-row items-center justify-center px-5 py-3.5 rounded-xl ${
                isCurrentStepValid() ? "bg-virtual-primary" : "bg-gray-300"
              }`}
              style={{
                shadowColor: isCurrentStepValid() ? "#ec4899" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: isCurrentStepValid() ? 3 : 0,
              }}
            >
              <Text
                className={`font-outfit-semibold mr-1 ${
                  isCurrentStepValid() ? "text-white" : "text-gray-500"
                }`}
              >
                Next
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={isCurrentStepValid() ? "#FFFFFF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ClassicTryOn;
