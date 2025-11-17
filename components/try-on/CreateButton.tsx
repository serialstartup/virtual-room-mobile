import { View, Text, Alert } from "react-native";
import { useState } from "react";
import ReusableButton from "../ui/ReusableButton";
import { useTryOn } from "@/hooks/useTryOn";

interface TryOnData {
  selectedPersonImage?: string;
  selectedDressImage?: string;
  dressDescription?: string;
}

interface CreateButtonProps {
  isReady: boolean;
  tryOnData: TryOnData;
  onTryOnCreate: (tryOnId: string) => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({
  isReady,
  tryOnData,
  onTryOnCreate,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const { createTryOn } = useTryOn();

  const handleCreateTryOn = async () => {
    if (!isReady) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen model fotoğrafı ve kıyafet seçimini tamamlayın."
      );
      return;
    }

    if (!tryOnData.selectedPersonImage) {
      Alert.alert("Hata", "Model fotoğrafı seçmelisiniz.");
      return;
    }

    if (!tryOnData.selectedDressImage && !tryOnData.dressDescription) {
      Alert.alert("Hata", "Kıyafet fotoğrafı yükleyin veya açıklama yazın.");
      return;
    }

    try {
      setIsCreating(true);

      const createRequest: any = {
        self_image: tryOnData.selectedPersonImage,
      };

      // Only add dress_image if it exists and is not empty
      if (tryOnData.selectedDressImage) {
        createRequest.dress_image = tryOnData.selectedDressImage;
      }

      // Only add dress_description if it exists and is not empty
      if (tryOnData.dressDescription) {
        createRequest.dress_description = tryOnData.dressDescription;
      }

      console.log('[CREATE_BUTTON] 📤 Sending request:', createRequest);
      
      const newTryOn = await createTryOn(createRequest);
      console.log('[CREATE_BUTTON] ✅ Try-on created successfully:', newTryOn);
      onTryOnCreate(newTryOn.id);
    } catch (error: any) {
      console.error('[CREATE_BUTTON] ❌ Try-on creation error:', error);
      console.error('[CREATE_BUTTON] ❌ Error details:', {
        message: error.message,
        response: error.response,
        data: error.data,
        status: error.status
      });
      
      Alert.alert(
        "Hata",
        error.message || "Try-on oluşturulurken hata oluştu. Lütfen internet bağlantınızı kontrol edin."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View>
      <ReusableButton
        textColor="text-white"
        bgColor={isReady ? "bg-virtual-primary" : "bg-gray-400"}
        variant="filled"
        buttonShadow={true}
        onPress={handleCreateTryOn}
        title={isCreating ? "Oluşturuluyor..." : "Try it on!"}
        disabled={!isReady || isCreating}
      />
    </View>
  );
};

export default CreateButton;
