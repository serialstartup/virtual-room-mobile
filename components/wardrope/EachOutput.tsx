import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import AnimatedText from "../ui/AnimatedText";
import AnimatedHeart from "../ui/AnimatedHeart";
import FadeTransition from "../ui/FadeTransition";
import { Calendar, ExternalLink } from 'lucide-react-native';
import { Colors } from "@/constants";
import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeWithTryOn } from "@/services/wardrobe";
import { formatDate } from "@/utils";

interface EachOutputProps {
  filter?: 'all' | 'liked';
  wardrobeItems?: WardrobeWithTryOn[];
  favorites?: WardrobeWithTryOn[];
}

const EachOutput: React.FC<EachOutputProps> = ({ 
  filter = 'all', 
  wardrobeItems = [],
  favorites = []
}) => {
  const { toggleLike, isTogglingLike } = useWardrobe();
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  
  // Filter the wardrobeItems based on the filter prop
  const filteredOutfits = React.useMemo(() => {
    if (filter === 'liked') {
      return favorites;
    }
    return wardrobeItems;
  }, [wardrobeItems, favorites, filter]);

  const toggleFavorite = async (tryOnId: string, isCurrentlyLiked: boolean) => {
    try {
      // If removing from liked filter, hide the item first
      if (filter === 'liked' && isCurrentlyLiked) {
        setHiddenItems(prev => new Set(prev).add(tryOnId));
        
        // Wait a bit for animation then toggle
        setTimeout(async () => {
          await toggleLike(tryOnId);
          // Remove from hidden items after backend update
          setTimeout(() => {
            setHiddenItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(tryOnId);
              return newSet;
            });
          }, 100);
        }, 250);
      } else {
        // Normal toggle for other cases
        await toggleLike(tryOnId);
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      Alert.alert("Hata", "Favori durumu güncellenirken bir hata oluştu");
      
      // Restore item if error occurred
      setHiddenItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(tryOnId);
        return newSet;
      });
    }
  };


  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20 }}
    >
      <View className="flex-row flex-wrap justify-between shadow-sm">
        {filteredOutfits.length === 0 ? (
          <View className="w-full flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center">
              {filter === 'liked' ? 'No favorites yet - Try some outfits and like them!' : 'No try-ons in wardrobe yet - Start creating virtual try-ons!'}
            </Text>
          </View>
        ) : (
          filteredOutfits.map((wardrobeItem, index) => {
            const tryOn = wardrobeItem.try_on;
            if (!tryOn || !tryOn.result_image) return null;

            const isHidden = hiddenItems.has(tryOn.id);

            return (
              <FadeTransition
                key={wardrobeItem.id}
                visible={!isHidden}
                duration={300}
                exitDuration={200}
                delay={index * 50}
                className="w-full my-4"
              >
                <TouchableOpacity className="bg-white rounded-2xl overflow-hidden">
                  {/* Image Container */}
                  <View className="relative">
                    <Image
                      source={{ uri: tryOn.result_image }}
                      className="w-full h-96 bg-gray-100"
                      resizeMode="cover"
                    />
                    
                    {/* Favorite Heart */}
                    <AnimatedHeart
                      isLiked={wardrobeItem.liked}
                      onToggle={() => toggleFavorite(tryOn.id, wardrobeItem.liked)}
                      disabled={isTogglingLike}
                      hapticType="medium"
                    />

                    {/* Processing Status Badge */}
                    {tryOn.processing_status && (
                      <View 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full"
                        style={{ 
                          backgroundColor: tryOn.processing_status === 'completed' ? '#10b98120' : 
                                          tryOn.processing_status === 'processing' ? '#f59e0b20' : '#ef444420'
                        }}
                      >
                        <Text 
                          className="text-xs font-semibold"
                          style={{ 
                            color: tryOn.processing_status === 'completed' ? '#10b981' : 
                                   tryOn.processing_status === 'processing' ? '#f59e0b' : '#ef4444'
                          }}
                        >
                          {tryOn.processing_status === 'completed' ? 'Completed' :
                           tryOn.processing_status === 'processing' ? 'Processing' : 
                           tryOn.processing_status}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <View className="p-4">
                    <AnimatedText
                      animation="slideUp"
                      delay={(index * 150) + 200}
                      className="text-sm font-semibold text-gray-800 mb-3 leading-5"
                      numberOfLines={2}
                    >
                      {tryOn.dress_description || 'Virtual Try-on Result'}
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
                          {formatDate(wardrobeItem.created_at)}
                        </Text>
                      </AnimatedView>

                      {tryOn.product_url && (
                        <AnimatedView
                          animation="slideUp"
                          delay={(index * 150) + 400}
                        >
                          <TouchableOpacity 
                            className="flex-row items-center border-[1px] border-virtual-primary px-3 py-1 rounded-full"
                            onPress={() => {
                              // TODO: Open product URL
                              console.log('Open product:', tryOn.product_url);
                            }}
                          >
                            <ExternalLink size={12} color={Colors.mutedPink[500]} />
                            <Text className="text-xs text-virtual-primary ml-1 font-medium">
                              Shop
                            </Text>
                          </TouchableOpacity>
                        </AnimatedView>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </FadeTransition>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default EachOutput;
