import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface AppState {
  // UI Loading States
  isGlobalLoading: boolean
  isUploadingImage: boolean
  isProcessingTryOn: boolean
  
  // Onboarding
  isOnboarding: boolean
  hasSeenTutorial: boolean
  
  // Navigation
  activeTab: string
  lastActiveTab: string
  
  // Modal States
  isPersonModalOpen: boolean
  isDressModalOpen: boolean
  isSettingsModalOpen: boolean
  isImagePreviewModalOpen: boolean
  
  // Try-On State
  selectedTryOnId: string | null
  processingTryOnId: string | null
  
  // Image Picker State
  selectedImages: string[]
  tempImages: string[]
  
  // App Metadata
  appVersion: string
  lastOpenedAt: string
  
  // Actions
  setGlobalLoading: (loading: boolean) => void
  setUploadingImage: (uploading: boolean) => void
  setProcessingTryOn: (processing: boolean) => void
  setOnboarding: (status: boolean) => void
  setHasSeenTutorial: (seen: boolean) => void
  setActiveTab: (tab: string) => void
  
  // Modal actions
  openPersonModal: () => void
  closePersonModal: () => void
  openDressModal: () => void
  closeDressModal: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
  openImagePreviewModal: () => void
  closeImagePreviewModal: () => void
  closeAllModals: () => void
  
  // Try-on actions
  setSelectedTryOn: (id: string | null) => void
  setProcessingTryOnId: (id: string | null) => void
  
  // Image actions
  addSelectedImage: (image: string) => void
  removeSelectedImage: (image: string) => void
  clearSelectedImages: () => void
  addTempImage: (image: string) => void
  clearTempImages: () => void
  
  // App actions
  updateLastOpened: () => void
  resetApp: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isGlobalLoading: false,
      isUploadingImage: false,
      isProcessingTryOn: false,
      isOnboarding: true,
      hasSeenTutorial: false,
      activeTab: 'home',
      lastActiveTab: 'home',
      isPersonModalOpen: false,
      isDressModalOpen: false,
      isSettingsModalOpen: false,
      isImagePreviewModalOpen: false,
      selectedTryOnId: null,
      processingTryOnId: null,
      selectedImages: [],
      tempImages: [],
      appVersion: '1.0.0',
      lastOpenedAt: new Date().toISOString(),

      // Loading actions
      setGlobalLoading: (loading: boolean) => {
        set({ isGlobalLoading: loading })
      },

      setUploadingImage: (uploading: boolean) => {
        set({ isUploadingImage: uploading })
      },

      setProcessingTryOn: (processing: boolean) => {
        set({ isProcessingTryOn: processing })
      },

      // Onboarding actions
      setOnboarding: (status: boolean) => {
        set({ isOnboarding: status })
      },

      setHasSeenTutorial: (seen: boolean) => {
        set({ hasSeenTutorial: seen })
      },

      // Navigation actions
      setActiveTab: (tab: string) => {
        const currentTab = get().activeTab
        set({ 
          activeTab: tab,
          lastActiveTab: currentTab 
        })
      },

      // Modal actions
      openPersonModal: () => {
        set({ isPersonModalOpen: true })
      },

      closePersonModal: () => {
        set({ isPersonModalOpen: false })
      },

      openDressModal: () => {
        set({ isDressModalOpen: true })
      },

      closeDressModal: () => {
        set({ isDressModalOpen: false })
      },

      openSettingsModal: () => {
        set({ isSettingsModalOpen: true })
      },

      closeSettingsModal: () => {
        set({ isSettingsModalOpen: false })
      },

      openImagePreviewModal: () => {
        set({ isImagePreviewModalOpen: true })
      },

      closeImagePreviewModal: () => {
        set({ isImagePreviewModalOpen: false })
      },

      closeAllModals: () => {
        set({
          isPersonModalOpen: false,
          isDressModalOpen: false,
          isSettingsModalOpen: false,
          isImagePreviewModalOpen: false,
        })
      },

      // Try-on actions
      setSelectedTryOn: (id: string | null) => {
        set({ selectedTryOnId: id })
      },

      setProcessingTryOnId: (id: string | null) => {
        set({ processingTryOnId: id })
      },

      // Image actions
      addSelectedImage: (image: string) => {
        set((state) => ({
          selectedImages: [...state.selectedImages, image]
        }))
      },

      removeSelectedImage: (image: string) => {
        set((state) => ({
          selectedImages: state.selectedImages.filter(img => img !== image)
        }))
      },

      clearSelectedImages: () => {
        set({ selectedImages: [] })
      },

      addTempImage: (image: string) => {
        set((state) => ({
          tempImages: [...state.tempImages, image]
        }))
      },

      clearTempImages: () => {
        set({ tempImages: [] })
      },

      // App actions
      updateLastOpened: () => {
        set({ lastOpenedAt: new Date().toISOString() })
      },

      resetApp: () => {
        set({
          isGlobalLoading: false,
          isUploadingImage: false,
          isProcessingTryOn: false,
          isOnboarding: true,
          hasSeenTutorial: false,
          activeTab: 'home',
          lastActiveTab: 'home',
          isPersonModalOpen: false,
          isDressModalOpen: false,
          isSettingsModalOpen: false,
          isImagePreviewModalOpen: false,
          selectedTryOnId: null,
          processingTryOnId: null,
          selectedImages: [],
          tempImages: [],
          lastOpenedAt: new Date().toISOString()
        })
      }
    }),
    {
      name: 'virtual-room-app',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboarding: state.isOnboarding,
        hasSeenTutorial: state.hasSeenTutorial,
        activeTab: state.activeTab,
        lastActiveTab: state.lastActiveTab,
        lastOpenedAt: state.lastOpenedAt,
        appVersion: state.appVersion,
      })
    }
  )
)