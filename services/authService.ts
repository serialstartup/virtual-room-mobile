// Legacy authService - now just wraps the Auth Store
// All token management is handled by Zustand Auth Store + AsyncStorage

export const authService = {
  // Deprecated: Use Auth Store instead
  async getToken(): Promise<string | null> {
    console.warn('[AUTH_SERVICE] ⚠️ getToken() is deprecated, use Auth Store instead');
    return null;
  },

  // Deprecated: Use Auth Store instead  
  async setToken(token: string): Promise<void> {
    console.warn('[AUTH_SERVICE] ⚠️ setToken() is deprecated, use Auth Store instead');
  },

  // Deprecated: Use Auth Store instead
  async removeToken(): Promise<void> {
    console.warn('[AUTH_SERVICE] ⚠️ removeToken() is deprecated, use Auth Store instead');
  },

  // Get auth headers from Auth Store
  async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { useAuthStore } = await import('@/store/authStore');
      const { token, isAuthenticated } = useAuthStore.getState();
      
      return {
        'Content-Type': 'application/json',
        ...(token && isAuthenticated && { Authorization: `Bearer ${token}` })
      };
    } catch (error) {
      console.error('[AUTH_SERVICE] Error getting auth headers:', error);
      return { 'Content-Type': 'application/json' };
    }
  }
};