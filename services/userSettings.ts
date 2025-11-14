import { apiClient } from '@/services/api';
import { UserSettings } from '@/types/database';

export interface UpdateUserSettingsRequest {
  push_notifications?: boolean;
  email_notifications?: boolean;
  new_features?: boolean;
  language?: string;
}

export interface NotificationSettings {
  push_notifications: boolean;
  email_notifications: boolean;
  new_features: boolean;
}

class UserSettingsService {
  async getUserSettings(): Promise<UserSettings> {
    const response = await apiClient.get<{ data: UserSettings }>('/user/settings');
    return response.data;
  }

  async updateUserSettings(updates: UpdateUserSettingsRequest): Promise<UserSettings> {
    const response = await apiClient.put<{ data: UserSettings }>('/user/settings', updates);
    return response.data;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await apiClient.get<{ data: UserSettings }>('/user/settings');
    return {
      push_notifications: response.data.push_notifications,
      email_notifications: response.data.email_notifications,
      new_features: response.data.new_features,
    };
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await apiClient.put<{ data: UserSettings }>('/user/settings', settings);
    return {
      push_notifications: response.data.push_notifications,
      email_notifications: response.data.email_notifications,
      new_features: response.data.new_features,
    };
  }
}

export const userSettingsService = new UserSettingsService();