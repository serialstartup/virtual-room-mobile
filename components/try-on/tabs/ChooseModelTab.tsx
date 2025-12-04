import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import TitleSectionTab from "./TitleSectionTab";
import { FlashList } from "@shopify/flash-list";
import { useModels } from "@/hooks/useModels";

interface ChooseModelTabProps {
  onImageSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

const ChooseModelTab: React.FC<ChooseModelTabProps> = ({ onImageSelect, selectedImage }) => {
  const { data: models, isLoading, error } = useModels();

  const handleModelSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
  };

  if (isLoading) {
    return (
      <TitleSectionTab title="Model seç">
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-600 mt-4">Modeller yükleniyor...</Text>
        </View>
      </TitleSectionTab>
    );
  }

  if (error) {
    return (
      <TitleSectionTab title="Model seç">
        <View className="items-center py-8">
          <Text className="text-red-500 font-outfit text-center">
            Modeller yüklenirken hata oluştu
          </Text>
        </View>
      </TitleSectionTab>
    );
  }

  if (!models || models.length === 0) {
    return (
      <TitleSectionTab title="Model seç">
        <View className="items-center py-8">
          <Text className="text-gray-600 font-outfit text-center">
            Model bulunamadı
          </Text>
        </View>
      </TitleSectionTab>
    );
  }

  const renderItem = ({ item }) => {
    const isSelected = selectedImage === item.image_url;
    
    return (
      <TouchableOpacity 
        className="mr-4 items-center"
        onPress={() => handleModelSelect(item.image_url)}
        activeOpacity={0.8}
      >
        <View className={`w-44 h-56 rounded-xl overflow-hidden border-2 ${
          isSelected ? 'border-virtual-primary' : 'border-gray-200'
        }`}>
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {isSelected && (
            <View className="absolute inset-0 bg-virtual-primary/20 items-center justify-center">
              <View className="bg-virtual-primary rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white font-outfit-bold">✓</Text>
              </View>
            </View>
          )}
        </View>
        <Text className={`mt-2 text-sm font-outfit-medium ${
          isSelected ? 'text-virtual-primary' : 'text-gray-700'
        }`}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TitleSectionTab title="Model seç">
      <View >
        <FlashList
          horizontal
          data={models}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </TitleSectionTab>
  );
};

export default ChooseModelTab;
