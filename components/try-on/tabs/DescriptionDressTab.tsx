import React from "react";
import TitleSectionTab from "./TitleSectionTab";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";

type FormValues = {
  description: string;
};

const DescriptionDressTab = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      description: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    Alert.alert("Açıklama", `Tarif: ${data.description}`);
  };

  return (
    <TitleSectionTab title="Kıyafeti Tarif Et">
      <View className="p-2">
        <Input
          name="description"
          control={control}
          placeholder="Örnek: Kırmızı yaz elbisesi, mavi ceket.."
          multiline={true}
          numberOfLines={3}
          error={errors.description}
          autoCapitalize="sentences"
        />

      </View>
    </TitleSectionTab>
  );
};

export default DescriptionDressTab;
