import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";
import ReusableButton from "../ui/ReusableButton";
import { Crown, Smile, Pencil, User } from "lucide-react-native";
import { useUser } from "@/hooks/useUser";

type FormValues = {
  name: string;
  email: string;
};

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { 
    user, 
    updateProfile, 
    isUpdateUserLoading, 
    isUserLoading 
  } = useUser();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await updateProfile({ name: data.name });
      setIsEditing(false);
      Alert.alert("Başarılı", "Profiliniz güncellendi");
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Hata", "Profil güncellenirken bir hata oluştu");
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      if (user) {
        setValue('name', user.name);
        setValue('email', user.email);
      }
    }
  };

  if (isUserLoading) {
    return (
      <AnimatedView animation="slideUp" className="bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
        <View className="bg-gray-50 px-6 py-8 border-b border-gray-100">
          <Text className="text-gray-500 text-center">Profil bilgileri yükleniyor...</Text>
        </View>
      </AnimatedView>
    );
  }

  if (!user) {
    return (
      <AnimatedView animation="slideUp" className="bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
        <View className="bg-gray-50 px-6 py-8 border-b border-gray-100">
          <Text className="text-red-500 text-center">Profil bilgileri yüklenemedi</Text>
        </View>
      </AnimatedView>
    );
  }

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
                {user.name}
              </Text>
              <Text className="text-gray-500 text-sm">{user.email}</Text>
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
                  title={isUpdateUserLoading ? "Kaydediliyor..." : "Kaydet"}
                  onPress={handleSubmit(onSubmit)}
                  variant="filled"
                  bgColor="bg-virtual-primary"
                  textColor="text-white"
                  disabled={isUpdateUserLoading}
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
                {user.name}
              </Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm mb-1">E-posta</Text>
              <Text className="text-gray-800 text-base font-medium">
                {user.email}
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
                    user.premium_status
                      ? "bg-gray-800 border-virtual-primary"
                      : "bg-gray-400 border-gray-300"
                  }`}
                >
                  {user.premium_status ? (
                    <Crown color="white" size={20} />
                  ) : (
                    <Smile color="white" size={20} />
                  )}
                </View>
                <View>
                  <Text className="text-gray-800 font-semibold text-base">
                    {user.premium_status ? "Premium Plan" : "Ücretsiz Plan"}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {user.premium_status ? "Tüm özelliklere erişim" : "Sınırlı özellikler"}
                  </Text>
                </View>
              </View>
              {!user.premium_status && (
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
