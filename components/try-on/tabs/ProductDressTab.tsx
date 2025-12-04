import TitleSectionTab from "./TitleSectionTab";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";

type FormValues = {
  productURL: string;
};

interface ProductDressTabProps {
  onImageSelect: (imageUrl: string, description?: string) => void;
  selectedImage?: string;
}

const ProductDressTab: React.FC<ProductDressTabProps> = ({ onImageSelect, selectedImage }) => {
  const {
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      productURL: selectedImage || "",
    },
  });


  return (
    <TitleSectionTab title="Ürün URL Yapıştır">
      <View className="p-2">
        <Input
          name="productURL"
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
