import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userSettingsService } from '@/services/userSettings'
import { UpdateUserSettingsRequest } from '@/types/database'

export const useUserSettings = () => {
  const queryClient = useQueryClient()

  // Get user settings
  const { 
    data: userSettings, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['userSettings'],
    queryFn: userSettingsService.getUserSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })

  // Get notification settings only
  const { 
    data: notificationSettings, 
    isLoading: isNotificationLoading 
  } = useQuery({
    queryKey: ['userSettings', 'notifications'],
    queryFn: userSettingsService.getNotificationSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Update user settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: userSettingsService.updateUserSettings,
    onSuccess: (updatedSettings) => {
      // Update the cache
      queryClient.setQueryData(['userSettings'], updatedSettings)
      
      // Update notification settings cache if it exists
      queryClient.setQueryData(['userSettings', 'notifications'], {
        push_notifications: updatedSettings.push_notifications,
        email_notifications: updatedSettings.email_notifications,
        new_features: updatedSettings.new_features,
      })
    }
  })

  // Update push notifications mutation
  const updatePushNotificationsMutation = useMutation({
    mutationFn: userSettingsService.updatePushNotifications,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['userSettings'], updatedSettings)
      queryClient.invalidateQueries({ queryKey: ['userSettings', 'notifications'] })
    }
  })

  // Update email notifications mutation
  const updateEmailNotificationsMutation = useMutation({
    mutationFn: userSettingsService.updateEmailNotifications,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['userSettings'], updatedSettings)
      queryClient.invalidateQueries({ queryKey: ['userSettings', 'notifications'] })
    }
  })

  // Update new features notifications mutation
  const updateNewFeaturesNotificationsMutation = useMutation({
    mutationFn: userSettingsService.updateNewFeaturesNotifications,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['userSettings'], updatedSettings)
      queryClient.invalidateQueries({ queryKey: ['userSettings', 'notifications'] })
    }
  })

  // Update language mutation
  const updateLanguageMutation = useMutation({
    mutationFn: userSettingsService.updateLanguage,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['userSettings'], updatedSettings)
    }
  })

  // Update all notifications mutation
  const updateAllNotificationsMutation = useMutation({
    mutationFn: userSettingsService.updateAllNotifications,
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['userSettings'], updatedSettings)
      queryClient.setQueryData(['userSettings', 'notifications'], {
        push_notifications: updatedSettings.push_notifications,
        email_notifications: updatedSettings.email_notifications,
        new_features: updatedSettings.new_features,
      })
    }
  })

  // Actions
  const updateSettings = async (updates: UpdateUserSettingsRequest) => {
    return updateSettingsMutation.mutateAsync(updates)
  }

  const updatePushNotifications = async (enabled: boolean) => {
    return updatePushNotificationsMutation.mutateAsync(enabled)
  }

  const updateEmailNotifications = async (enabled: boolean) => {
    return updateEmailNotificationsMutation.mutateAsync(enabled)
  }

  const updateNewFeaturesNotifications = async (enabled: boolean) => {
    return updateNewFeaturesNotificationsMutation.mutateAsync(enabled)
  }

  const updateLanguage = async (language: string) => {
    return updateLanguageMutation.mutateAsync(language)
  }

  const updateAllNotifications = async (notifications: {
    push_notifications?: boolean
    email_notifications?: boolean
    new_features?: boolean
  }) => {
    return updateAllNotificationsMutation.mutateAsync(notifications)
  }

  return {
    // Data
    userSettings,
    notificationSettings,
    
    // Loading states
    isLoading,
    isNotificationLoading,
    isUpdatingSettings: updateSettingsMutation.isPending,
    isUpdatingPushNotifications: updatePushNotificationsMutation.isPending,
    isUpdatingEmailNotifications: updateEmailNotificationsMutation.isPending,
    isUpdatingNewFeaturesNotifications: updateNewFeaturesNotificationsMutation.isPending,
    isUpdatingLanguage: updateLanguageMutation.isPending,
    isUpdatingAllNotifications: updateAllNotificationsMutation.isPending,
    
    // Actions
    updateSettings,
    updatePushNotifications,
    updateEmailNotifications,
    updateNewFeaturesNotifications,
    updateLanguage,
    updateAllNotifications,
    refetch,
    
    // Errors
    error,
    updateSettingsError: updateSettingsMutation.error,
    updatePushNotificationsError: updatePushNotificationsMutation.error,
    updateEmailNotificationsError: updateEmailNotificationsMutation.error,
    updateNewFeaturesNotificationsError: updateNewFeaturesNotificationsMutation.error,
    updateLanguageError: updateLanguageMutation.error,
    updateAllNotificationsError: updateAllNotificationsMutation.error,
  }
}