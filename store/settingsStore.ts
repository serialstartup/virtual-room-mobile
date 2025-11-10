import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface AppSettings {
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Language
  language: 'tr' | 'en'
  
  // App preferences
  autoSave: boolean
  hapticFeedback: boolean
  
  // Camera settings
  cameraQuality: 'low' | 'medium' | 'high'
  saveToGallery: boolean
  
  // Performance
  reducedAnimations: boolean
  
  // Privacy
  analyticsEnabled: boolean
  crashReportingEnabled: boolean
}

export interface SettingsState extends AppSettings {
  // Actions
  updateTheme: (theme: AppSettings['theme']) => void
  updateLanguage: (language: AppSettings['language']) => void
  updateAutoSave: (enabled: boolean) => void
  updateHapticFeedback: (enabled: boolean) => void
  updateCameraQuality: (quality: AppSettings['cameraQuality']) => void
  updateSaveToGallery: (enabled: boolean) => void
  updateReducedAnimations: (enabled: boolean) => void
  updateAnalytics: (enabled: boolean) => void
  updateCrashReporting: (enabled: boolean) => void
  resetToDefaults: () => void
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'tr',
  autoSave: true,
  hapticFeedback: true,
  cameraQuality: 'high',
  saveToGallery: false,
  reducedAnimations: false,
  analyticsEnabled: true,
  crashReportingEnabled: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      ...defaultSettings,

      // Actions
      updateTheme: (theme: AppSettings['theme']) => {
        set({ theme })
      },

      updateLanguage: (language: AppSettings['language']) => {
        set({ language })
      },

      updateAutoSave: (enabled: boolean) => {
        set({ autoSave: enabled })
      },

      updateHapticFeedback: (enabled: boolean) => {
        set({ hapticFeedback: enabled })
      },

      updateCameraQuality: (quality: AppSettings['cameraQuality']) => {
        set({ cameraQuality: quality })
      },

      updateSaveToGallery: (enabled: boolean) => {
        set({ saveToGallery: enabled })
      },

      updateReducedAnimations: (enabled: boolean) => {
        set({ reducedAnimations: enabled })
      },

      updateAnalytics: (enabled: boolean) => {
        set({ analyticsEnabled: enabled })
      },

      updateCrashReporting: (enabled: boolean) => {
        set({ crashReportingEnabled: enabled })
      },

      resetToDefaults: () => {
        set(defaultSettings)
      },
    }),
    {
      name: 'virtual-room-settings',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist all settings
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        autoSave: state.autoSave,
        hapticFeedback: state.hapticFeedback,
        cameraQuality: state.cameraQuality,
        saveToGallery: state.saveToGallery,
        reducedAnimations: state.reducedAnimations,
        analyticsEnabled: state.analyticsEnabled,
        crashReportingEnabled: state.crashReportingEnabled,
      })
    }
  )
)