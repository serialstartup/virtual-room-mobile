import React from "react";
import TitleSectionTab from "./TitleSectionTab";
import { View } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";

type FormValues = {
  productURL: string;
};
const ProductDressTab = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      productURL: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Product URL:", data.productURL);
  };

  return (
    <TitleSectionTab title="Ürün URL Yapıştır">
      <View className="p-2">
        <Input
          name="description"
          control={control}
          placeholder="https:johndoe.com/ürün/kıyafet"
          numberOfLines={1}
          error={errors.productURL}
        />
      </View>
    </TitleSectionTab>
  );
};

export default ProductDressTab;
