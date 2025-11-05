import React from "react";
import TitleSection from "../TitleSection";
import { Sparkles, ShoppingBag, Heart,Share2 } from "lucide-react-native";
import AnimatedView from "../ui/AnimatedView";
import { Text, View } from "react-native";
import { Colors } from "@/constants";
const whyUs = [
  {
    id: 1,
    title: "AI-Powered Try-On",
    description: "Experience virtual fitting with advanced AI technology.",
    icon: <Sparkles color={Colors.mutedPink[900]} size={24} />,
  },
  {
    id: 2,
    title: "E-commerce Integration",
    description:
      "Try on real products from your favorite stores and save them.",
    icon: <ShoppingBag color={Colors.mutedPink[900]} size={24} />,
  },
  {
    id: 3,
    title: "Save Your Favorites",
    description: "Build your personal wardrobe collection within the app.",
    icon: <Heart color={Colors.mutedPink[900]} size={24} />,
  },
    {
    id: 4,
    title: "Share & Discover",
    description: "Share your looks and find similar products, create combinations easily.",
    icon: <Share2 color={Colors.mutedPink[900]} size={24} />,
  },
];

const Benefits = () => {
  return (
    <TitleSection
      subtitle="Revolutionize your fashion shopping with cutting-edge AI technology"
      title="Why Choose Our App?"
    >
      {whyUs.map((benefit) => {
        return (
          <AnimatedView
            key={benefit.id}
            className="w-full px-4  border-[1px] border-virtual-primary-light my-4 p-6 rounded-lg flex-row items-center gap-4"
            animation="fadeIn"
            duration={600}
            easing="easeInOut"
          >
            <View className="flex-col items-start justify-start gap-1 ">
            <View className="bg-virtual-primary-light p-2 rounded-full ">{benefit.icon}</View>
              <Text className="text-base font-semibold mt-4">{benefit.title}</Text>
              <Text className="text-base text-virtual-text-muted-dark">{benefit.description}</Text>
            </View>
          </AnimatedView>
        );
      })}
    </TitleSection>
  );
};

export default Benefits;
