import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { authService, LoginCredentials, SignupCredentials, UpdateUserRequest } from '@/services/auth'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const { user, isAuthenticated, login, logout, setLoading } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      login(data.user, data.token)
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (error) => {
      console.error('Login error:', error)
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      login(data.user, data.token)
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
    onError: (error) => {
      console.error('Signup error:', error)
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout()
      // Clear all cached data
      queryClient.clear()
    }
  })

  // Current user query
  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updates: UpdateUserRequest) => 
      authService.updateProfile(user?.id || '', updates),
    onSuccess: (updatedUser) => {
      // Update the auth store
      login(updatedUser, useAuthStore.getState().token || '')
      // Update the query cache
      queryClient.setQueryData(['auth', 'currentUser'], updatedUser)
    }
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => authService.deleteAccount(user?.id || ''),
    onSuccess: () => {
      logout()
      queryClient.clear()
    }
  })

  // Auth actions
  const performLogin = async (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials)
  }

  const performSignup = async (userData: SignupCredentials) => {
    return signupMutation.mutateAsync(userData)
  }

  const performLogout = () => {
    logoutMutation.mutate()
  }

  const performUpdateProfile = async (updates: UpdateUserRequest) => {
    if (!user?.id) throw new Error('No user found')
    return updateProfileMutation.mutateAsync(updates)
  }

  const performResetPassword = async (email: string) => {
    return resetPasswordMutation.mutateAsync(email)
  }

  const performDeleteAccount = async () => {
    if (!user?.id) throw new Error('No user found')
    return deleteAccountMutation.mutateAsync()
  }

  return {
    // State
    user: currentUser || user,
    isAuthenticated,
    isLoading: useAuthStore(state => state.isLoading) || isUserLoading,
    
    // Actions
    login: performLogin,
    signup: performSignup,
    logout: performLogout,
    updateProfile: performUpdateProfile,
    resetPassword: performResetPassword,
    deleteAccount: performDeleteAccount,
    
    // Mutation states
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isDeleteAccountLoading: deleteAccountMutation.isPending,
    
    // Errors
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    deleteAccountError: deleteAccountMutation.error,
  }
}