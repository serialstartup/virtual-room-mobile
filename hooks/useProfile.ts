import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { authService, UpdateUserRequest } from '@/services/auth'
import { User } from '@/types/database'

export const useProfile = () => {
  const queryClient = useQueryClient()
  const { user, updateUser, isAuthenticated } = useAuthStore()

  // Get current user profile
  const { 
    data: currentUser, 
    isLoading: isUserLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updates: UpdateUserRequest) => 
      authService.updateProfile(user?.id || '', updates),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      queryClient.setQueryData(['auth', 'currentUser'], updatedUser)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    }
  })

  // Get user by ID mutation (for viewing other users)
  const getUserMutation = useMutation({
    mutationFn: (userId: string) => authService.getUserById(userId),
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => authService.deleteAccount(user?.id || ''),
    onSuccess: () => {
      queryClient.clear()
      // This will trigger logout in the auth store
    }
  })

  // Profile actions
  const updateProfile = async (updates: UpdateUserRequest) => {
    if (!user?.id) throw new Error('No user found')
    return updateProfileMutation.mutateAsync(updates)
  }

  const getUser = async (userId: string) => {
    return getUserMutation.mutateAsync(userId)
  }

  const deleteAccount = async () => {
    if (!user?.id) throw new Error('No user found')
    return deleteAccountMutation.mutateAsync()
  }

  return {
    // State
    user: currentUser || user,
    
    // Loading states
    isUserLoading,
    isUpdatingProfile: updateProfileMutation.isPending,
    isGettingUser: getUserMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,
    
    // Actions
    updateProfile,
    getUser,
    deleteAccount,
    refetchUser,
    
    // Errors
    updateProfileError: updateProfileMutation.error,
    getUserError: getUserMutation.error,
    deleteAccountError: deleteAccountMutation.error,

    // Fetched user data (for viewing other users)
    fetchedUser: getUserMutation.data
  }
}