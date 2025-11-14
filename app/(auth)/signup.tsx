import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { PageWrapper } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";
import ReusableButton from "@/components/ui/ReusableButton";
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from "lucide-react-native";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate signup success
      Alert.alert("Başarılı!", "Hesabınız oluşturuldu", [
        { text: "Tamam", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error) {
      Alert.alert("Hata", "Hesap oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-virtual-primary/10 p-4 rounded-full mb-4">
            <Sparkles color="#ec4899" size={32} />
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Hesap Oluşturun
          </Text>
          <Text className="text-gray-500 text-center">
            Virtual Room`$apos;`` a katılın ve stilinizi keşfedin
          </Text>
        </View>

        {/* Signup Form */}
        <View className="flex-1">
          <View className="space-y-4 mb-6">

            {/* Email Input */}
            <View>
              <Input
                name="email"
                control={control}
                placeholder="E-posta adresinizi girin"
                label="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                rules={{
                  required: "E-posta alanı zorunludur",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Geçerli bir e-posta adresi girin"
                  }
                }}
                leftIcon={<Mail color="#6b7280" size={20} />}
              />
            </View>

            {/* Password Input */}
            <View>
              <Input
                name="password"
                control={control}
                placeholder="Şifrenizi girin"
                label="Şifre"
                secureTextEntry={!showPassword}
                error={errors.password}
                rules={{
                  required: "Şifre alanı zorunludur",
                  minLength: {
                    value: 6,
                    message: "Şifre en az 6 karakter olmalıdır"
                  }
                }}
                leftIcon={<Lock color="#6b7280" size={20} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff color="#6b7280" size={20} />
                    ) : (
                      <Eye color="#6b7280" size={20} />
                    )}
                  </TouchableOpacity>
                }
              />
            </View>
          </View>

          {/* Terms Agreement */}
          <View className="mb-6">
            <Text className="text-gray-500 text-center text-sm leading-5">
              Hesap oluşturarak{" "}
              <Text className="text-virtual-primary font-medium">
                Kullanım Koşulları
              </Text>{" "}
              ve{" "}
              <Text className="text-virtual-primary font-medium">
                Gizlilik Politikası
              </Text>
&apos;nı kabul etmiş olursunuz.
            </Text>
          </View>

          {/* Signup Button */}
          <ReusableButton
            title={isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
            onPress={handleSubmit(onSubmit)}
            variant="filled"
            bgColor="bg-virtual-primary"
            textColor="text-white"
            disabled={isLoading}
            buttonShadow={true}
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500">veya</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Signup */}
          <View className="space-y-3 my-4 gap-4">
            <ReusableButton
              bgColor="bg-blue-500"
              title="Google ile Kayıt Ol"
              onPress={() => {}}
              textColor="text-white"
            />
            <ReusableButton
              title="Apple ile Kayıt Ol"
              onPress={() => {}}
              bgColor="bg-black"
              textColor="text-white"
            />
          </View>
        </View>

        {/* Login Link */}
        <View className="items-center pb-4">
          <Text className="text-gray-500">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/(auth)/login"
              className="text-virtual-primary font-semibold"
            >
              Giriş Yapın
            </Link>
          </Text>
        </View>
      </View>
    </PageWrapper>
  );
};

export default Signup;
