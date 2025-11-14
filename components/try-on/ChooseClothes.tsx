import { View, Text, TouchableOpacity, Image } from 'react-native'
import { FlashList } from "@shopify/flash-list";

interface ChooseClothesProps {
  onImageSelect: (imageUrl: string, description?: string) => void;
  selectedImage?: string;
}

const SUPABASE_URL = "https://dgwlqafeemwdzrbbfpii.supabase.co"
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/clothes`

const clothes = [
  {
    id: 1,
    name: "Blue Shirt",
    image: `${STORAGE_URL}/blue-shirt.png`,
    description: "Casual blue shirt"
  },
  {
    id: 2,
    name: "Red Dress",
    image: `${STORAGE_URL}/red-dress.png`,
    description: "Elegant red dress"
  },
  {
    id: 3,
    name: "Black Jacket",
    image: `${STORAGE_URL}/black-jacket.png`,
    description: "Stylish black jacket"
  },
  {
    id: 4,
    name: "White T-Shirt",
    image: `${STORAGE_URL}/white-tshirt.png`,
    description: "Basic white t-shirt"
  },
  {
    id: 5,
    name: "Jeans",
    image: `${STORAGE_URL}/jeans.png`,
    description: "Classic blue jeans"
  },
  {
    id: 6,
    name: "Summer Dress",
    image: `${STORAGE_URL}/summer-dress.png`,
    description: "Light summer dress"
  }
];

const ChooseClothes: React.FC<ChooseClothesProps> = ({ onImageSelect, selectedImage }) => {
  const handleClothesSelect = (item: any) => {
    onImageSelect(item.image, item.description);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedImage === item.image;
    
    return (
      <TouchableOpacity 
        className="mr-4 items-center"
        onPress={() => handleClothesSelect(item)}
        activeOpacity={0.8}
      >
        <View className={`w-44 h-56 rounded-xl overflow-hidden border-2 ${
          isSelected ? 'border-virtual-primary' : 'border-gray-200'
        }`}>
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {isSelected && (
            <View className="absolute inset-0 bg-virtual-primary/20 items-center justify-center">
              <View className="bg-virtual-primary rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white font-bold">✓</Text>
              </View>
            </View>
          )}
        </View>
        <Text className={`mt-2 text-sm font-medium ${
          isSelected ? 'text-virtual-primary' : 'text-gray-700'
        }`}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-4">Kıyafet Seç</Text>
      <FlashList
        horizontal
        data={clothes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

export default ChooseClothes