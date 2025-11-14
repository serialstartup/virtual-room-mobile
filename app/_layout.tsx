import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {QueryProvider} from '@/providers/QueryProvider'
import "@/global.css";



export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
