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
import { Image } from "expo-image";
import { useAvatar } from "@/hooks/useAvatar";
import { useWorkflowStore } from "@/store/workflowStore";
import ReusableButton from "@/components/ui/ReusableButton";
import * as ImagePicker from "expo-image-picker";
// import { analytics } from "@/services/analytics";

interface AvatarTryOnProps {
  onTryOnCreate: (tryOnId: string) => void;
  onAvatarCreate?: (avatarId: string) => void;
}

const AvatarTryOn: React.FC<AvatarTryOnProps> = ({
  onTryOnCreate,
  onAvatarCreate,
}) => {
  const { createAvatar, isCreating } = useAvatar();
  const { 
    workflowData, 
    setAvatarCreationFaceImage, 
    setAvatarCreationName 
  } = useWorkflowStore();

  const { faceImage, avatarName } = workflowData.avatarCreation;

  // Image picker function
  const pickFaceImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission needed",
          "Please allow access to your photo library to upload face image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for faces
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarCreationFaceImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Generate random name if empty
  const generateRandomName = () => {
    return "Avatar" + Math.random().toString(36).substring(2, 10);
  };

  // Create avatar function
  const handleCreateAvatar = async () => {
    if (!faceImage) {
      Alert.alert("Missing Information", "Please provide face image.");
      return;
    }

    try {
      console.log("[AVATAR_TRYON] 🎯 Starting avatar creation...");
      
      // Track start (wrapped in try-catch to isolate analytics issues)
      // try {
      //   analytics.trackAvatarModelGeneration(
      //     faceImage.startsWith("file://") ? "camera" : "upload"
      //   );
      // } catch (analyticsError) {
      //   console.warn("[AVATAR_TRYON] ⚠️ Analytics tracking start failed:", analyticsError);
      // }
      

      const finalName = avatarName.trim() || generateRandomName();
      console.log("[AVATAR_TRYON] 📝 Creating avatar with name:", finalName);

      // Create avatar data object first
      const avatarData = {
        name: finalName,
        face_image_url: faceImage,
      };
      console.log("[AVATAR_TRYON] 📋 Avatar data prepared:", avatarData);

      // Call createAvatar with try-catch for more specific error handling
      let newAvatar: any;
      try {
        console.log("[AVATAR_TRYON] 🚀 Calling createAvatar...");
        newAvatar = await createAvatar(avatarData);
        console.log("[AVATAR_TRYON] 📦 Raw avatar response:", newAvatar);
      } catch (createError) {
        console.error("[AVATAR_TRYON] ❌ createAvatar failed:", createError);
        throw createError; // Re-throw to be caught by outer catch
      }

      console.log("[AVATAR_TRYON] ✅ Avatar created successfully:", newAvatar?.id);

      // Track completion (wrapped in try-catch to isolate analytics issues)
      try {
        // analytics.trackAvatarCreated(
        //   faceImage.startsWith("file://") ? "camera" : "upload"
        // );
        // analytics.trackCreditUsed(3, "avatar_creation");
      } catch (analyticsError) {
        console.warn("[AVATAR_TRYON] ⚠️ Analytics tracking completion failed:", analyticsError);
      }

      // Call onAvatarCreate to show ResultModal for avatar processing
      console.log("[AVATAR_TRYON] 🎯 Calling onAvatarCreate callback:", {
        hasCallback: !!onAvatarCreate,
        avatarId: newAvatar?.id
      });
      
      if (onAvatarCreate && newAvatar?.id) {
        try {
          onAvatarCreate(newAvatar.id);
          console.log("[AVATAR_TRYON] ✅ onAvatarCreate callback completed");
        } catch (callbackError) {
          console.error("[AVATAR_TRYON] ❌ onAvatarCreate callback failed:", callbackError);
          throw callbackError;
        }
      } else {
        // Fallback alert if no modal handler
        Alert.alert(
          "Avatar Created!",
          `Your avatar "${newAvatar.name}" has been created successfully and will be processed in the background.`,
          [
            {
              text: "OK",
              onPress: () => {
                console.log("Avatar created:", newAvatar);
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.log("Sorun burada : ",error)
      Alert.alert("Error", error.message || "Failed to create avatar");
    }
  };

  return (
    <ScrollView className="flex-1">
      {/* Content */}
      <View className="flex-1 px-6">
        <MotiView
          from={{ opacity: 0, translateX: 50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 300 }}
        >
          <View className="p-6 bg-gray-50 rounded-3xl">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="person-outline" size={24} color="white" />
              </View>
              <View>
                <Text className="text-2xl font-outfit-semibold text-gray-900">
                  Create Avatar
                </Text>
                <Text className="text-lg font-outfit text-gray-600">
                  Upload your face photo
                </Text>
              </View>
            </View>

            {/* Privacy Notice */}
            <View className="bg-blue-50 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color="#3B82F6"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-outfit-semibold text-blue-900 mb-2">
                    Privacy First
                  </Text>
                  <Text className="text-blue-800 font-outfit text-sm">
                    Mahremiyetinizi önemsiyoruz. Yüzünüzü yükleyin ve vücüdü
                    olan bir avatar oluşturalım, bu avatar üzerinden işlemlere
                    devam edin.
                  </Text>
                </View>
              </View>
            </View>

            {/* Avatar Name Input */}
            <View className="mb-6">
              <Text className="text-lg font-outfit-semibold text-gray-900 mb-3">
                Avatar İsmi (Opsiyonel)
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900"
                placeholder="lovelyavatar"
                value={avatarName}
                onChangeText={setAvatarCreationName}
                maxLength={50}
              />
            </View>

            {/* Face Image Upload */}
            <View className="mb-6">
              <Text className="text-lg font-outfit-semibold text-gray-900 mb-3">
                Yüz Fotoğrafı *
              </Text>
              <TouchableOpacity
                onPress={pickFaceImage}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 items-center bg-white"
              >
                {faceImage ? (
                  <View className="items-center">
                    <View className="w-20 h-20 rounded-full overflow-hidden mb-3">
                      <Image
                        source={{ uri: faceImage }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </View>
                    <Text className="text-blue-600 font-outfit-semibold">
                      Fotoğraf Seçildi ✓
                    </Text>
                    <Text className="text-gray-500 font-outfit text-sm">
                      Değiştirmek için tekrar dokunun
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="camera-outline" size={40} color="#6B7280" />
                    <Text className="text-gray-700 font-outfit-semibold mt-3">
                      Yüz Fotoğrafı Seçin
                    </Text>
                    <Text className="text-gray-500 font-outfit text-sm text-center mt-1">
                      En iyi sonuç için net, iyi aydınlatılmış selfie kullanın
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Example Guidelines */}
            <View className="bg-green-50 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#10B981"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-outfit-semibold text-green-900 mb-2">
                    İdeal Fotoğraf Özellikleri
                  </Text>
                  <Text className="text-green-800 font-outfit text-sm">
                    • Yüz net görünür olmalı{"\n"}• İyi aydınlatma{"\n"}• Tek
                    kişi{"\n"}• Gözlük veya maske olmadan{"\n"}• Frontal açı
                  </Text>
                </View>
              </View>
            </View>

            {/* Create Button */}
            <ReusableButton
              title={isCreating ? "Avatar Oluşturuluyor..." : "Avatar Oluştur"}
              onPress={handleCreateAvatar}
              disabled={!faceImage || isCreating}
              bgColor={faceImage && !isCreating ? "bg-blue-500" : "bg-gray-400"}
              textColor="text-white"
              variant="filled"
              buttonShadow
            />
          </View>
        </MotiView>
      </View>
    </ScrollView>
  );
};

export default AvatarTryOn;
