import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  tryOnService,
  MultiModalTryOnRequest,
  ClassicTryOnRequest,
  ProductToModelRequest,
  TextToFashionRequest,
  AvatarTryOnRequest
} from '@/services/tryOn';
import { useTryOn } from './useTryOn';
import { TryOn, TryOnWithWardrobe } from '@/types/database';

export const useMultiModalTryOn = () => {
  const queryClient = useQueryClient();
  const { tryOns, refetch: refetchTryOns } = useTryOn();

  // Get credits balance
  const { 
    data: creditsData, 
    isLoading: isCreditsLoading,
    refetch: refetchCredits 
  } = useQuery({
    queryKey: ['credits'],
    queryFn: tryOnService.getCreditsBalance,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Multi-modal try-on mutation
  const multiModalTryOnMutation = useMutation({
    mutationFn: tryOnService.createMultiModalTryOn,
    onSuccess: (newTryOn) => {
      // Add the new try-on to the cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old ? [{ ...newTryOn, wardrobe: null }, ...old] : [{ ...newTryOn, wardrobe: null }];
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tryOns'] });
      
      // Refetch credits as they might have been consumed
      refetchCredits();
      
      // Invalidate user cache to update token balance
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Classic try-on mutation
  const classicTryOnMutation = useMutation({
    mutationFn: tryOnService.createClassicTryOn,
    onSuccess: (newTryOn) => {
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old ? [{ ...newTryOn, wardrobe: null }, ...old] : [{ ...newTryOn, wardrobe: null }];
      });
      queryClient.invalidateQueries({ queryKey: ['tryOns'] });
      refetchCredits();
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Product to model mutation
  const productToModelMutation = useMutation({
    mutationFn: tryOnService.createProductToModel,
    onSuccess: (newTryOn) => {
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old ? [{ ...newTryOn, wardrobe: null }, ...old] : [{ ...newTryOn, wardrobe: null }];
      });
      queryClient.invalidateQueries({ queryKey: ['tryOns'] });
      refetchCredits();
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Text to fashion mutation
  const textToFashionMutation = useMutation({
    mutationFn: tryOnService.createTextToFashion,
    onSuccess: (result) => {
      const newTryOn = result.model;
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old ? [{ ...newTryOn, wardrobe: null }, ...old] : [{ ...newTryOn, wardrobe: null }];
      });
      queryClient.invalidateQueries({ queryKey: ['tryOns'] });
      refetchCredits();
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Avatar try-on mutation
  const avatarTryOnMutation = useMutation({
    mutationFn: tryOnService.createAvatarTryOn,
    onSuccess: (newTryOn) => {
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old ? [{ ...newTryOn, wardrobe: null }, ...old] : [{ ...newTryOn, wardrobe: null }];
      });
      queryClient.invalidateQueries({ queryKey: ['tryOns'] });
      refetchCredits();
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Actions
  const createMultiModalTryOn = async (request: MultiModalTryOnRequest): Promise<TryOn> => {
    return multiModalTryOnMutation.mutateAsync(request);
  };

  const createClassicTryOn = async (data: ClassicTryOnRequest): Promise<TryOn> => {
    return classicTryOnMutation.mutateAsync(data);
  };

  const createProductToModel = async (data: ProductToModelRequest): Promise<TryOn> => {
    return productToModelMutation.mutateAsync(data);
  };

  const createTextToFashion = async (data: TextToFashionRequest): Promise<TryOn> => {
    const result = await textToFashionMutation.mutateAsync(data);
    return result.model;
  };

  const createAvatarTryOn = async (data: AvatarTryOnRequest): Promise<TryOn> => {
    return avatarTryOnMutation.mutateAsync(data);
  };

  // Helper function to create workflow-specific try-on
  const createWorkflowTryOn = async (workflowType: string, data: any): Promise<TryOn> => {
    switch (workflowType) {
      case 'classic':
        return createClassicTryOn(data);
      case 'product-to-model':
        return createProductToModel(data);
      case 'text-to-fashion':
        return createTextToFashion(data);
      case 'avatar':
        return createAvatarTryOn(data);
      default:
        throw new Error(`Invalid workflow type: ${workflowType}`);
    }
  };

  // Computed values
  const credits = creditsData?.credits || 0;
  const hasCredits = credits > 0;
  
  // Filter try-ons by workflow type (based on data structure)
  const classicTryOns = tryOns.filter(tryOn => 
    (tryOn.self_image || tryOn.model_image) && (tryOn.dress_image || tryOn.dress_description)
  );
  
  const processingTryOns = tryOns.filter(tryOn => 
    tryOn.processing_status === 'processing' || tryOn.processing_status === 'pending'
  );

  return {
    // Data
    tryOns,
    classicTryOns,
    processingTryOns,
    credits,
    hasCredits,
    
    // Loading states
    isCreditsLoading,
    isCreating: (
      multiModalTryOnMutation.isPending || 
      classicTryOnMutation.isPending || 
      productToModelMutation.isPending || 
      textToFashionMutation.isPending || 
      avatarTryOnMutation.isPending
    ),
    isCreatingClassic: classicTryOnMutation.isPending,
    isCreatingProductToModel: productToModelMutation.isPending,
    isCreatingTextToFashion: textToFashionMutation.isPending,
    isCreatingAvatar: avatarTryOnMutation.isPending,
    
    // Actions
    createMultiModalTryOn,
    createClassicTryOn,
    createProductToModel,
    createTextToFashion,
    createAvatarTryOn,
    createWorkflowTryOn,
    refetchTryOns,
    refetchCredits,
    
    // Errors
    createError: (
      multiModalTryOnMutation.error || 
      classicTryOnMutation.error || 
      productToModelMutation.error || 
      textToFashionMutation.error || 
      avatarTryOnMutation.error
    ),
    classicError: classicTryOnMutation.error,
    productToModelError: productToModelMutation.error,
    textToFashionError: textToFashionMutation.error,
    avatarError: avatarTryOnMutation.error,
  };
};

// Workflow-specific hooks
export const useClassicTryOn = () => {
  const { 
    createClassicTryOn,
    isCreatingClassic,
    classicError,
    credits,
    hasCredits,
    refetchCredits
  } = useMultiModalTryOn();

  return {
    createTryOn: createClassicTryOn,
    isCreating: isCreatingClassic,
    error: classicError,
    credits,
    hasCredits,
    refetchCredits,
  };
};

export const useProductToModel = () => {
  const { 
    createProductToModel,
    isCreatingProductToModel,
    productToModelError,
    credits,
    hasCredits,
    refetchCredits
  } = useMultiModalTryOn();

  return {
    createProductToModel,
    isCreating: isCreatingProductToModel,
    error: productToModelError,
    credits,
    hasCredits,
    refetchCredits,
  };
};

export const useTextToFashion = () => {
  const { 
    createTextToFashion,
    isCreatingTextToFashion,
    textToFashionError,
    credits,
    hasCredits,
    refetchCredits
  } = useMultiModalTryOn();

  return {
    createTextToFashion,
    isCreating: isCreatingTextToFashion,
    error: textToFashionError,
    credits,
    hasCredits,
    refetchCredits,
  };
};

export const useAvatarTryOn = () => {
  const { 
    createAvatarTryOn,
    isCreatingAvatar,
    avatarError,
    credits,
    hasCredits,
    refetchCredits
  } = useMultiModalTryOn();

  return {
    createAvatarTryOn,
    isCreating: isCreatingAvatar,
    error: avatarError,
    credits,
    hasCredits,
    refetchCredits,
  };
};