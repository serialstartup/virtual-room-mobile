import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import AnimatedText from "../ui/AnimatedText";
import AnimatedHeart from "../ui/AnimatedHeart";
import { Calendar } from "lucide-react-native";
import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeWithTryOn } from "@/services/wardrobe";
import { formatDate } from "@/utils";
import { useTranslation } from "react-i18next";

interface EachOutputProps {
  filter?: "all" | "liked";
  wardrobeItems?: WardrobeWithTryOn[];
  favorites?: WardrobeWithTryOn[];
}

const EachOutput: React.FC<EachOutputProps> = ({
  filter = "all",
  wardrobeItems = [],
  favorites = [],
}) => {
  const { t } = useTranslation();
  const { toggleLike, isTogglingLike } = useWardrobe();

  // Filter the wardrobeItems based on the filter prop
  const filteredOutfits = React.useMemo(() => {
    console.log("[EACH_OUTPUT] 🔍 Filtering outfits:");
    console.log("- filter:", filter);
    console.log("- wardrobeItems length:", wardrobeItems?.length || 0);
    console.log("- favorites length:", favorites?.length || 0);

    if (filter === "liked") {
      console.log("- returning favorites:", favorites?.length || 0);
      return favorites;
    }
    console.log("- returning wardrobeItems:", wardrobeItems?.length || 0);
    return wardrobeItems;
  }, [wardrobeItems, favorites, filter]);

  const toggleFavorite = async (tryOnId: string) => {
    try {
      await toggleLike(tryOnId);
    } catch (error) {
      console.error("Toggle like error:", error);
      Alert.alert(t("common.error"), t("wardrobePage.messages.likeError"));
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
              {filter === "liked"
                ? t("wardrobePage.messages.noFavorites")
                : t("wardrobePage.messages.noTryOns")}
            </Text>
          </View>
        ) : (
          filteredOutfits.map((wardrobeItem, index) => {
            console.log("[EACH_OUTPUT] 🎨 Rendering item:", {
              index,
              wardrobeItemId: wardrobeItem.id,
              tryOnId: wardrobeItem.try_on?.id,
              resultImage: wardrobeItem.try_on?.result_image,
              hasImage: !!wardrobeItem.try_on?.result_image,
            });

            const tryOn = wardrobeItem.try_on;
            if (!tryOn || !tryOn.result_image) {
              console.log(
                "[EACH_OUTPUT] ❌ Skipping item - missing tryOn or result_image"
              );
              return null;
            }

            console.log("[EACH_OUTPUT] 🏗️ About to render item:", tryOn.id);

            return (
              <View
                key={wardrobeItem.id}
                style={{
                  width: "100%",
                  marginVertical: 16,
                  backgroundColor: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity style={{ backgroundColor: "white" }}>
                  {/* Image Container */}
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{
                        uri: tryOn.result_image,
                      }}
                      style={{
                        width: "100%",
                        height: 384, // h-96 equivalent
                        backgroundColor: "#f3f4f6", // bg-gray-100 equivalent
                      }}
                      resizeMode="cover"
                      onLoad={() =>
                        console.log(
                          "[EACH_OUTPUT] ✅ Image loaded:",
                          tryOn.result_image
                        )
                      }
                      onError={(error) =>
                        console.log(
                          "[EACH_OUTPUT] ❌ Image error:",
                          error,
                          tryOn.result_image
                        )
                      }
                    />

                    {/* Favorite Heart */}
                    <AnimatedHeart
                      isLiked={wardrobeItem.liked}
                      onToggle={() => toggleFavorite(tryOn.id)}
                      disabled={isTogglingLike}
                      hapticType="medium"
                    />

                    {/* Processing Status Badge */}
                    {tryOn.processing_status && (
                      <View
                        className="absolute top-3 left-3 px-3 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            tryOn.processing_status === "completed"
                              ? "#10b98120"
                              : tryOn.processing_status === "processing"
                                ? "#f59e0b20"
                                : "#ef444420",
                        }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color:
                              tryOn.processing_status === "completed"
                                ? "#10b981"
                                : tryOn.processing_status === "processing"
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        >
                          {tryOn.processing_status === "completed"
                            ? t("wardrobePage.messages.completed")
                            : tryOn.processing_status === "processing"
                              ? t("wardrobePage.messages.processing")
                              : tryOn.processing_status}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <View className="p-4">
                    <AnimatedText
                      animation="slideUp"
                      delay={index * 150 + 200}
                      className="text-sm font-semibold text-gray-800 mb-3 leading-5"
                      numberOfLines={2}
                    >
                      {tryOn.dress_description ||
                        t("wardrobePage.messages.virtualTryOnResult")}
                    </AnimatedText>

                    {/* Bottom Actions */}
                    <View className="flex-row justify-between items-center">
                      <AnimatedView
                        animation="slideUp"
                        delay={index * 150 + 300}
                        className="flex-row items-center"
                      >
                        <Calendar size={12} color="#6b7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                          {formatDate(wardrobeItem.created_at)}
                        </Text>
                      </AnimatedView>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default EachOutput;
