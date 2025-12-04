import TitleSectionTab from "./TitleSectionTab";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";

type FormValues = {
  description: string;
};

interface DescriptionDressTabProps {
  onDescriptionChange: (description: string) => void;
  selectedDescription?: string;
}

const DescriptionDressTab: React.FC<DescriptionDressTabProps> = ({ onDescriptionChange, selectedDescription }) => {
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
        
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          className="bg-virtual-primary rounded-xl py-3 px-4 mt-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-outfit-semibold">Tarifi Kaydet</Text>
        </TouchableOpacity>
      </View>
    </TitleSectionTab>
  );
};

export default DescriptionDressTab;
