import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";
import ReusableButton from "../ui/ReusableButton";
import { Crown, Smile, Pencil, User } from "lucide-react-native";

type FormValues = {
  name: string;
  email: string;
};

interface ProfileSettingsProps {
  premium?: boolean;
}

const ProfileSettings = ({ premium = false }: ProfileSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "Hakan Çoban",
      email: "hakan@gmail.com",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Profile updated:", data);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      reset();
    }
  };

  return (
    <AnimatedView
      animation="slideUp"
      className="bg-gray-100 border border-gray-100 rounded-2xl  overflow-hidden"
    >
      {/* Header Section */}
      <View className="bg-gray-50 px-6 py-8 border-b border-gray-100">
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
              <User color="black" size={28} />
            </View>
            <View>
              <Text className="text-gray-800 text-xl font-bold">
                Hakan Çoban
              </Text>
              <Text className="text-gray-500 text-sm">hakan@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity className="mt-1" onPress={handleEdit}>
            {isEditing ? (
              <View className="border-[1px] py-2 px-4 border-gray-300 rounded-xl">
                <Text className="text-sm text-black">Cancel</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-2 border-[1px] py-2 px-4 border-gray-300 rounded-xl">
                <Pencil color="black" size={14} />
                <Text className="text-sm">Edit</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Section */}
      <View className="bg-gray-50 p-6">
        {isEditing ? (
          <View className="space-y-4">
            <View>
              <Input
                name="name"
                control={control}
                placeholder="Adınızı girin"
                numberOfLines={1}
                label="Ad Soyad"
                error={errors.name}
              />
            </View>
            <View>
              <Input
                name="email"
                control={control}
                placeholder="E-posta değiştirilemiyor"
                numberOfLines={1}
                label="E-posta"
                editable={false}
                error={errors.email}
              />
            </View>

            <View className="flex-row gap-3 mt-6">
              <View className="flex-1">
                <ReusableButton
                  title="Kaydet"
                  onPress={handleSubmit(onSubmit)}
                  variant="filled"
                  bgColor="bg-virtual-primary"
                  textColor="text-white"
                />
              </View>
              <View className="flex-1">
                <ReusableButton
                  title="İptal"
                  onPress={handleEdit}
                  variant="outlined"
                  borderColor="border-virtual-primary"
                  textColor="text-gray-700"
                />
              </View>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            <View className="mb-4">
              <Text className="text-gray-500 text-sm mb-1">Ad Soyad</Text>
              <Text className="text-gray-800 text-base font-medium">
                Hakan Çoban
              </Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm mb-1">E-posta</Text>
              <Text className="text-gray-800 text-base font-medium">
                hakan@gmail.com
              </Text>
            </View>
          </View>
        )}

        {/* Plan Section */}
        <View className="mt-6 pt-6 border-t border-gray-200">
          <Text className="text-gray-500 text-sm mb-3">Mevcut Plan</Text>
          <View className="bg-gray-50 rounded-xl py-4 px-3 border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 ">
                <View
                  className={`p-2 rounded-full border-2 ${
                    premium
                      ? "bg-gray-800 border-virtual-primary"
                      : "bg-gray-400 border-gray-300"
                  }`}
                >
                  {premium ? (
                    <Crown color="white" size={20} />
                  ) : (
                    <Smile color="white" size={20} />
                  )}
                </View>
                <View>
                  <Text className="text-gray-800 font-semibold text-base">
                    {premium ? "Premium Plan" : "Ücretsiz Plan"}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {premium ? "Tüm özelliklere erişim" : "Sınırlı özellikler"}
                  </Text>
                </View>
              </View>
              {!premium && (
                <TouchableOpacity className="bg-virtual-primary px-6 py-2 rounded-lg">
                  <Text className="text-white font-semibold text-sm">
                    Yükselt
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </AnimatedView>
  );
};

export default ProfileSettings;
