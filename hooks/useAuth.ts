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
      console.log('[USE_AUTH] 🔄 Login mutation started');
      setLoading(true);
    },
    onSuccess: (data) => {
      console.log('[USE_AUTH] ✅ Login mutation successful, updating store');
      login(data.user, data.token);
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('[USE_AUTH] ❌ Login mutation error:', error);
    },
    onSettled: () => {
      console.log('[USE_AUTH] 🏁 Login mutation settled');
      setLoading(false);
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
    onMutate: () => {
      console.log('[USE_AUTH] 🚪 Logout mutation started');
    },
    onSuccess: () => {
      console.log('[USE_AUTH] ✅ Logout successful, clearing store and cache');
      logout();
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error('[USE_AUTH] ❌ Logout error:', error);
      // Even if server logout fails, clear local state
      console.log('[USE_AUTH] 🧹 Clearing local state despite server error');
      logout();
      queryClient.clear();
    }
  })

  // Current user query
  const { data: currentUser, isLoading: isUserLoading, error: currentUserError } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => {
      console.log('[USE_AUTH] 👤 Fetching current user from server...');
      return authService.getCurrentUser();
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // If token is invalid, logout user and don't retry
      if (error?.message?.includes('Token') || error?.message?.includes('401')) {
        console.log('[USE_AUTH] 🔄 Invalid token detected, logging out...');
        logout();
        return false;
      }
      return failureCount < 2;
    },
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

  // Determine the most current user data
  const finalUser = currentUser || user;
  const finalIsLoading = useAuthStore(state => state.isLoading) || isUserLoading;
  
  console.log('[USE_AUTH] 📊 State summary:', {
    isAuthenticated,
    hasStoreUser: !!user,
    hasCurrentUser: !!currentUser,
    finalUserEmail: (finalUser as any)?.email || 'None',
    isLoading: finalIsLoading
  });

  return {
    // State
    user: finalUser,
    isAuthenticated,
    isLoading: finalIsLoading,
    
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
    currentUserError,
  }
}