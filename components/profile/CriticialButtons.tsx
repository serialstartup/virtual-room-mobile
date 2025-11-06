import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import AnimatedView from "../ui/AnimatedView";
import { Key, LogOut, Trash2, AlertTriangle } from "lucide-react-native";

const CriticialButtons = () => {
  const handleForgotPassword = () => {
    Alert.alert(
      "Şifre Sıfırlama",
      "E-posta adresinize şifre sıfırlama bağlantısı gönderilsin mi?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Gönder",
          onPress: () => console.log("Password reset email sent"),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => console.log("User logged out"),
        },
      ]
    );
  };

  const criticalActions = [
    {
      id: "forgot-password",
      title: "Şifremi Unuttum",
      subtitle: "E-posta ile şifre sıfırlama",
      icon: <Key color="#6b7280" size={20} />,
      action: handleForgotPassword,
      variant: "secondary" as const,
    },
    {
      id: "logout",
      title: "Çıkış Yap",
      subtitle: "Hesabınızdan güvenli çıkış",
      icon: <LogOut color="#6b7280" size={20} />,
      action: handleLogout,
      variant: "secondary" as const,
    },
  ];

  return (
    <AnimatedView animation="slideUp">
      <View className="">
        {/* Critical Actions */}
        <View className="p-4">
          <View className="space-y-3">
            {criticalActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.action}
                className={`p-4 rounded-xl border my-2 ${"border-gray-200 bg-gray-50"} ${index === criticalActions.length - 1 ? "mb-0" : "mb-1"}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-3">
                  <View className={`p-2 rounded-full ${"bg-white"}`}>
                    {action.icon}
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-semibold text-base ${"text-gray-800"}`}
                    >
                      {action.title}
                    </Text>
                    <Text className={`text-sm mt-1 ${"text-gray-500"}`}>
                      {action.subtitle}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </AnimatedView>
  );
};

export default CriticialButtons;
