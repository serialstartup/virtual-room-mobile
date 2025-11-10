import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wardrobeService } from '@/services/wardrobe'
import { Wardrobe, UserFavorites, UserStats, TryOnWithWardrobe } from '@/types/database'

export const useWardrobe = () => {
  const queryClient = useQueryClient()

  // Get all wardrobe items
  const { 
    data: wardrobeItems, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['wardrobe'],
    queryFn: wardrobeService.getWardrobe,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Get favorites
  const { 
    data: favorites, 
    isLoading: isFavoritesLoading 
  } = useQuery({
    queryKey: ['wardrobe', 'favorites'],
    queryFn: wardrobeService.getFavorites,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Get disliked items
  const { 
    data: disliked, 
    isLoading: isDislikedLoading 
  } = useQuery({
    queryKey: ['wardrobe', 'disliked'],
    queryFn: wardrobeService.getDisliked,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Get undecided items
  const { 
    data: undecided, 
    isLoading: isUndecidedLoading 
  } = useQuery({
    queryKey: ['wardrobe', 'undecided'],
    queryFn: wardrobeService.getUndecided,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Get user stats
  const { 
    data: userStats, 
    isLoading: isStatsLoading 
  } = useQuery({
    queryKey: ['wardrobe', 'stats'],
    queryFn: wardrobeService.getUserStats,
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
      wardrobeService.updateWardrobeItem(tryOnId, { try_on_id: tryOnId, liked }),
    onSuccess: (updatedItem, { tryOnId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'favorites'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'disliked'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'undecided'] })
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
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'favorites'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'undecided'] })
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

  // Toggle dislike mutation
  const toggleDislikeMutation = useMutation({
    mutationFn: wardrobeService.toggleDislike,
    onSuccess: (updatedItem, tryOnId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['wardrobe'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'disliked'] })
      queryClient.invalidateQueries({ queryKey: ['wardrobe', 'undecided'] })
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

  const toggleDislike = async (tryOnId: string) => {
    return toggleDislikeMutation.mutateAsync(tryOnId)
  }

  return {
    // Data
    wardrobeItems: wardrobeItems || [],
    favorites: favorites || [],
    disliked: disliked || [],
    undecided: undecided || [],
    userStats,
    
    // Loading states
    isLoading,
    isFavoritesLoading,
    isDislikedLoading,
    isUndecidedLoading,
    isStatsLoading,
    isAddingToWardrobe: addToWardrobeMutation.isPending,
    isUpdatingWardrobe: updateWardrobeItemMutation.isPending,
    isRemovingFromWardrobe: removeFromWardrobeMutation.isPending,
    isTogglingLike: toggleLikeMutation.isPending,
    isTogglingDislike: toggleDislikeMutation.isPending,
    
    // Actions
    addToWardrobe,
    updateWardrobeItem,
    removeFromWardrobe,
    toggleLike,
    toggleDislike,
    refetch,
    
    // Errors
    error,
    addToWardrobeError: addToWardrobeMutation.error,
    updateWardrobeError: updateWardrobeItemMutation.error,
    removeFromWardrobeError: removeFromWardrobeMutation.error,
    toggleLikeError: toggleLikeMutation.error,
    toggleDislikeError: toggleDislikeMutation.error,
  }
}