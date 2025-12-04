import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import WorkflowShowcaseSection from "./WorkflowShowcaseSection";
import TitleSection from "../TitleSection";

const HowItsWorks = () => {
  const { t } = useTranslation();

  // Workflow-specific accent colors (simplified from gradients)
  const colors = {
    classic: "#ec4899", // Pink
    avatar: "#a855f7", // Purple
    productToModel: "#3b82f6", // Blue
    textToFashion: "#10b981", // Green
  };

  // Classic Try-On workflow steps
  const classicSteps = [
    {
      id: 1,
      title: t("home.workflowShowcase.classic.steps.step1.title"),
      description: t("home.workflowShowcase.classic.steps.step1.description"),
      image: require("@/assets/images/home-try-on-model.jpeg"),
      badge: t("home.workflowShowcase.classic.steps.step1.badge"),
    },
    {
      id: 2,
      title: t("home.workflowShowcase.classic.steps.step2.title"),
      description: t("home.workflowShowcase.classic.steps.step2.description"),
      image: require("@/assets/images/home-try-on-garment.jpeg"),
      badge: t("home.workflowShowcase.classic.steps.step2.badge"),
    },
    {
      id: 3,
      title: t("home.workflowShowcase.classic.steps.step3.title"),
      description: t("home.workflowShowcase.classic.steps.step3.description"),
      image: require("@/assets/images/ai-working.jpg"),
      badge: t("home.workflowShowcase.classic.steps.step3.badge"),
    },
    {
      id: 4,
      title: t("home.workflowShowcase.classic.steps.step4.title"),
      description: t("home.workflowShowcase.classic.steps.step4.description"),
      image: require("@/assets/images/home-try-on-output.png"),
      badge: t("home.workflowShowcase.classic.steps.step4.badge"),
    },
  ];

  // Avatar Try-On workflow steps
  const avatarSteps = [
    {
      id: 1,
      title: t("home.workflowShowcase.avatar.steps.step1.title"),
      description: t("home.workflowShowcase.avatar.steps.step1.description"),
      image: require("@/assets/images/home-face-model-input.png"),
      badge: t("home.workflowShowcase.avatar.steps.step1.badge"),
    },
    {
      id: 2,
      title: t("home.workflowShowcase.avatar.steps.step2.title"),
      description: t("home.workflowShowcase.avatar.steps.step2.description"),
      image: require("@/assets/images/ai-working.jpg"),
      badge: t("home.workflowShowcase.avatar.steps.step2.badge"),
    },
    {
      id: 3,
      title: t("home.workflowShowcase.avatar.steps.step3.title"),
      description: t("home.workflowShowcase.avatar.steps.step3.description"),
      image: require("@/assets/images/home-face-model-output.jpeg"),
      badge: t("home.workflowShowcase.avatar.steps.step3.badge"),
    },
  ];

  // Product to Model workflow steps
  const productToModelSteps = [
    {
      id: 1,
      title: t("home.workflowShowcase.productToModel.steps.step1.title"),
      description: t(
        "home.workflowShowcase.productToModel.steps.step1.description"
      ),
      image: require("@/assets/images/home-product-model-product.png"),
      badge: t("home.workflowShowcase.productToModel.steps.step1.badge"),
    },
    {
      id: 2,
      title: t("home.workflowShowcase.productToModel.steps.step2.title"),
      description: t(
        "home.workflowShowcase.productToModel.steps.step2.description"
      ),
      image: require("@/assets/images/ai-working.jpg"),
      badge: t("home.workflowShowcase.productToModel.steps.step2.badge"),
    },
    {
      id: 3,
      title: t("home.workflowShowcase.productToModel.steps.step3.title"),
      description: t(
        "home.workflowShowcase.productToModel.steps.step3.description"
      ),
      image: require("@/assets/images/home-product-model-output.png"),
      badge: t("home.workflowShowcase.productToModel.steps.step3.badge"),
    },
  ];

  // Text to Fashion workflow steps
  const textToFashionSteps = [
    {
      id: 1,
      title: t("home.workflowShowcase.textToFashion.steps.step1.title"),
      description: t(
        "home.workflowShowcase.textToFashion.steps.step1.description"
      ),
      text: "Bir film galasına katılan kadın ünlü, uzun sarı saçlar,siyah yırtmaçlı bir elbise,halka tokala, birtane gümüş yüzük, Kameralar karşısında poz veriyor",
      badge: t("home.workflowShowcase.textToFashion.steps.step1.badge"),
    },
    {
      id: 2,
      title: t("home.workflowShowcase.textToFashion.steps.step2.title"),
      description: t(
        "home.workflowShowcase.textToFashion.steps.step2.description"
      ),
      image: require("@/assets/images/ai-working.jpg"),
      badge: t("home.workflowShowcase.textToFashion.steps.step2.badge"),
    },
    {
      id: 3,
      title: t("home.workflowShowcase.textToFashion.steps.step3.title"),
      description: t(
        "home.workflowShowcase.textToFashion.steps.step3.description"
      ),
      image: require("@/assets/images/home-text-to-model-output.jpeg"),
      badge: t("home.workflowShowcase.textToFashion.steps.step3.badge"),
    },
  ];

  return (
    <View className="bg-gray-50 py-10">
      {/* Main Header */}

      <TitleSection
        subtitle={t("home.workflowShowcase.sectionSubtitle")}
        title={t("home.workflowShowcase.sectionTitle")}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Classic Try-On Section */}
          <WorkflowShowcaseSection
            title={t("home.workflowShowcase.classic.title")}
            subtitle={t("home.workflowShowcase.classic.subtitle")}
            steps={classicSteps}
            accentColor={colors.classic}
          />

          {/* Avatar Try-On Section */}
          <WorkflowShowcaseSection
            title={t("home.workflowShowcase.avatar.title")}
            subtitle={t("home.workflowShowcase.avatar.subtitle")}
            steps={avatarSteps}
            accentColor={colors.classic}
          />

          {/* Product to Model Section */}
          <WorkflowShowcaseSection
            title={t("home.workflowShowcase.productToModel.title")}
            subtitle={t("home.workflowShowcase.productToModel.subtitle")}
            steps={productToModelSteps}
            accentColor={colors.classic}
          />

          {/* Text to Fashion Section */}
          <WorkflowShowcaseSection
            title={t("home.workflowShowcase.textToFashion.title")}
            subtitle={t("home.workflowShowcase.textToFashion.subtitle")}
            steps={textToFashionSteps}
            accentColor={colors.classic}
          />
        </ScrollView>
      </TitleSection>
    </View>
  );
};

export default HowItsWorks;
