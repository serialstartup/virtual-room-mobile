import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  customModelsService, 
  CustomModel, 
  CreateCustomModelRequest,
  CreateTextToModelRequest,
  CreateProductToModelRequest,
  UpdateCustomModelRequest 
} from '@/services/customModels';

export const useCustomModels = () => {
  const queryClient = useQueryClient();

  // Get all custom models
  const { 
    data: customModels, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['customModels'],
    queryFn: customModelsService.getCustomModels,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create custom model mutation (generic)
  const createCustomModelMutation = useMutation({
    mutationFn: customModelsService.createCustomModel,
    onSuccess: (newModel) => {
      // Add the new model to the cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before spreading
        const oldArray = Array.isArray(old) ? old : [];
        return [newModel, ...oldArray];
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['customModels'] });
      
      // Invalidate user cache to update token balance
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Create text-to-model mutation
  const createTextToModelMutation = useMutation({
    mutationFn: customModelsService.createTextToModel,
    onSuccess: (newModel) => {
      // Add the new model to the cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before spreading
        const oldArray = Array.isArray(old) ? old : [];
        return [newModel, ...oldArray];
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['customModels'] });
      
      // Invalidate user cache to update token balance
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Create product-to-model mutation
  const createProductToModelMutation = useMutation({
    mutationFn: customModelsService.createProductToModel,
    onSuccess: (newModel) => {
      // Add the new model to the cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before spreading
        const oldArray = Array.isArray(old) ? old : [];
        return [newModel, ...oldArray];
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['customModels'] });
      
      // Invalidate user cache to update token balance
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Update custom model mutation
  const updateCustomModelMutation = useMutation({
    mutationFn: ({ modelId, data }: { modelId: string; data: UpdateCustomModelRequest }) =>
      customModelsService.updateCustomModel(modelId, data),
    onSuccess: (updatedModel, { modelId }) => {
      // Update the specific model in cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before mapping
        const oldArray = Array.isArray(old) ? old : [];
        return oldArray.map(model => 
          model.id === modelId ? updatedModel : model
        );
      });
      
      // Update single model cache if it exists
      queryClient.setQueryData(['customModel', modelId], updatedModel);
    }
  });

  // Retry model creation mutation
  const retryModelMutation = useMutation({
    mutationFn: customModelsService.retryModelCreation,
    onSuccess: (updatedModel, modelId) => {
      // Update the specific model in cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before mapping
        const oldArray = Array.isArray(old) ? old : [];
        return oldArray.map(model => 
          model.id === modelId ? updatedModel : model
        );
      });
      
      // Update single model cache
      queryClient.setQueryData(['customModel', modelId], updatedModel);
    }
  });

  // Delete custom model mutation
  const deleteCustomModelMutation = useMutation({
    mutationFn: customModelsService.deleteCustomModel,
    onSuccess: (_, modelId) => {
      // Remove from cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before filtering
        const oldArray = Array.isArray(old) ? old : [];
        return oldArray.filter(model => model.id !== modelId);
      });
      
      // Remove single model cache
      queryClient.removeQueries({ queryKey: ['customModel', modelId] });
    }
  });

  // Actions
  const createCustomModel = async (data: CreateCustomModelRequest) => {
    return createCustomModelMutation.mutateAsync(data);
  };

  const createTextToModel = async (data: CreateTextToModelRequest) => {
    return createTextToModelMutation.mutateAsync(data);
  };

  const createProductToModel = async (data: CreateProductToModelRequest) => {
    return createProductToModelMutation.mutateAsync(data);
  };

  const updateCustomModel = async (modelId: string, data: UpdateCustomModelRequest) => {
    return updateCustomModelMutation.mutateAsync({ modelId, data });
  };

  const retryModel = async (modelId: string) => {
    return retryModelMutation.mutateAsync(modelId);
  };

  const deleteCustomModel = async (modelId: string) => {
    return deleteCustomModelMutation.mutateAsync(modelId);
  };

  // Computed values
  const textToModels = customModels?.filter(model => model.model_type === 'model-create') || [];
  const productToModels = customModels?.filter(model => model.model_type === 'product-to-model') || [];
  const processingModels = customModels?.filter(model => model.status === 'processing') || [];
  const completedModels = customModels?.filter(model => model.status === 'completed') || [];
  const failedModels = customModels?.filter(model => model.status === 'failed') || [];

  return {
    // Data
    customModels: customModels || [],
    textToModels,
    productToModels,
    processingModels,
    completedModels,
    failedModels,
    
    // Loading states
    isLoading,
    isCreating: createCustomModelMutation.isPending || createTextToModelMutation.isPending || createProductToModelMutation.isPending,
    isUpdating: updateCustomModelMutation.isPending,
    isRetrying: retryModelMutation.isPending,
    isDeleting: deleteCustomModelMutation.isPending,
    
    // Actions
    createCustomModel,
    createTextToModel,
    createProductToModel,
    updateCustomModel,
    retryModel,
    deleteCustomModel,
    refetch,
    
    // Errors
    error,
    createError: createCustomModelMutation.error || createTextToModelMutation.error || createProductToModelMutation.error,
    updateError: updateCustomModelMutation.error,
    retryError: retryModelMutation.error,
    deleteError: deleteCustomModelMutation.error,
  };
};

// Hook for single custom model
export const useCustomModelById = (modelId: string) => {
  const queryClient = useQueryClient();

  const { 
    data: customModel, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['customModel', modelId],
    queryFn: () => customModelsService.getCustomModel(modelId),
    enabled: !!modelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscribe to processing status updates
  const subscribeToUpdates = (callback: (model: CustomModel) => void) => {
    return customModelsService.subscribeModelUpdates(modelId, (updatedModel) => {
      // Update the cache
      queryClient.setQueryData(['customModel', modelId], updatedModel);
      
      // Update the models list cache
      queryClient.setQueryData<CustomModel[]>(['customModels'], (old) => {
        // Ensure old is an array before mapping
        const oldArray = Array.isArray(old) ? old : [];
        return oldArray.map(item => 
          item.id === modelId ? updatedModel : item
        );
      });
      
      // Call the callback with the updated model
      callback(updatedModel);
    });
  };

  return {
    customModel,
    isLoading,
    error,
    subscribeToUpdates,
  };
};

// Hook for custom model status tracking
export const useCustomModelStatus = (modelId: string) => {
  return useQuery({
    queryKey: ['customModel', modelId, 'status'],
    queryFn: () => customModelsService.getModelStatus(modelId),
    enabled: !!modelId,
    refetchInterval: (query) => {
      // Stop polling when status is completed or failed
      const status = query.state.data;
      return status === 'completed' || status === 'failed' ? false : 5000;
    },
    staleTime: 0, // Always refetch
  });
};

// Hooks for specific model types
export const useTextToModels = () => {
  return useQuery({
    queryKey: ['customModels', 'text-to-model'],
    queryFn: customModelsService.getTextToModels,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useProductToModels = () => {
  return useQuery({
    queryKey: ['customModels', 'product-to-model'],
    queryFn: customModelsService.getProductToModels,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};