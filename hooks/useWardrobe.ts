import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wardrobeService, WardrobeWithTryOn } from '@/services/wardrobe'
import { UserStats, TryOnWithWardrobe } from '@/types/database'
import { useAuthStore } from '@/store/authStore'

export const useWardrobe = () => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  // Get all wardrobe items with try_on data
  const { 
    data: wardrobeItems, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<WardrobeWithTryOn[]>({
    queryKey: ['wardrobe'],
    queryFn: () => wardrobeService.getWardrobe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Get favorites (filtered from wardrobeItems)
  const favorites = wardrobeItems?.filter((item: WardrobeWithTryOn) => item.liked === true) || []

  // Get wardrobe stats
  const { 
    data: userStats, 
    isLoading: isStatsLoading 
  } = useQuery({
    queryKey: ['wardrobe', 'stats'],
    queryFn: wardrobeService.getWardrobeStats,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })



  // Add to wardrobe mutation
  const addToWardrobeMutation = useMutation({
    mutationFn: ({ tryOnId, liked }: { tryOnId: string; liked?: boolean | null }) =>
      wardrobeService.addToWardrobe(tryOnId, liked),
    onSuccess: (newItem, { tryOnId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'stats'] })
      
      // Update try-ons cache to include wardrobe info
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.map(item => 
          item.id === tryOnId 
            ? { ...item, wardrobe: newItem }
            : item
        ) || []
      })
    }
  })

  // Update wardrobe item mutation
  const updateWardrobeItemMutation = useMutation({
    mutationFn: ({ tryOnId, liked }: { tryOnId: string; liked?: boolean | null }) =>
      wardrobeService.updateWardrobeItem(tryOnId, { liked }),
    onSuccess: (updatedItem, { tryOnId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'stats'] })
      
      // Update try-ons cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.map(item => 
          item.id === tryOnId 
            ? { ...item, wardrobe: updatedItem }
            : item
        ) || []
      })
    }
  })

  // Remove from wardrobe mutation
  const removeFromWardrobeMutation = useMutation({
    mutationFn: wardrobeService.removeFromWardrobe,
    onSuccess: (_, tryOnId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'stats'] })
      
      // Update try-ons cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.map(item => 
          item.id === tryOnId 
            ? { ...item, wardrobe: null }
            : item
        ) || []
      })
    }
  })

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: wardrobeService.toggleLike,
    onSuccess: (updatedItem, tryOnId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'stats'] })
      
      // Update try-ons cache
      queryClient.setQueryData<TryOnWithWardrobe[]>(['tryOns'], (old) => {
        return old?.map(item => 
          item.id === tryOnId 
            ? { ...item, wardrobe: updatedItem }
            : item
        ) || []
      })
    }
  })


  // Actions
  const addToWardrobe = async (tryOnId: string, liked?: boolean | null) => {
    return addToWardrobeMutation.mutateAsync({ tryOnId, liked })
  }

  const updateWardrobeItem = async (tryOnId: string, liked?: boolean | null) => {
    return updateWardrobeItemMutation.mutateAsync({ tryOnId, liked })
  }

  const removeFromWardrobe = async (tryOnId: string) => {
    return removeFromWardrobeMutation.mutateAsync(tryOnId)
  }

  const toggleLike = async (tryOnId: string) => {
    return toggleLikeMutation.mutateAsync(tryOnId)
  }


  return {
    // Data
    wardrobeItems: wardrobeItems || [],
    favorites: favorites || [],
    userStats,
    
    // Loading states
    isLoading,
    isStatsLoading,
    isAddingToWardrobe: addToWardrobeMutation.isPending,
    isUpdatingWardrobe: updateWardrobeItemMutation.isPending,
    isRemovingFromWardrobe: removeFromWardrobeMutation.isPending,
    isTogglingLike: toggleLikeMutation.isPending,
    
    // Actions
    addToWardrobe,
    updateWardrobeItem,
    removeFromWardrobe,
    toggleLike,
    refetch,
    
    // Errors
    error,
    addToWardrobeError: addToWardrobeMutation.error,
    updateWardrobeError: updateWardrobeItemMutation.error,
    removeFromWardrobeError: removeFromWardrobeMutation.error,
    toggleLikeError: toggleLikeMutation.error,
  }
}