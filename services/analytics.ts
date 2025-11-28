import {
  init,
  track,
  setUserId,
  identify,
} from "@amplitude/analytics-react-native";
class AnalyticsService {
  private initialized = false;

  async initialize(userId?: string) {
    if (this.initialized) return;

    const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;
    if (!apiKey) {
      console.warn("[ANALYTICS] Amplitude API key not found");
      this.initialized = true; // Set as initialized to prevent errors
      return;
    }

    try {
      init(apiKey, userId, {
        serverZone: "EU",
        disableCookies: true,
      });
      console.log("[ANALYTICS] Initialized");
      this.initialized = true;
    } catch (error) {
      console.error("[ANALYTICS] Init failed", error);
      this.initialized = true;
    }
  }

  setUserId(userId: string) {
    if (!this.initialized) return;
    try {
      setUserId(userId);
    } catch (error) {
      console.error("[ANALYTICS] Error setting user ID:", error);
    }
  }

  // Auth Events
  trackSignUp(method: "email" | "google" | "apple") {
    this.safeTrack("Sign Up", { method });
  }

  trackLogin(method: "email" | "google" | "apple") {
    this.safeTrack("Login", { method });
  }

  trackLogout() {
    this.safeTrack("Logout");
  }

  // Try-On Events
  trackTryOnStarted(
    type: "classic" | "product_to_model" | "text_to_fashion" | "avatar"
  ) {
    track("Try-On Started", { type });
  }

  trackTryOnCompleted(
    type: string,
    tokensUsed: number,
    processingTime?: number
  ) {
    track("Try-On Completed", {
      type,
      tokensUsed,
      processingTime,
    });
  }

  trackTryOnFailed(type: string, error: string) {
    track("Try-On Failed", { type, error });
  }

  // Purchase Events
  trackPurchaseInitiated(packageId: string, price: number) {
    track("Purchase Initiated", { packageId, price });
  }

  trackPurchaseCompleted(packageId: string, tokens: number, price: number) {
    track("Purchase Completed", {
      packageId,
      tokens,
      price,
      revenue: price,
    });
  }

  trackPurchaseFailed(packageId: string, error: string) {
    track("Purchase Failed", { packageId, error });
  }

  // Wardrobe Events
  trackWardrobeItemAdded(itemType: "garment" | "model") {
    track("Wardrobe Item Added", { itemType });
  }

  trackWardrobeItemDeleted(itemType: "garment" | "model") {
    track("Wardrobe Item Deleted", { itemType });
  }

  // Avatar Events
  trackAvatarCreated(source: "upload" | "camera") {
    track("Avatar Created", { source });
  }

  // Profile Events
  trackProfileUpdated(fields: string[]) {
    track("Profile Updated", { fields });
  }

  // Usage Tracking Events
  trackProductToModelStarted(productId?: string) {
    track("product_to_model_started", { productId });
  }

  trackProductToModelCompleted(productId?: string, processingTime?: number) {
    track("product_to_model_completed", {
      productId,
      processingTime,
    });
  }

  trackAvatarModelGeneration(source: "upload" | "camera") {
    track("avatar_model_generation", { source });
  }

  trackVideoTryOnStarted(videoId?: string) {
    track("video_tryon_started", { videoId });
  }

  trackVideoTryOnCompleted(videoId?: string, processingTime?: number) {
    track("video_tryon_completed", { videoId, processingTime });
  }

  // Token & Premium Events
  trackCreditUsed(amount: number, type: string) {
    track("credit_used", { amount, type });
  }

  trackOutOfCredits(attemptedAction: string) {
    track("out_of_credits", { attemptedAction });
  }

  trackUpgradeClicked(source: string) {
    track("upgrade_clicked", { source });
  }

  trackUpgradeSuccess(packageId: string, amount: number) {
    track("upgrade_success", { packageId, amount });
  }

  trackUpgradeCancelled(packageId?: string, reason?: string) {
    track("upgrade_cancelled", { packageId, reason });
  }

  // Sharing Events
  trackShareImageClicked(imageId?: string, platform?: string) {
    track("share_image_clicked", { imageId, platform });
  }

  trackShareVideoClicked(videoId?: string, platform?: string) {
    track("share_video_clicked", { videoId, platform });
  }

  // Onboarding Events
  trackOnboardingStarted() {
    this.safeTrack("onboarding_started");
  }

  trackOnboardingCompleted() {
    this.safeTrack("onboarding_completed");
  }

  trackOnboardingSkipped(slideIndex: number) {
    this.safeTrack("onboarding_skipped", { slideIndex });
  }

  trackOnboardingSlideViewed(slideIndex: number, slideName: string) {
    this.safeTrack("onboarding_slide_viewed", { slideIndex, slideName });
  }

  // Generic Event
  track(event: string, props?: Record<string, any>) {
    if (!this.initialized) return;
    try {
      track(event, props);
    } catch (err) {
      console.error("[ANALYTICS] track error", err);
    }
  }

  // Safe wrapper for all tracking methods
  private safeTrack(eventName: string, properties?: Record<string, any>) {
    this.track(eventName, properties);
  }
}

export const analytics = new AnalyticsService();
