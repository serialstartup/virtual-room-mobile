import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { PageWrapper } from "@/components";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/InputHook";
import ReusableButton from "@/components/ui/ReusableButton";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const password = watch("password");

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);
    try {
      // Import authService dynamically to avoid circular imports
      const { authService } = await import("@/services/auth");
      
      const signupData = {
        email: data.email,
        password: data.password,
        name: data.name || undefined,
      };

      const response = await authService.signup(signupData);

      if (response.user) {
        Alert.alert(t("signup.success.title"), t("signup.success.message"), [
          {
            text: t("signup.success.button"),
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        t("signup.errors.defaultError"),
        error.message || t("signup.errors.createError"),
        [{ text: t("common.ok") }]
      );
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
          <Text className="text-3xl font-outfit-semibold text-gray-800 mb-2">
            {t("signup.title")}
          </Text>
          <Text className="text-gray-500 font-outfit text-center">
            {t("signup.subtitle")}
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
                placeholder={t("signup.emailPlaceholder")}
                label={t("auth.email")}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                rules={{
                  required: t("signup.errors.emailRequired"),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t("signup.errors.emailInvalid"),
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
                placeholder={t("signup.passwordPlaceholder")}
                label={t("auth.password")}
                secureTextEntry={!showPassword}
                error={errors.password}
                rules={{
                  required: t("signup.errors.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("signup.errors.passwordMinLength"),
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

          {/* Terms Agreement */}
          <View className="mb-6">
            <Text className="text-gray-500 text-center font-outfit text-sm leading-5">
              {t("signup.termsText")}{" "}
              <Text className="text-virtual-primary font-outfit-medium">
                {t("signup.termsLink")}
              </Text>{" "}
              {t("signup.and")}{" "}
              <Text className="text-virtual-primary font-outfit-medium">
                {t("signup.privacyLink")}
              </Text>
              {t("signup.privacyEnd")}
            </Text>
          </View>

          {/* Signup Button */}
          <ReusableButton
            title={
              isLoading
                ? t("signup.createAccountButtonLoading")
                : t("signup.createAccountButton")
            }
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
            <Text className="mx-4 text-gray-500 font-outfit">{t("signup.or")}</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Social Signup */}
          <View className="space-y-3 my-4 gap-4">
            <ReusableButton
              bgColor="bg-blue-500"
              title={t("signup.withGoogle")}
              onPress={() => {}}
              textColor="text-white"
            />
            <ReusableButton
              title={t("signup.withApple")}
              onPress={() => {}}
              bgColor="bg-black"
              textColor="text-white"
            />
          </View>
        </View>

        {/* Login Link */}
        <View className="items-center pb-4">
          <Text className="font-outfit text-gray-500">
            {t("signup.hasAccount")}{" "}
            <Link
              href="/(auth)/login"
              className="text-virtual-primary font-semibold"
            >
              {t("signup.loginLink")}
            </Link>
          </Text>
        </View>
      </View>
    </PageWrapper>
  );
};

export default Signup;
