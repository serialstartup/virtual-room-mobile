import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  userService,
  UpdateUserRequest,
  UpdateUserSettingsRequest,
} from "@/services/user";
import { User, UserSettings } from "@/types/database";

export const useUser = () => {
  const queryClient = useQueryClient();
  const {
    user: authUser,
    isAuthenticated,
    updateUser: updateAuthUser,
  } = useAuthStore();

  // Get current user profile
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: userService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialData: authUser || undefined,
  });

  // Get user settings
  const {
    data: userSettings,
    isLoading: isSettingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["user", "settings"],
    queryFn: userService.getUserSettings,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get notification settings
  const {
    data: notificationSettings,
    isLoading: isNotificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["user", "notifications"],
    queryFn: userService.getNotificationSettings,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update user profile mutation
  const updateUserMutation = useMutation({
    mutationFn: (updates: UpdateUserRequest) => userService.updateUser(updates),
    onSuccess: (updatedUser: User) => {
      // Update auth store
      updateAuthUser(updatedUser);

      // Update query cache
      queryClient.setQueryData(["user", "profile"], updatedUser);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Update user error:", error);
    },
  });

  // Update user settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (updates: UpdateUserSettingsRequest) =>
      userService.updateUserSettings(updates),
    onSuccess: (updatedSettings: UserSettings) => {
      // Update query cache
      queryClient.setQueryData(["user", "settings"], updatedSettings);

      // Update notification cache if notification settings changed
      const notificationData = {
        push_notifications: updatedSettings.push_notifications,
        email_notifications: updatedSettings.email_notifications,
        new_features: updatedSettings.new_features,
      };
      queryClient.setQueryData(["user", "notifications"], notificationData);
    },
    onError: (error) => {
      console.error("Update settings error:", error);
    },
  });

  // Delete user account mutation
  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      // Clear all caches and logout
      queryClient.clear();
      useAuthStore.getState().logout();
    },
    onError: (error) => {
      console.error("Delete user error:", error);
    },
  });

  // Actions
  const updateProfile = async (updates: UpdateUserRequest) => {
    return updateUserMutation.mutateAsync(updates);
  };

  const updateSettings = async (updates: UpdateUserSettingsRequest) => {
    return updateSettingsMutation.mutateAsync(updates);
  };

  const deleteAccount = async () => {
    return deleteUserMutation.mutateAsync();
  };

  const verifyPurchase = async (
    appUserId: string,
    platform: string,
    productId: string,
    transactionId: string
  ) => {
    await userService.verifyPurchase(
      appUserId,
      platform,
      productId,
      transactionId
    );
    // Refresh user data to show new token balance
    refetchUser();
  };

  const refreshUserData = () => {
    refetchUser();
    refetchSettings();
    refetchNotifications();
  };

  return {
    // Data
    user: currentUser,
    userSettings,
    notificationSettings,

    // Loading states
    isUserLoading,
    isSettingsLoading,
    isNotificationsLoading,
    isUpdateUserLoading: updateUserMutation.isPending,
    isUpdateSettingsLoading: updateSettingsMutation.isPending,
    isDeleteUserLoading: deleteUserMutation.isPending,

    // Actions
    updateProfile,
    updateSettings,
    deleteAccount,
    verifyPurchase,
    refreshUserData,
    refetchUser,
    refetchSettings,
    refetchNotifications,

    // Errors
    userError,
    settingsError,
    notificationsError,
    updateUserError: updateUserMutation.error,
    updateSettingsError: updateSettingsMutation.error,
    deleteUserError: deleteUserMutation.error,

    // Computed values
    isLoading: isUserLoading || isSettingsLoading || isNotificationsLoading,
    hasError: !!userError || !!settingsError || !!notificationsError,
  };
};
