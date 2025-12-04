import { View, Text, TouchableOpacity, Alert } from "react-native";
import AnimatedView from "../ui/AnimatedView";
import { LogOut, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const CriticialButtons = () => {
  const router = useRouter();
  const { logout } = useAuth();
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
          onPress: async () => {
            try {
              logout();
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
              // Even if logout fails, redirect to login
              router.replace("/(auth)/login");
            }
          },
        },
      ]
    );
  };

  const criticalActions = [
    // {
    //   id: "forgot-password",
    //   title: "Şifremi Unuttum",
    //   subtitle: "E-posta ile şifre sıfırlama",
    //   icon: <Key color="#ffffffff" size={22} />,
    //   action: handleForgotPassword,
    //   bgColor: "bg-white",
    //   borderColor: "border-blue-200",
    //   iconBg: "bg-blue-300",
    // },
    {
      id: "logout",
      title: "Çıkış Yap",
      subtitle: "Hesabınızdan güvenli çıkış",
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
        <Text className="text-gray-500 font-outfit text-sm mb-3 px-1">Hesap İşlemleri</Text>
        
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
