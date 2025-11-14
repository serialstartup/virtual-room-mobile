import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User as DatabaseUser } from '@/types/database'

export type User = DatabaseUser

export interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({
            user: updatedUser
          });
        } else {
          console.warn('[AUTH_STORE] ⚠️ No current user to update');
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'virtual-room-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        return {
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        };
      },
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('[AUTH_STORE] 🚨 Hydration failed:', error);
          }
        };
      }
    }
  )
)