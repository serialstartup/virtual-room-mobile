import { apiClient, ApiResponse } from "./api";
import { User, UserSettings } from "@/types/database";

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UpdateUserSettingsRequest {
  push_notifications?: boolean;
  email_notifications?: boolean;
  new_features?: boolean;
  language?: string;
}

class UserService {
  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response =
      await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get current user");
    }

    return response.data.user;
  }

  // Get all users (admin function)
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>("/user/all");

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get all users");
    }

    return response.data;
  }

  // Update user profile
  async updateUser(updates: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      "/user/update",
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to update user");
    }

    return response.data.user;
  }

  // Delete user account
  async deleteUser(): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>("/user/delete");

    if (!response.success) {
      throw new Error(response.error || "Failed to delete user");
    }
  }

  // Get user settings
  async getUserSettings(): Promise<UserSettings> {
    const response =
      await apiClient.get<ApiResponse<{ settings: UserSettings }>>(
        "/user/settings"
      );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get user settings");
    }

    return response.data.settings;
  }

  // Update user settings
  async updateUserSettings(
    updates: UpdateUserSettingsRequest
  ): Promise<UserSettings> {
    const response = await apiClient.put<
      ApiResponse<{ settings: UserSettings }>
    >("/user/settings", updates);

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to update user settings");
    }

    return response.data.settings;
  }

  // Get notification settings
  async getNotificationSettings(): Promise<
    Pick<
      UserSettings,
      "push_notifications" | "email_notifications" | "new_features"
    >
  > {
    const response = await apiClient.get<
      ApiResponse<{
        notifications: Pick<
          UserSettings,
          "push_notifications" | "email_notifications" | "new_features"
        >;
      }>
    >("/user/settings/notifications");

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get notification settings");
    }

    return response.data.notifications;
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      `/user/${userId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to get user");
    }

    return response.data.user;
  }
  // Verify purchase
  async verifyPurchase(
    appUserId: string,
    platform: string,
    productId: string,
    transactionId: string
  ): Promise<void> {
    const response = await apiClient.post<ApiResponse<any>>(
      "/purchases/verify",
      {
        appUserId,
        platform,
        productId,
        transactionId,
      }
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to verify purchase");
    }
  }
}

export const userService = new UserService();
