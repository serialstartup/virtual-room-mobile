import TitleSectionTab from "./TitleSectionTab";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";
import { useTranslation } from "react-i18next";

type FormValues = {
  description: string;
};

interface DescriptionDressTabProps {
  onDescriptionChange: (description: string) => void;
  selectedDescription?: string;
}

const DescriptionDressTab: React.FC<DescriptionDressTabProps> = ({ onDescriptionChange, selectedDescription }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      description: selectedDescription || "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onDescriptionChange(data.description);
    Alert.alert(t("tryOnTabs.description"), `${t("tryOn.placeholders.describeDress")}: ${data.description}`);
  };

  return (
    <TitleSectionTab title={t("tryOnTabs.description")}>
      <View className="p-2">
        <Input
          name="description"
          control={control}
          placeholder={t("placeholders.clothingDescription")}
          multiline={true}
          numberOfLines={3}
          error={errors.description}
          autoCapitalize="sentences"
        />
        
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          className="bg-virtual-primary rounded-xl py-3 px-4 mt-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-outfit-semibold">{t("tryOnTabs.saveDescription")}</Text>
        </TouchableOpacity>
      </View>
    </TitleSectionTab>
  );
};

export default DescriptionDressTab;
