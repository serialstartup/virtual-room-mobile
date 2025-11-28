import TitleSection from "../TitleSection";
import { Sparkles, ShoppingBag, Heart, Share2 } from "lucide-react-native";
import AnimatedView from "../ui/AnimatedView";
import { Text, View } from "react-native";
import { Colors } from "@/constants";
import { useTranslation } from "react-i18next";

const Benefits = () => {
  const { t } = useTranslation();

  const whyUs = [
    {
      id: 1,
      title: t("home.benefits.items.aiTryOn.title"),
      description: t("home.benefits.items.aiTryOn.description"),
      icon: <Sparkles color={Colors.mutedPink[900]} size={24} />,
    },
    {
      id: 2,
      title: t("home.benefits.items.ecommerce.title"),
      description: t("home.benefits.items.ecommerce.description"),
      icon: <ShoppingBag color={Colors.mutedPink[900]} size={24} />,
    },
    {
      id: 3,
      title: t("home.benefits.items.favorites.title"),
      description: t("home.benefits.items.favorites.description"),
      icon: <Heart color={Colors.mutedPink[900]} size={24} />,
    },
    {
      id: 4,
      title: t("home.benefits.items.share.title"),
      description: t("home.benefits.items.share.description"),
      icon: <Share2 color={Colors.mutedPink[900]} size={24} />,
    },
  ];

  return (
    <TitleSection
      subtitle={t("home.benefits.subtitle")}
      title={t("home.benefits.title")}
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
              <View className="bg-virtual-primary-light p-2 rounded-full ">
                {benefit.icon}
              </View>
              <Text className="text-base font-semibold mt-4">
                {benefit.title}
              </Text>
              <Text className="text-base text-virtual-text-muted-dark">
                {benefit.description}
              </Text>
            </View>
          </AnimatedView>
        );
      })}
    </TitleSection>
  );
};

export default Benefits;
