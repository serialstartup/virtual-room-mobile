import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Navigation sisteminin hazır olması için kısa bir bekleme
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        console.log("Token var simülasyonu..");
        router.replace("/(tabs)");
      } catch (error) {
        console.log("Auth error: ", error);
        router.replace("/(tabs)"); // "/" yerine doğru route'a yönlendir
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
