import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { avatarService, Avatar, CreateAvatarRequest, UpdateAvatarRequest } from '@/services/avatar';

export const useAvatar = () => {
  const queryClient = useQueryClient();

  // Get all avatars
  const { 
    data: avatars, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['avatars'],
    queryFn: avatarService.getAvatars,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });


  // Create avatar mutation
  const createAvatarMutation = useMutation({
    mutationFn: avatarService.createAvatar,
    onSuccess: (newAvatar) => {
      // Add the new avatar to the cache
      queryClient.setQueryData<Avatar[]>(['avatars'], (old) => {
        // Ensure old is an array before spreading
        const oldArray = Array.isArray(old) ? old : [];
        return [newAvatar, ...oldArray];
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['avatars'] });
      
      // Invalidate user cache to update token balance
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  });

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: ({ avatarId, data }: { avatarId: string; data: UpdateAvatarRequest }) =>
      avatarService.updateAvatar(avatarId, data),
    onSuccess: (updatedAvatar, { avatarId }) => {
      // Update the specific avatar in cache
      queryClient.setQueryData<Avatar[]>(['avatars'], (old) => {
        return old?.map(avatar => 
          avatar.id === avatarId ? updatedAvatar : avatar
        ) || [];
      });
      
      // Update single avatar cache if it exists
      queryClient.setQueryData(['avatar', avatarId], updatedAvatar);
    }
  });


  // Retry avatar creation mutation
  const retryAvatarMutation = useMutation({
    mutationFn: avatarService.retryAvatarCreation,
    onSuccess: (updatedAvatar, avatarId) => {
      // Update the specific avatar in cache
      queryClient.setQueryData<Avatar[]>(['avatars'], (old) => {
        return old?.map(avatar => 
          avatar.id === avatarId ? updatedAvatar : avatar
        ) || [];
      });
      
      // Update single avatar cache
      queryClient.setQueryData(['avatar', avatarId], updatedAvatar);
    }
  });

  // Delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: avatarService.deleteAvatar,
    onSuccess: (_, avatarId) => {
      // Remove from cache
      queryClient.setQueryData<Avatar[]>(['avatars'], (old) => {
        return old?.filter(avatar => avatar.id !== avatarId) || [];
      });
      
      // Remove single avatar cache
      queryClient.removeQueries({ queryKey: ['avatar', avatarId] });
    }
  });

  // Actions
  const createAvatar = async (data: CreateAvatarRequest) => {
    return createAvatarMutation.mutateAsync(data);
  };

  const updateAvatar = async (avatarId: string, data: UpdateAvatarRequest) => {
    return updateAvatarMutation.mutateAsync({ avatarId, data });
  };


  const retryAvatar = async (avatarId: string) => {
    return retryAvatarMutation.mutateAsync(avatarId);
  };

  const deleteAvatar = async (avatarId: string) => {
    return deleteAvatarMutation.mutateAsync(avatarId);
  };

  return {
    // Data
    avatars: avatars || [],
    
    // Loading states
    isLoading,
    isCreating: createAvatarMutation.isPending,
    isUpdating: updateAvatarMutation.isPending,
    isRetrying: retryAvatarMutation.isPending,
    isDeleting: deleteAvatarMutation.isPending,
    
    // Actions
    createAvatar,
    updateAvatar,
    retryAvatar,
    deleteAvatar,
    refetch,
    
    // Errors
    error,
    createError: createAvatarMutation.error,
    updateError: updateAvatarMutation.error,
    retryError: retryAvatarMutation.error,
    deleteError: deleteAvatarMutation.error,
  };
};

// Hook for single avatar
export const useAvatarById = (avatarId: string) => {
  const queryClient = useQueryClient();

  const { 
    data: avatar, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['avatar', avatarId],
    queryFn: () => avatarService.getAvatar(avatarId),
    enabled: !!avatarId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Subscribe to processing status updates
  const subscribeToUpdates = (callback: (avatar: Avatar) => void) => {
    return avatarService.subscribeAvatarUpdates(avatarId, (updatedAvatar) => {
      // Update the cache
      queryClient.setQueryData(['avatar', avatarId], updatedAvatar);
      
      // Update the avatars list cache
      queryClient.setQueryData<Avatar[]>(['avatars'], (old) => {
        // Ensure old is an array before mapping
        const oldArray = Array.isArray(old) ? old : [];
        return oldArray.map(item => 
          item.id === avatarId ? updatedAvatar : item
        );
      });
      
      // Call the callback with the updated avatar
      callback(updatedAvatar);
    });
  };

  return {
    avatar,
    isLoading,
    error,
    subscribeToUpdates,
  };
};

// Hook for avatar status tracking
export const useAvatarStatus = (avatarId: string) => {
  return useQuery({
    queryKey: ['avatar', avatarId, 'status'],
    queryFn: () => avatarService.getAvatarStatus(avatarId),
    enabled: !!avatarId,
    refetchInterval: (query) => {
      // Stop polling when status is completed or failed
      const status = query.state.data;
      return status === 'completed' || status === 'failed' ? false : 3000;
    },
    staleTime: 0, // Always refetch
  });
};