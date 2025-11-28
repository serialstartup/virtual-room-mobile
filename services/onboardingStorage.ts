import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "@virtual_room_onboarding_completed" as const;

export interface OnboardingStorageInterface {
  hasCompletedOnboarding(): Promise<boolean>;
  markOnboardingComplete(): Promise<void>;
  resetOnboarding(): Promise<void>;
}

class OnboardingStorage implements OnboardingStorageInterface {
  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === "true";
    } catch (error) {
      console.error("[ONBOARDING] Error checking onboarding status:", error);
      // On error, assume onboarding not completed to show it again
      return false;
    }
  }

  /**
   * Mark onboarding as completed
   */
  async markOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      console.log("[ONBOARDING] ✅ Onboarding marked as complete");
    } catch (error) {
      console.error("[ONBOARDING] Error marking onboarding complete:", error);
      // Don't throw error - allow app to continue even if storage fails
      // The user experience is more important than perfect storage
    }
  }

  /**
   * Reset onboarding status (for testing/debugging)
   */
  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      console.log("[ONBOARDING] 🔄 Onboarding reset");
    } catch (error) {
      console.error("[ONBOARDING] Error resetting onboarding:", error);
      // Don't throw error for reset operation
    }
  }
}

export const onboardingStorage = new OnboardingStorage();
