import { apiClient, AuthResponse, ApiResponse } from "./api";
import { User } from "@/types/database";
import { analytics } from "./analytics";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserRequest {
  name: string;
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse["data"]> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      if (!response.success || !response.data) {
        console.error("[AUTH_SERVICE] ❌ Login failed:", response.error);
        throw new Error(response.error || "Login failed");
      }

      // Track successful login
      analytics.trackLogin("email");
      analytics.setUserId(response.data.user.id);

      return response.data;
    } catch (error) {
      console.error("[AUTH_SERVICE] 🚨 Login error:", error);
      throw error;
    }
  }

  // Signup
  async signup(credentials: SignupCredentials): Promise<AuthResponse["data"]> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/signup",
      credentials
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Signup failed");
    }

    // Track successful signup
    analytics.trackSignUp("email");
    analytics.setUserId(response.data.user.id);

    return response.data;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.get("/auth/logout");
    } catch (error) {
      // Continue with local logout even if server logout fails
      console.warn(
        "[AUTH_SERVICE] ⚠️ Server logout failed, continuing with local logout:",
        error
      );
    }

    // Track logout
    analytics.trackLogout();

    // Note: Store logout will be handled by the useAuth hook to avoid circular dependency
  }

  // Get current user (me endpoint)
  async getCurrentUser(): Promise<User> {
    try {
      const response =
        await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");

      if (!response.success || !response.data) {
        console.error(
          "[AUTH_SERVICE] ❌ Failed to get current user:",
          response.error
        );
        throw new Error(response.error || "Failed to get user");
      }

      return response.data.user;
    } catch (error) {
      console.error("[AUTH_SERVICE] 🚨 Get current user error:", error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(
    userId: string,
    updates: UpdateUserRequest
  ): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      "/auth/user",
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Failed to update profile");
    }

    return response.data.user;
  }

  // Delete user account
  async deleteAccount(userId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse>("/auth/user");

    if (!response.success) {
      throw new Error(response.error || "Failed to delete account");
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      `/auth/user/${userId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "User not found");
    }

    return response.data.user;
  }

  // Reset password (placeholder for future implementation)
  async resetPassword(email: string): Promise<void> {
    throw new Error("Reset password not implemented yet");
  }
}

export const authService = new AuthService();
