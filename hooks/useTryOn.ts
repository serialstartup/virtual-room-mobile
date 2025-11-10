import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tryOnService } from '@/services/tryOn'
import { CreateTryOnRequest, TryOn, TryOnWithWardrobe } from '@/types/database'

export const useTryOn = () => {
  const queryClient = useQueryClient()

  // Get all try-ons
  const { 
    data: tryOns, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['tryOns'],
    queryFn: tryOnService.getTryOns,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Create try-on mutation
  const createTryOnMutation = useMutation({
    mutationFn: tryOnService.createTryOn,
    onSuccess: (newTryOn) => {
      // Add the new try-on to the cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old ? [{ ...newTryOn, wardrobe: null }, ...old] : [{ ...newTryOn, wardrobe: null }]
      })
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tryOns'] })
    }
  })

  // Update try-on mutation
  const updateTryOnMutation = useMutation({
    mutationFn: ({ tryOnId, updates }: { tryOnId: string; updates: Partial<TryOn> }) =>
      tryOnService.updateTryOn(tryOnId, updates),
    onSuccess: (updatedTryOn, { tryOnId }) => {
      // Update the specific try-on in cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.map(item => 
          item.id === tryOnId 
            ? { ...item, ...updatedTryOn }
            : item
        ) || []
      })
      
      // Update single try-on cache if it exists
      queryClient.setQueryData(['tryOn', tryOnId], updatedTryOn)
    }
  })

  // Delete try-on mutation
  const deleteTryOnMutation = useMutation({
    mutationFn: tryOnService.deleteTryOn,
    onSuccess: (_, tryOnId) => {
      // Remove from cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.filter(item => item.id !== tryOnId) || []
      })
      
      // Remove single try-on cache
      queryClient.removeQueries({ queryKey: ['tryOn', tryOnId] })
      
      // Invalidate wardrobe since it might be affected
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
    }
  })

  // Actions
  const createTryOn = async (data: CreateTryOnRequest) => {
    return createTryOnMutation.mutateAsync(data)
  }

  const updateTryOn = async (tryOnId: string, updates: Partial<TryOn>) => {
    return updateTryOnMutation.mutateAsync({ tryOnId, updates })
  }

  const deleteTryOn = async (tryOnId: string) => {
    return deleteTryOnMutation.mutateAsync(tryOnId)
  }

  return {
    // Data
    tryOns: tryOns || [],
    
    // Loading states
    isLoading,
    isCreating: createTryOnMutation.isPending,
    isUpdating: updateTryOnMutation.isPending,
    isDeleting: deleteTryOnMutation.isPending,
    
    // Actions
    createTryOn,
    updateTryOn,
    deleteTryOn,
    refetch,
    
    // Errors
    error,
    createError: createTryOnMutation.error,
    updateError: updateTryOnMutation.error,
    deleteError: deleteTryOnMutation.error,
  }
}

// Hook for single try-on
export const useTryOnById = (tryOnId: string) => {
  const queryClient = useQueryClient()

  const { 
    data: tryOn, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['tryOn', tryOnId],
    queryFn: () => tryOnService.getTryOn(tryOnId),
    enabled: !!tryOnId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Subscribe to processing status updates
  const subscribeToUpdates = (callback: (status: string) => void) => {
    return tryOnService.subscribeTryOnUpdates(tryOnId, (payload) => {
      const updatedTryOn = payload.new
      
      // Update the cache
      queryClient.setQueryData(['tryOn', tryOnId], updatedTryOn)
      
      // Update the try-ons list cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.map(item => 
          item.id === tryOnId 
            ? { ...item, ...updatedTryOn }
            : item
        ) || []
      })
      
      // Call the callback with the new status
      callback(updatedTryOn.processing_status)
    })
  }

  return {
    tryOn,
    isLoading,
    error,
    subscribeToUpdates,
  }
}

// Hook for processing status tracking
export const useProcessingStatus = (tryOnId: string) => {
  return useQuery({
    queryKey: ['tryOn', tryOnId, 'status'],
    queryFn: () => tryOnService.getProcessingStatus(tryOnId),
    enabled: !!tryOnId,
    refetchInterval: (query) => {
      // Stop polling when status is completed or failed
      const status = query.state.data
      return status === 'completed' || status === 'failed' ? false : 2000
    },
    staleTime: 0, // Always refetch
  })
}