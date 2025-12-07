import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import AnimatedView from "../ui/AnimatedView";
import { LogOut, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const CriticialButtons = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      t("profile.logoutTitle"),
      t("profile.logoutConfirm"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.logout"),
          style: "destructive",
          onPress: async () => {
            try {
              logout();
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
              router.replace("/(auth)/login");
            }
          },
        },
      ]
    );
  };

  const criticalActions = [
    {
      id: "logout",
      title: t("profile.logout"),
      subtitle: t("profile.logoutDesc"),
      icon: <LogOut color="#ef4444" size={22} />,
      action: handleLogout,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
    },
  ];

  return (
    <AnimatedView animation="slideUp">
      <View className="px-4 py-2">
        <Text className="text-gray-500 font-outfit text-sm mb-3 px-1">{t("profile.accountActions")}</Text>
        
        <View className="space-y-3">
          {criticalActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={action.action}
              className={`p-4 rounded-2xl border-[1px] my-2 ${action.borderColor} ${action.bgColor}`}
              activeOpacity={0.7}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className={`p-3 rounded-xl ${action.iconBg}`}>
                    {action.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="font-outfit-semibold text-base text-gray-900">
                      {action.title}
                    </Text>
                    <Text className="text-sm mt-0.5 font-outfit text-gray-700">
                      {action.subtitle}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AnimatedView>
  );
};

export default CriticialButtons;
