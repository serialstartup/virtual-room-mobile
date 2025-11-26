import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from '@/services/avatar';

export interface AvatarState {
  // Avatar data
  avatars: Avatar[];
  primaryAvatar: Avatar | null;
  selectedAvatar: Avatar | null;
  
  // UI States
  isCreatingAvatar: boolean;
  isProcessingAvatar: string | null; // Avatar ID that's currently processing
  
  // Creation form data
  avatarCreationData: {
    name: string;
    faceImage: string | null;
  };
  
  // Avatar management
  showAvatarSelector: boolean;
  showAvatarCreator: boolean;
  
  // Actions - Avatar Management
  setAvatars: (avatars: Avatar[]) => void;
  addAvatar: (avatar: Avatar) => void;
  updateAvatar: (avatarId: string, updates: Partial<Avatar>) => void;
  removeAvatar: (avatarId: string) => void;
  setPrimaryAvatar: (avatar: Avatar | null) => void;
  setSelectedAvatar: (avatar: Avatar | null) => void;
  
  // Actions - UI States
  setCreatingAvatar: (isCreating: boolean) => void;
  setProcessingAvatar: (avatarId: string | null) => void;
  
  // Actions - Form Management
  setAvatarName: (name: string) => void;
  setAvatarFaceImage: (image: string | null) => void;
  clearAvatarCreationData: () => void;
  
  // Actions - Modal Management
  showAvatarSelectorModal: () => void;
  hideAvatarSelectorModal: () => void;
  showAvatarCreatorModal: () => void;
  hideAvatarCreatorModal: () => void;
  hideAllAvatarModals: () => void;
  
  // Actions - Utilities
  getAvatarById: (avatarId: string) => Avatar | undefined;
  getProcessingAvatars: () => Avatar[];
  getCompletedAvatars: () => Avatar[];
  getFailedAvatars: () => Avatar[];
  
  // Reset
  resetAvatarStore: () => void;
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      // Initial state
      avatars: [],
      primaryAvatar: null,
      selectedAvatar: null,
      isCreatingAvatar: false,
      isProcessingAvatar: null,
      
      avatarCreationData: {
        name: '',
        faceImage: null,
      },
      
      showAvatarSelector: false,
      showAvatarCreator: false,

      // Avatar Management Actions
      setAvatars: (avatars: Avatar[]) => {
        set({ avatars });
        
        // Update primary avatar if exists
        const primary = avatars.find(avatar => avatar.is_primary);
        if (primary) {
          set({ primaryAvatar: primary });
        }
      },

      addAvatar: (avatar: Avatar) => {
        set((state) => ({
          avatars: [avatar, ...state.avatars]
        }));
        
        // Set as primary if it's marked as primary
        if (avatar.is_primary) {
          set({ primaryAvatar: avatar });
        }
      },

      updateAvatar: (avatarId: string, updates: Partial<Avatar>) => {
        set((state) => ({
          avatars: state.avatars.map(avatar =>
            avatar.id === avatarId ? { ...avatar, ...updates } : avatar
          )
        }));
        
        // Update primary avatar if this avatar is now primary
        if (updates.is_primary) {
          const updatedAvatar = get().avatars.find(a => a.id === avatarId);
          if (updatedAvatar) {
            set({ primaryAvatar: updatedAvatar });
          }
        }
        
        // Update selected avatar if it's the one being updated
        const state = get();
        if (state.selectedAvatar?.id === avatarId) {
          set({ 
            selectedAvatar: { ...state.selectedAvatar, ...updates } 
          });
        }
      },

      removeAvatar: (avatarId: string) => {
        const state = get();
        const avatarToRemove = state.avatars.find(a => a.id === avatarId);
        
        set((currentState) => ({
          avatars: currentState.avatars.filter(avatar => avatar.id !== avatarId)
        }));
        
        // Clear primary if removed avatar was primary
        if (avatarToRemove?.is_primary) {
          set({ primaryAvatar: null });
        }
        
        // Clear selected if removed avatar was selected
        if (state.selectedAvatar?.id === avatarId) {
          set({ selectedAvatar: null });
        }
      },

      setPrimaryAvatar: (avatar: Avatar | null) => {
        set({ primaryAvatar: avatar });
        
        // Update avatars array to reflect primary status
        if (avatar) {
          set((state) => ({
            avatars: state.avatars.map(a => ({
              ...a,
              is_primary: a.id === avatar.id
            }))
          }));
        }
      },

      setSelectedAvatar: (avatar: Avatar | null) => {
        set({ selectedAvatar: avatar });
      },

      // UI State Actions
      setCreatingAvatar: (isCreating: boolean) => {
        set({ isCreatingAvatar: isCreating });
      },

      setProcessingAvatar: (avatarId: string | null) => {
        set({ isProcessingAvatar: avatarId });
      },

      // Form Management Actions
      setAvatarName: (name: string) => {
        set((state) => ({
          avatarCreationData: {
            ...state.avatarCreationData,
            name
          }
        }));
      },

      setAvatarFaceImage: (image: string | null) => {
        set((state) => ({
          avatarCreationData: {
            ...state.avatarCreationData,
            faceImage: image
          }
        }));
      },

      clearAvatarCreationData: () => {
        set({
          avatarCreationData: {
            name: '',
            faceImage: null,
          }
        });
      },

      // Modal Management Actions
      showAvatarSelectorModal: () => {
        set({ showAvatarSelector: true });
      },

      hideAvatarSelectorModal: () => {
        set({ showAvatarSelector: false });
      },

      showAvatarCreatorModal: () => {
        set({ showAvatarCreator: true });
      },

      hideAvatarCreatorModal: () => {
        set({ showAvatarCreator: false });
        // Optionally clear form data when closing
        // get().clearAvatarCreationData();
      },

      hideAllAvatarModals: () => {
        set({
          showAvatarSelector: false,
          showAvatarCreator: false,
        });
      },

      // Utility Actions
      getAvatarById: (avatarId: string) => {
        return get().avatars.find(avatar => avatar.id === avatarId);
      },

      getProcessingAvatars: () => {
        return get().avatars.filter(avatar => avatar.status === 'processing');
      },

      getCompletedAvatars: () => {
        return get().avatars.filter(avatar => avatar.status === 'completed');
      },

      getFailedAvatars: () => {
        return get().avatars.filter(avatar => avatar.status === 'failed');
      },

      // Reset
      resetAvatarStore: () => {
        set({
          avatars: [],
          primaryAvatar: null,
          selectedAvatar: null,
          isCreatingAvatar: false,
          isProcessingAvatar: null,
          avatarCreationData: {
            name: '',
            faceImage: null,
          },
          showAvatarSelector: false,
          showAvatarCreator: false,
        });
      },
    }),
    {
      name: 'virtual-room-avatars',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist essential data, not UI states
        avatars: state.avatars,
        primaryAvatar: state.primaryAvatar,
        selectedAvatar: state.selectedAvatar,
        avatarCreationData: state.avatarCreationData,
      })
    }
  )
);