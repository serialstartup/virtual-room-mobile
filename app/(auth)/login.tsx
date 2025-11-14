import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { PageWrapper } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";
import ReusableButton from "@/components/ui/ReusableButton";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginLoading, loginError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    
    try {
      // Call real authentication service
      await login({
        email: data.email,
        password: data.password,
      });

      Alert.alert("Başarılı!", "Giriş yapıldı", [
        { text: "Tamam", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error: any) {
      console.error("Login form error:", error);
      const errorMessage = error?.message || "Giriş yapılırken bir hata oluştu";
      Alert.alert("Hata", errorMessage);
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
            Hoş Geldiniz
          </Text>
          <Text className="text-gray-500 text-center">
            Hesabınıza giriş yapın ve stilinizi keşfedin
          </Text>
        </View>

        {/* Login Form */}
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
                    message: "Geçerli bir e-posta adresi girin",
                  },
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
                    message: "Şifre en az 6 karakter olmalıdır",
                  },
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

          {/* Error Message */}
          {loginError && (
            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text className="text-red-600 text-sm">
                {loginError.message || "Giriş yapılırken bir hata oluştu"}
              </Text>
            </View>
          )}

          {/* Forgot Password */}
          <TouchableOpacity className="mb-6">
            <Text className="text-virtual-primary text-right font-medium">
              Şifremi Unuttum
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <ReusableButton
            title={isLoginLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            onPress={handleSubmit(onSubmit)}
            variant="filled"
            bgColor="bg-virtual-primary"
            textColor="text-white"
            disabled={isLoginLoading}
            buttonShadow={true}
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500">veya</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Login */}
          <View className="space-y-3 my-4 gap-4">
            <ReusableButton
              bgColor="bg-blue-500"
              title="Google ile Giriş Yap"
              onPress={() => {}}
              textColor="text-white"
            />
            <ReusableButton
              title="Apple ile Giriş Yap"
              onPress={() => {}}
              bgColor="bg-black"
              textColor="text-white"
            />
          </View>
        </View>

        {/* Sign Up Link */}
        <View className="items-center pb-4">
          <Text className="text-gray-500">
            Hesabınız yok mu?{" "}
            <Link
              href="/(auth)/signup"
              className="text-virtual-primary font-semibold"
            >
              Kayıt Olun
            </Link>
          </Text>
        </View>
      </View>
    </PageWrapper>
  );
};

export default Login;
