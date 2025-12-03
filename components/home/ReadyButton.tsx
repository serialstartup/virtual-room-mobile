import { View, Text } from "react-native";
import GradientView from "../GradientView";
import ReusableButton from "../ui/ReusableButton";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

const ReadyButton = () => {
  const { t } = useTranslation();
  const handleTryNow = () => {
    router.push("/(tabs)/try-on");
  };

  return (
    <View className="my-6">
      <GradientView
        preset="accent"
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View className="flex-col items-center justify-center py-8 px-10 gap-4">
          <Text className="text-center text-white font-semibold text-3xl">
            {t("home.readySection.title")}
          </Text>
          <Text className=" text-center text-white mb-6">
            {t("home.readySection.subtitle")}
          </Text>
          <ReusableButton
            textColor="text-virtual-primary-dark"
            padding="py-2 px-10"
            title={t("home.readySection.button")}
            buttonShadow={true}
            onPress={handleTryNow}
          />
        </View>
      </GradientView>
    </View>
  );
};

export default ReadyButton;
