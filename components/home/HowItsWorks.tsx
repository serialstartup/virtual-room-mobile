import {
  Footprints,
  Shirt,
  ScanFace,
  Link,
  Smile,
  ToolCase,
} from "lucide-react-native";
import { View, Text } from "react-native";
import AnimatedView from "../ui/AnimatedView";
import { FlashList } from "@shopify/flash-list";
import GradientView from "../GradientView";
import TitleSection from "../TitleSection";
import { useTranslation } from "react-i18next";

const HowItsWorks = () => {
  const { t } = useTranslation();

  const howItWorksData = [
    {
      id: 1,
      title: t("home.howItWorks.steps.step1.title"),
      description: t("home.howItWorks.steps.step1.description"),
      icon: <Footprints color="pink" size={36} />,
    },
    {
      id: 2,
      title: t("home.howItWorks.steps.step2.title"),
      description: t("home.howItWorks.steps.step2.description"),
      icon: <Shirt color="pink" size={36} />,
    },
    {
      id: 3,
      title: t("home.howItWorks.steps.step3.title"),
      description: t("home.howItWorks.steps.step3.description"),
      icon: <ScanFace color="pink" size={36} />,
    },
    {
      id: 4,
      title: t("home.howItWorks.steps.step4.title"),
      description: t("home.howItWorks.steps.step4.description"),
      icon: <Link color="pink" size={36} />,
    },
    {
      id: 5,
      title: t("home.howItWorks.steps.step5.title"),
      description: t("home.howItWorks.steps.step5.description"),
      icon: <Smile color="pink" size={36} />,
    },
    {
      id: 6,
      title: t("home.howItWorks.steps.step6.title"),
      description: t("home.howItWorks.steps.step6.description"),
      icon: <ToolCase color="pink" size={36} />,
    },
  ];

  const renderItem = ({ item }) => (
    <View className="mr-4">
      <GradientView
        preset="custom"
        borderRadius={16}
        colors={["#000000", "#3B3B3B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <AnimatedView className="py-4 px-6 gap-4 rounded-lg shadow w-72 h-64">
          <Text className="text-xl font-bold mb-2 text-white">
            {item.title}
          </Text>
          <Text className="text-virtual-surface">{item.description}</Text>
          <Text className="mt-auto self-end text-xl text-virtual-primary-dark bg-virtual-primary-light rounded-full py-2 px-4 font-semibold">
            {item.id}
          </Text>
          {/* <Text className="bg-virtual-primary text-white font-semibold px-4 py-2 mt-3 rounded-full text-3xl self-center">
            {item.id}
          </Text> */}
        </AnimatedView>
      </GradientView>
    </View>
  );

  return (
    <TitleSection
      className="my-10"
      bgColor="bg-gray-100"
      subtitle={t("home.howItWorks.subtitle")}
      title={t("home.howItWorks.title")}
    >
      <AnimatedView
        className="h-72"
        animation="fadeIn"
        duration={600}
        easing="easeInOut"
      >
        <FlashList
          horizontal
          data={howItWorksData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </AnimatedView>
    </TitleSection>
  );
};

export default HowItsWorks;
