import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface ProfileSettings {
  notifications: {
    push: boolean
    email: boolean
    newFeatures: boolean
  }
  language: string
  theme: 'light' | 'dark' | 'system'
}

export interface TryOnHistory {
  id: string
  imageUrl: string
  clothingItem: string
  createdAt: string
  isFavorite: boolean
}

export interface ProfileState {
  // State
  settings: ProfileSettings
  tryOnHistory: TryOnHistory[]
  favorites: TryOnHistory[]
  
  // Actions
  updateSettings: (settings: Partial<ProfileSettings>) => void
  updateNotificationSetting: (key: keyof ProfileSettings['notifications'], value: boolean) => void
  setLanguage: (language: string) => void
  setTheme: (theme: ProfileSettings['theme']) => void
  addTryOnHistory: (item: TryOnHistory) => void
  toggleFavorite: (id: string) => void
  clearHistory: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: {
        notifications: {
          push: true,
          email: false,
          newFeatures: true
        },
        language: 'tr',
        theme: 'light'
      },
      tryOnHistory: [],
      favorites: [],

      // Actions
      updateSettings: (newSettings: Partial<ProfileSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      updateNotificationSetting: (key: keyof ProfileSettings['notifications'], value: boolean) => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              [key]: value
            }
          }
        }))
      },

      setLanguage: (language: string) => {
        set((state) => ({
          settings: { ...state.settings, language }
        }))
      },

      setTheme: (theme: ProfileSettings['theme']) => {
        set((state) => ({
          settings: { ...state.settings, theme }
        }))
      },

      addTryOnHistory: (item: TryOnHistory) => {
        set((state) => ({
          tryOnHistory: [item, ...state.tryOnHistory]
        }))
      },

      toggleFavorite: (id: string) => {
        const state = get()
        const item = state.tryOnHistory.find(item => item.id === id)
        
        if (item) {
          const updatedItem = { ...item, isFavorite: !item.isFavorite }
          
          set((state) => ({
            tryOnHistory: state.tryOnHistory.map(historyItem =>
              historyItem.id === id ? updatedItem : historyItem
            ),
            favorites: updatedItem.isFavorite
              ? [...state.favorites, updatedItem]
              : state.favorites.filter(fav => fav.id !== id)
          }))
        }
      },

      clearHistory: () => {
        set({
          tryOnHistory: [],
          favorites: []
        })
      }
    }),
    {
      name: 'virtual-room-profile',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)