import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import AnimatedView from "../ui/AnimatedView";
import AnimatedText from "../ui/AnimatedText";
import { Calendar, ExternalLink, Heart } from 'lucide-react-native';

// Sample outfits for demo purposes
const SAMPLE_OUTFITS = [
  {
    id: "sample-1",
    personImageUrl: "",
    garmentImageUrl: "",
    resultImageUrl:
      "https://images.unsplash.com/photo-1736555142217-916540c7f1b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwb3V0Zml0JTIwY2FzdWFsfGVufDF8fHx8MTc2MjM1NjI4NHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Casual Weekend Look - Denim jacket with white tee and black jeans",
    category: "Casual",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
    productUrl: "https://example.com/product1",
  },
  {
    id: "sample-2",
    personImageUrl: "",
    garmentImageUrl: "",
    resultImageUrl:
      "https://images.unsplash.com/photo-1760083545495-b297b1690672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBzdHlsZXxlbnwxfHx8fDE3NjIzNTYyODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Elegant Evening Dress - Black cocktail dress perfect for special occasions",
    category: "Formal",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
  },
  {
    id: "sample-3",
    personImageUrl: "",
    garmentImageUrl: "",
    resultImageUrl:
      "https://images.unsplash.com/photo-1538329972958-465d6d2144ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjIzMzA4NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Urban Streetwear - Oversized hoodie with cargo pants and sneakers",
    category: "Streetwear",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
  },
  {
    id: "sample-4",
    personImageUrl: "",
    garmentImageUrl: "",
    resultImageUrl:
      "https://images.unsplash.com/photo-1758534063951-1c78600f8129?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBzdWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzYyMzU2Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Professional Business Suit - Navy blue suit with white shirt",
    category: "Formal",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    productUrl: "https://example.com/product4",
  },
  {
    id: "sample-5",
    personImageUrl: "",
    garmentImageUrl: "",
    resultImageUrl:
      "https://images.unsplash.com/photo-1718839932371-7adaf5edc96a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBvdXRmaXQlMjBiZWFjaHxlbnwxfHx8fDE3NjIzNTYyODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Summer Beach Outfit - Light sundress perfect for sunny days",
    category: "Summer",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: true,
  },
  {
    id: "sample-6",
    personImageUrl: "",
    garmentImageUrl: "",
    resultImageUrl:
      "https://images.unsplash.com/photo-1551734412-cbc8e1904805?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqYWNrZXQlMjBjb2F0fGVufDF8fHx8MTc2MjI3NTMxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Winter Coat - Warm wool coat for cold weather",
    category: "Winter",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
  },
];

const getCategoryColor = (category: string) => {
  const colors = {
    Casual: "#3b82f6",
    Formal: "#7c3aed", 
    Streetwear: "#f59e0b",
    Summer: "#10b981",
    Winter: "#6b7280"
  };
  return colors[category] || "#6b7280";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const EachOutput = () => {
  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16 }}
    >
      <View className="flex-row flex-wrap justify-between">
        {SAMPLE_OUTFITS.map((outfit, index) => (
          <AnimatedView
            key={outfit.id}
            animation="slideUp"
            delay={index * 150}
            duration={600}
            easing="spring"
            className="w-full mb-4"
          >
            <TouchableOpacity className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Image Container */}
              <View className="relative">
                <Image
                  source={{ uri: outfit.resultImageUrl }}
                  className="w-full h-80 bg-gray-100"
                  resizeMode="cover"
                />
                
                {/* Favorite Heart */}
                <TouchableOpacity className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-sm">
                  <Heart 
                    size={16} 
                    color={outfit.isFavorite ? "#ec4899" : "#6b7280"} 
                    fill={outfit.isFavorite ? "#ec4899" : "transparent"}
                  />
                </TouchableOpacity>

                {/* Category Badge */}
                <View 
                  className="absolute top-3 left-3 px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${getCategoryColor(outfit.category)}20` }}
                >
                  <Text 
                    className="text-xs font-semibold"
                    style={{ color: getCategoryColor(outfit.category) }}
                  >
                    {outfit.category}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View className="p-4">
                <AnimatedText
                  animation="slideUp"
                  delay={(index * 150) + 200}
                  className="text-sm font-semibold text-gray-800 mb-3 leading-5"
                  numberOfLines={2}
                >
                  {outfit.description}
                </AnimatedText>

                {/* Bottom Actions */}
                <View className="flex-row justify-between items-center">
                  <AnimatedView
                    animation="slideUp"
                    delay={(index * 150) + 300}
                    className="flex-row items-center"
                  >
                    <Calendar size={12} color="#6b7280" />
                    <Text className="text-xs text-gray-500 ml-1">
                      {formatDate(outfit.createdAt)}
                    </Text>
                  </AnimatedView>

                  {outfit.productUrl && (
                    <AnimatedView
                      animation="slideUp"
                      delay={(index * 150) + 400}
                    >
                      <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
                        <ExternalLink size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-600 ml-1 font-medium">
                          Shop
                        </Text>
                      </TouchableOpacity>
                    </AnimatedView>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </AnimatedView>
        ))}
      </View>
    </ScrollView>
  );
};

export default EachOutput;
