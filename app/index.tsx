import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token, user } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      // Navigation sisteminin hazır olması için kısa bir bekleme
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {

        // Token ve kullanıcı bilgisi varsa tabs'a yönlendir
        if (isAuthenticated && token && user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Auth check error: ", error);
        // Hata durumunda login'e yönlendir
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, isAuthenticated, token, user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="mt-4 font-outfit text-gray-600">Checking authentication...</Text>
      </View>
    );
  }

  return null;
}
