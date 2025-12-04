import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useState, type FC } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react-native";
import { Colors } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

interface UploadSkeletonProps {
  title: string;
  onImageSelect: (uri: string) => void;
  selectedImage?: string;
  disabled?: boolean;
}

const UploadSkeleton: FC<UploadSkeletonProps> = ({
  title,
  onImageSelect,
  selectedImage,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      Alert.alert(
        t("common.error"),
        t("tryOn.messages.permissionRequired"),
        [{ text: t("common.confirm") }]
      );
      return false;
    }
    return true;
  };

  const showImagePickerOptions = () => {
    if (disabled) return;

    Alert.alert(t("tryOn.buttons.selectFromGallery"), t("tryOn.messages.chooseImageSource"), [
      {
        text: t("tryOn.buttons.takePhoto"),
        onPress: () => pickImage("camera"),
      },
      {
        text: t("tryOn.buttons.selectFromGallery"),
        onPress: () => pickImage("gallery"),
      },
      {
        text: t("common.cancel"),
        style: "cancel",
      },
    ]);
  };

  const pickImage = async (source: "camera" | "gallery") => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setLoading(true);

    try {
      let result;

      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        onImageSelect(result.assets[0].uri);
      }
    } catch {
      Alert.alert(t("common.error"), t("errors.uploadError"));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    onImageSelect("");
  };

  if (selectedImage) {
    return (
      <View className="relative">
        <TouchableOpacity
          onPress={showImagePickerOptions}
          disabled={disabled}
          activeOpacity={0.8}
          className={`rounded-xl overflow-hidden ${disabled ? "opacity-50" : ""}`}
        >
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-64 rounded-xl"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20 items-center justify-center">
            <View className="bg-white/90 rounded-full p-2">
              <ImageIcon size={24} color={Colors.gray[600]} />
            </View>
          </View>
        </TouchableOpacity>

        {!disabled && (
          <TouchableOpacity
            onPress={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5"
            activeOpacity={0.8}
          >
            <X size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        onPress={showImagePickerOptions}
        disabled={disabled || loading}
        activeOpacity={0.8}
        className={`flex items-center justify-center border-2 border-virtual-primary-light border-dotted p-10 rounded-xl gap-4 ${
          disabled ? "opacity-50" : ""
        } ${loading ? "bg-gray-50" : ""}`}
      >
        {loading ? (
          <>
            <View className="animate-spin">
              <Upload size={48} color={Colors.gray[400]} />
            </View>
            <Text className="text-gray-400 font-outfit-medium text-base">
              {t("common.loading")}
            </Text>
          </>
        ) : (
          <>
            <Upload size={48} color={Colors.gray[400]} />
            <Text className="text-virtual-primary font-outfit-semibold text-base text-center">
              {title}
            </Text>
            <View className="flex-row gap-4 mt-2">
              <View className="flex items-center">
                <Camera size={20} color={Colors.gray[500]} />
                <Text className="text-xs font-outfit text-gray-500 mt-1">{t("tryOn.buttons.takePhoto")}</Text>
              </View>
              <View className="flex items-center">
                <ImageIcon size={20} color={Colors.gray[500]} />
                <Text className="text-xs font-outfit text-gray-500 mt-1">{t("tryOn.buttons.selectFromGallery")}</Text>
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadSkeleton;
