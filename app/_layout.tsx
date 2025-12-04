import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "@/global.css";
import "@/i18n";
// import Purchases from "react-native-purchases";
// import { Platform } from "react-native";
// import { analytics } from "@/services/analytics";
import { onboardingStorage } from "@/services/onboardingStorage";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OutfitRegular: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitSemiBold: Outfit_600SemiBold,
    OutfitBold: Outfit_700Bold,
  });

  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await onboardingStorage.hasCompletedOnboarding();
      setOnboardingComplete(completed);
    };
    checkOnboarding();
  }, []);

  // RevenueCat and Analytics will be configured in closed testing phase
  // For now, skip these integrations to avoid development noise
  
  // useEffect(() => {
  //   const initRevenueCat = async () => {
  //     try {
  //       const apiKey = Platform.select({
  //         ios: process.env.REVENUECAT_API_KEY_IOS,
  //         android: process.env.REVENUECAT_API_KEY_ANDROID,
  //       });

  //       if (apiKey) {
  //         await Purchases.configure({ apiKey });
  //         // Enable debug logs for development
  //         if (__DEV__) {
  //           await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("RevenueCat init error:", error);
  //     }
  //   };

  //   initRevenueCat();
  // }, []);

  // // Initialize analytics on mount
  // useEffect(() => {
  //   const initAnalytics = async () => {
  //     try {
  //       await analytics.initialize();
  //     } catch (error) {
  //       console.error("Analytics init error:", error);
  //     }
  //   };

  //   initAnalytics();
  // }, []);

  if (!fontsLoaded || onboardingComplete === null) {
    return null;
  }

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  // Show onboarding if not completed
  if (!onboardingComplete) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
