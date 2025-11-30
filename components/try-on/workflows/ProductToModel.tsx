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
import { useProductToModel } from "@/hooks/useMultiModalTryOn";
import UploadTab from "../tabs/UploadTab";
import ReusableButton from "@/components/ui/ReusableButton";
import { UserAvatar } from "@/hooks/useUserAvatars";
import { analytics } from "@/services/analytics";

interface ProductToModelProps {
  onTryOnCreate: (tryOnId: string) => void;
}

const ProductToModel: React.FC<ProductToModelProps> = ({ onTryOnCreate }) => {
  const {
    workflowData,
    currentStep,
    nextStep,
    previousStep,
    setProductImage,
    setProductName,
    setProductScenePrompt,
    setProductModelImage,
    setProductSelectedAvatar,
    isCurrentWorkflowValid,
    getWorkflowProgress,
  } = useWorkflowStore();

  const { createProductToModel, isCreating, error, hasCredits } =
    useProductToModel();

  const productData = workflowData.productToModel;

  const handleProductImageSelect = (imageUrl: string) => {
    setProductImage(imageUrl);
  };

  const handleModelImageSelect = (imageUrl: string) => {
    setProductModelImage(imageUrl);
    setProductSelectedAvatar(null); // Clear avatar selection
  };

  const handleAvatarSelect = (avatar: UserAvatar | null) => {
    setProductSelectedAvatar(avatar);
    if (avatar) {
      setProductModelImage(null); // Clear model image when avatar is selected
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !productData.productImage) {
      Alert.alert("Missing Image", "Please upload your product image first.");
      return;
    }
    if (
      currentStep === 2 &&
      !productData.modelImage &&
      !productData.selectedAvatar
    ) {
      Alert.alert(
        "Missing Model",
        "Please upload a model image or select an avatar."
      );
      return;
    }
    if (currentStep === 3 && !productData.productName.trim()) {
      Alert.alert("Missing Product Name", "Please enter a product name.");
      return;
    }
    nextStep();
  };

  // Check if current step is valid for Next button
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!productData.productImage;
      case 2:
        return !!(productData.modelImage || productData.selectedAvatar);
      case 3:
        return !!productData.productName.trim();
      default:
        return true;
    }
  };

  const handleCreateProductToModel = async () => {
    if (!isCurrentWorkflowValid()) {
      Alert.alert("Incomplete Data", "Please complete all required steps.");
      return;
    }

    if (!hasCredits) {
      analytics.trackOutOfCredits("product_to_model");
      Alert.alert(
        "No Credits",
        "You need credits to create a product showcase."
      );
      return;
    }

    try {
      // Track start
      analytics.trackProductToModelStarted();
      const startTime = Date.now();

      const productToModelData = {
        product_image: productData.productImage!,
        model_image:
          productData.selectedAvatar?.avatar_image_url ||
          productData.modelImage!,
        product_name: productData.productName,
        scene_prompt: productData.scenePrompt || "professional studio setting",
      };

      const newTryOn = await createProductToModel(productToModelData);

      // Track completion and credit usage
      const processingTime = Date.now() - startTime;
      analytics.trackProductToModelCompleted(newTryOn.id, processingTime);
      analytics.trackCreditUsed(1, "product_to_model");

      onTryOnCreate(newTryOn.id);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create product showcase");
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
                <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="bag-outline" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    Step 1
                  </Text>
                  <Text className="text-lg text-gray-600">
                    Upload Product Image
                  </Text>
                </View>
              </View>
              <UploadTab
                onImageSelect={handleProductImageSelect}
                selectedImage={productData.productImage || undefined}
                title="Ürün ekle"
                skeletonTitle="Ürün seçmek için tıkla"
              />
              {/* <UploadDressTab 
                onImageSelect={handleProductImageSelect}
                selectedImage={productData.productImage || undefined}
              /> */}
            </View>
          </MotiView>
        );

      // case 2:
      //   return (
      //     <ScrollView>
      //       <MotiView
      //         from={{ opacity: 0, translateX: 50 }}
      //         animate={{ opacity: 1, translateX: 0 }}
      //         transition={{ type: "timing", duration: 300 }}
      //       >
      //         <View className="p-6 bg-gray-50 rounded-3xl">
      //           <View className="flex-row items-center mb-6">
      //             <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mr-4">
      //               <Ionicons name="person-outline" size={24} color="white" />
      //             </View>
      //             <View>
      //               <Text className="text-2xl font-bold text-gray-900">
      //                 Step 2
      //               </Text>
      //               <Text className="text-lg text-gray-600">Select Model</Text>
      //             </View>
      //           </View>

      //           <UploadTab
      //             onImageSelect={handleModelImageSelect}
      //             selectedImage={productData.modelImage || undefined}
      //             title="Model ekle"
      //             skeletonTitle="Model seçmek için tıkla"
      //             enableAvatarSelection={true}
      //             onAvatarSelect={handleAvatarSelect}
      //             selectedAvatar={productData.selectedAvatar}
      //           />
      //         </View>
      //       </MotiView>
      //     </ScrollView>
      //   );

      case 2:
        return (
          <ScrollView>
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 300 }}
            >
              <View className="p-6 bg-gray-50 rounded-3xl">
                <View className="flex-row items-center mb-6">
                  <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="create-outline" size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-2xl font-bold text-gray-900">
                      Step 3
                    </Text>
                    <Text className="text-lg text-gray-600">
                      Product Details
                    </Text>
                  </View>
                </View>

                {/* Product Name */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Product Name *
                  </Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900"
                    placeholder="e.g. Nike Air Max Sneakers"
                    value={productData.productName}
                    onChangeText={setProductName}
                    multiline={false}
                    maxLength={100}
                  />
                </View>

                {/* Scene Prompt */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">
                    Scene Setting
                  </Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 min-h-[120px]"
                    placeholder="Describe the setting for your product showcase (e.g. modern urban street, luxurious hotel lobby, minimalist studio)"
                    value={productData.scenePrompt}
                    onChangeText={setProductScenePrompt}
                    multiline
                    textAlignVertical="top"
                    maxLength={300}
                  />
                  <Text className="text-sm text-gray-500 mt-2">
                    {productData.scenePrompt.length}/300 characters
                  </Text>
                </View>

                {/* Tips */}
                <View className="bg-blue-50 rounded-2xl p-4">
                  <View className="flex-row items-start">
                    <Ionicons name="bulb-outline" size={20} color="#3B82F6" />
                    <View className="ml-3 flex-1">
                      <Text className="font-semibold text-blue-900 mb-2">
                        Tips for Better Results
                      </Text>
                      <Text className="text-blue-800 text-sm leading-relaxed">
                        • Use descriptive scene settings for more engaging
                        showcases{"\n"}• Specify lighting preferences (natural,
                        studio, dramatic){"\n"}• Mention the target audience or
                        use case
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </MotiView>
          </ScrollView>
        );

      case 4:
        return (
          <MotiView
            from={{ opacity: 0, translateX: 50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: "timing", duration: 300 }}
          >
            <View className="p-6 bg-gray-50 rounded-3xl">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="white"
                  />
                </View>
                <View>
                  <Text className="text-2xl font-bold text-gray-900">
                    Step 4
                  </Text>
                  <Text className="text-lg text-gray-600">
                    Ready to Generate
                  </Text>
                </View>
              </View>

              {/* Summary */}
              <View className="bg-white rounded-2xl p-4 mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  Summary
                </Text>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="bag-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3">
                    {productData.productImage
                      ? "Product image uploaded ✓"
                      : "No image selected"}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3">
                    {productData.modelImage
                      ? "Model image uploaded ✓"
                      : productData.selectedAvatar
                        ? `Avatar selected: ${productData.selectedAvatar.name || "Unnamed"} ✓`
                        : "No model selected"}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="pricetag-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3">
                    {productData.productName
                      ? `Product: ${productData.productName}`
                      : "No product name"}
                  </Text>
                </View>

                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#6B7280"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-gray-700 ml-3 flex-1">
                    Scene:{" "}
                    {productData.scenePrompt || "Professional studio setting"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3">
                    Processing time: ~3-10 minutes
                  </Text>
                </View>
              </View>

              <ReusableButton
                title={
                  isCreating ? "Generating..." : "Generate Product Showcase"
                }
                onPress={handleCreateProductToModel}
                disabled={
                  !isCurrentWorkflowValid() || isCreating || !hasCredits
                }
                bgColor={
                  isCurrentWorkflowValid() && hasCredits
                    ? "bg-green-500"
                    : "bg-gray-400"
                }
                textColor="text-white"
                variant="filled"
                buttonShadow
              />

              {error && (
                <Text className="text-red-500 text-center mt-4">
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
          <Text className="text-sm font-semibold text-gray-600">
            Step {currentStep} of 4
          </Text>
          <Text className="text-sm font-semibold text-green-500">
            {getWorkflowProgress()}% Complete
          </Text>
        </View>

        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <MotiView
            className="h-full bg-green-500"
            from={{ width: "0%" }}
            animate={{ width: `${getWorkflowProgress()}%` }}
            transition={{ type: "timing", duration: 300 }}
          />
        </View>
      </View>

      {/* Step Content */}
      <View className="flex-1 px-6">{renderStepContent()}</View>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
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
                className={`font-semibold ml-1 ${
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
                isCurrentStepValid() ? "bg-green-500" : "bg-gray-300"
              }`}
              style={{
                shadowColor: isCurrentStepValid() ? "#22c55e" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: isCurrentStepValid() ? 3 : 0,
              }}
            >
              <Text
                className={`font-semibold mr-1 ${
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

export default ProductToModel;
