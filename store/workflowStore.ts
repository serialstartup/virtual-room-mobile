import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAvatar } from "@/hooks/useUserAvatars";

export type WorkflowType =
  | "classic"
  | "product-to-model"
  | "text-to-fashion"
  | "avatar";

export interface WorkflowData {
  // Classic Try-On Data
  classic: {
    selfImage: string | null;
    modelImage: string | null;
    dressImage: string | null;
    dressDescription: string | null;
    selectedAvatar: UserAvatar | null;
  };

  // Product to Model Data
  productToModel: {
    productImage: string | null;
    productName: string;
    scenePrompt: string;
    modelImage: string | null;
    selectedAvatar: UserAvatar | null;
  };

  // Text to Fashion Data
  textToFashion: {
    fashionDescription: string;
    scenePrompt: string;
  };

  // Avatar Try-On Data
  avatar: {
    avatarId: string | null;
    garmentImageUrl: string | null;
    garmentDescription: string | null;
    tryOnType: "classic" | "text-to-fashion";
  };

  // Avatar Creation Data
  avatarCreation: {
    faceImage: string | null;
    avatarName: string;
  };
}

export interface WorkflowState {
  // Current workflow
  activeWorkflow: WorkflowType;

  // Workflow data
  workflowData: WorkflowData;

  // UI states
  currentStep: number;
  totalSteps: number;
  isWorkflowComplete: boolean;
  showWorkflowSelector: boolean;

  // Processing states
  isProcessing: boolean;
  currentTryOnId: string | null;

  // Actions - Workflow Management
  setActiveWorkflow: (workflow: WorkflowType) => void;
  resetCurrentWorkflow: () => void;
  resetAllWorkflows: () => void;

  // Actions - Classic Try-On
  setClassicSelfImage: (image: string | null) => void;
  setClassicModelImage: (image: string | null) => void;
  setClassicDressImage: (image: string | null) => void;
  setClassicDressDescription: (description: string | null) => void;
  setClassicSelectedAvatar: (avatar: UserAvatar | null) => void;

  // Actions - Product to Model
  setProductImage: (image: string | null) => void;
  setProductName: (name: string) => void;
  setProductScenePrompt: (prompt: string) => void;
  setProductModelImage: (image: string | null) => void;
  setProductSelectedAvatar: (avatar: UserAvatar | null) => void;

  // Actions - Text to Fashion
  setFashionDescription: (description: string) => void;
  setFashionScenePrompt: (prompt: string) => void;

  // Actions - Avatar Try-On
  setAvatarId: (avatarId: string | null) => void;
  setAvatarGarmentImage: (image: string | null) => void;
  setAvatarGarmentDescription: (description: string | null) => void;
  setAvatarTryOnType: (type: "classic" | "text-to-fashion") => void;

  // Actions - Avatar Creation
  setAvatarCreationFaceImage: (image: string | null) => void;
  setAvatarCreationName: (name: string) => void;

  // Actions - Step Management
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setTotalSteps: (total: number) => void;

  // Actions - UI Management
  setWorkflowComplete: (complete: boolean) => void;
  showWorkflowSelectorModal: () => void;
  hideWorkflowSelectorModal: () => void;

  // Actions - Processing Management
  setProcessing: (processing: boolean) => void;
  setCurrentTryOnId: (tryOnId: string | null) => void;

  // Validation helpers
  isClassicWorkflowValid: () => boolean;
  isProductToModelWorkflowValid: () => boolean;
  isTextToFashionWorkflowValid: () => boolean;
  isAvatarWorkflowValid: () => boolean;
  isCurrentWorkflowValid: () => boolean;

  // Data getters
  getCurrentWorkflowData: () => any;
  getWorkflowProgress: () => number;

  // Temporary form data management (replaces storageService)
  getTryOnFormData: () => {
    selectedPersonImage?: string;
    selectedDressImage?: string;
    dressDescription?: string;
    timestamp?: number;
  } | null;
  clearExpiredData: () => void;

  // Reset
  resetWorkflowStore: () => void;
}

const initialWorkflowData: WorkflowData = {
  classic: {
    selfImage: null,
    modelImage: null,
    dressImage: null,
    dressDescription: null,
    selectedAvatar: null,
  },
  productToModel: {
    productImage: null,
    productName: "",
    scenePrompt: "professional studio setting",
    modelImage: null,
    selectedAvatar: null,
  },
  textToFashion: {
    fashionDescription: "",
    scenePrompt: "modern urban setting",
  },
  avatar: {
    avatarId: null,
    garmentImageUrl: null,
    garmentDescription: null,
    tryOnType: "classic",
  },
  avatarCreation: {
    faceImage: null,
    avatarName: "",
  },
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeWorkflow: "classic",
      workflowData: initialWorkflowData,
      currentStep: 1,
      totalSteps: 3,
      isWorkflowComplete: false,
      showWorkflowSelector: false,
      isProcessing: false,
      currentTryOnId: null,

      // Workflow Management Actions
      setActiveWorkflow: (workflow: WorkflowType) => {
        set({
          activeWorkflow: workflow,
          currentStep: 1,
          isWorkflowComplete: false,
        });

        // Set appropriate total steps based on workflow
        switch (workflow) {
          case "classic":
            set({ totalSteps: 3 }); // Select person, select dress, create
            break;
          case "product-to-model":
            set({ totalSteps: 3 }); // Upload product, set scene, create
            break;
          case "text-to-fashion":
            set({ totalSteps: 2 }); // Enter description, create
            break;
          case "avatar":
            set({ totalSteps: 4 }); // Select avatar, choose type, select/describe garment, create
            break;
        }
      },

      resetCurrentWorkflow: () => {
        const { activeWorkflow } = get();
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            [activeWorkflow]: { ...initialWorkflowData[activeWorkflow] },
          },
          currentStep: 1,
          isWorkflowComplete: false,
          isProcessing: false,
          currentTryOnId: null,
        }));
      },

      resetAllWorkflows: () => {
        set({
          workflowData: initialWorkflowData,
          currentStep: 1,
          isWorkflowComplete: false,
          isProcessing: false,
          currentTryOnId: null,
        });
      },

      // Classic Try-On Actions
      setClassicSelfImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            classic: {
              ...state.workflowData.classic,
              selfImage: image,
              modelImage: image ? null : state.workflowData.classic.modelImage, // Clear model image if self image is set
            },
          },
        }));
      },

      setClassicModelImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            classic: {
              ...state.workflowData.classic,
              modelImage: image,
              selfImage: image ? null : state.workflowData.classic.selfImage, // Clear self image if model image is set
            },
          },
        }));
      },

      setClassicDressImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            classic: {
              ...state.workflowData.classic,
              dressImage: image,
              dressDescription: image
                ? null
                : state.workflowData.classic.dressDescription, // Clear description if image is set
            },
          },
        }));
      },

      setClassicDressDescription: (description: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            classic: {
              ...state.workflowData.classic,
              dressDescription: description,
              dressImage: description
                ? null
                : state.workflowData.classic.dressImage, // Clear image if description is set
            },
          },
        }));
      },

      setClassicSelectedAvatar: (avatar: UserAvatar | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            classic: {
              ...state.workflowData.classic,
              selectedAvatar: avatar,
            },
          },
        }));
      },

      // Product to Model Actions
      setProductImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            productToModel: {
              ...state.workflowData.productToModel,
              productImage: image,
            },
          },
        }));
      },

      setProductName: (name: string) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            productToModel: {
              ...state.workflowData.productToModel,
              productName: name,
            },
          },
        }));
      },

      setProductScenePrompt: (prompt: string) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            productToModel: {
              ...state.workflowData.productToModel,
              scenePrompt: prompt,
            },
          },
        }));
      },

      setProductModelImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            productToModel: {
              ...state.workflowData.productToModel,
              modelImage: image,
              selectedAvatar: image
                ? null
                : state.workflowData.productToModel.selectedAvatar, // Clear avatar if model image is set
            },
          },
        }));
      },

      setProductSelectedAvatar: (avatar: UserAvatar | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            productToModel: {
              ...state.workflowData.productToModel,
              selectedAvatar: avatar,
              modelImage: avatar
                ? null
                : state.workflowData.productToModel.modelImage, // Clear model image if avatar is selected
            },
          },
        }));
      },

      // Text to Fashion Actions
      setFashionDescription: (description: string) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            textToFashion: {
              ...state.workflowData.textToFashion,
              fashionDescription: description,
            },
          },
        }));
      },

      setFashionScenePrompt: (prompt: string) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            textToFashion: {
              ...state.workflowData.textToFashion,
              scenePrompt: prompt,
            },
          },
        }));
      },

      // Avatar Try-On Actions
      setAvatarId: (avatarId: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            avatar: {
              ...state.workflowData.avatar,
              avatarId,
            },
          },
        }));
      },

      setAvatarGarmentImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            avatar: {
              ...state.workflowData.avatar,
              garmentImageUrl: image,
              garmentDescription: image
                ? null
                : state.workflowData.avatar.garmentDescription, // Clear description if image is set
            },
          },
        }));
      },

      setAvatarGarmentDescription: (description: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            avatar: {
              ...state.workflowData.avatar,
              garmentDescription: description,
              garmentImageUrl: description
                ? null
                : state.workflowData.avatar.garmentImageUrl, // Clear image if description is set
            },
          },
        }));
      },

      setAvatarTryOnType: (type: "classic" | "text-to-fashion") => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            avatar: {
              ...state.workflowData.avatar,
              tryOnType: type,
            },
          },
        }));
      },

      // Avatar Creation Actions
      setAvatarCreationFaceImage: (image: string | null) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            avatarCreation: {
              ...state.workflowData.avatarCreation,
              faceImage: image,
            },
          },
        }));
      },

      setAvatarCreationName: (name: string) => {
        set((state) => ({
          workflowData: {
            ...state.workflowData,
            avatarCreation: {
              ...state.workflowData.avatarCreation,
              avatarName: name,
            },
          },
        }));
      },

      // Step Management Actions
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      setTotalSteps: (total: number) => {
        set({ totalSteps: total });
      },

      // UI Management Actions
      setWorkflowComplete: (complete: boolean) => {
        set({ isWorkflowComplete: complete });
      },

      showWorkflowSelectorModal: () => {
        set({ showWorkflowSelector: true });
      },

      hideWorkflowSelectorModal: () => {
        set({ showWorkflowSelector: false });
      },

      // Processing Management Actions
      setProcessing: (processing: boolean) => {
        set({ isProcessing: processing });
      },

      setCurrentTryOnId: (tryOnId: string | null) => {
        set({ currentTryOnId: tryOnId });
      },

      // Validation Helpers
      isClassicWorkflowValid: () => {
        const { classic } = get().workflowData;
        const hasPersonImage =
          classic.selfImage || classic.modelImage || classic.selectedAvatar;
        const hasDress =
          classic.dressImage ||
          (classic.dressDescription && classic.dressDescription.trim());
        return !!(hasPersonImage && hasDress);
      },

      isProductToModelWorkflowValid: () => {
        const { productToModel } = get().workflowData;
        return !!(
          productToModel.productImage &&
          productToModel.productName &&
          productToModel.productName.trim()
        );
      },

      isTextToFashionWorkflowValid: () => {
        const { textToFashion } = get().workflowData;
        return !!(
          textToFashion.fashionDescription &&
          textToFashion.fashionDescription.trim()
        );
      },

      isAvatarWorkflowValid: () => {
        const { avatar } = get().workflowData;
        const hasAvatar = !!avatar.avatarId;
        const hasGarment =
          avatar.garmentImageUrl ||
          (avatar.garmentDescription && avatar.garmentDescription.trim());
        return !!(hasAvatar && hasGarment);
      },

      isCurrentWorkflowValid: () => {
        const { activeWorkflow } = get();
        const validators = {
          classic: get().isClassicWorkflowValid,
          "product-to-model": get().isProductToModelWorkflowValid,
          "text-to-fashion": get().isTextToFashionWorkflowValid,
          avatar: get().isAvatarWorkflowValid,
        };
        return validators[activeWorkflow]();
      },

      // Data Getters
      getCurrentWorkflowData: () => {
        const { activeWorkflow, workflowData } = get();
        return workflowData[activeWorkflow];
      },

      getWorkflowProgress: () => {
        const { currentStep, totalSteps } = get();
        return Math.round((currentStep / totalSteps) * 100);
      },

      // Temporary form data management (replaces storageService)
      getTryOnFormData: () => {
        const { classic } = get().workflowData;
        if (
          !classic.selfImage &&
          !classic.modelImage &&
          !classic.dressImage &&
          !classic.dressDescription
        ) {
          return null;
        }

        return {
          selectedPersonImage:
            classic.selfImage || classic.modelImage || undefined,
          selectedDressImage: classic.dressImage || undefined,
          dressDescription: classic.dressDescription || undefined,
          timestamp: Date.now(), // Always current time since data is fresh
        };
      },

      clearExpiredData: () => {
        // Since Zustand persistence handles cleanup, we just need to clear current workflow
        get().resetCurrentWorkflow();
      },

      // Reset
      resetWorkflowStore: () => {
        set({
          activeWorkflow: "classic",
          workflowData: initialWorkflowData,
          currentStep: 1,
          totalSteps: 3,
          isWorkflowComplete: false,
          showWorkflowSelector: false,
          isProcessing: false,
          currentTryOnId: null,
        });
      },
    }),
    {
      name: "virtual-room-workflow",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persist workflow data and some UI state, but not processing states
        activeWorkflow: state.activeWorkflow,
        workflowData: state.workflowData,
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
      }),
    }
  )
);
