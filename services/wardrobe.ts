import { apiClient, ApiResponse } from './api';
import { Wardrobe, UserFavorites, UserStats } from '@/types/database';

// Extended Wardrobe type with try_on data (backend returns this with join)
export type WardrobeWithTryOn = Wardrobe & {
  try_on: {
    id: string;
    user_id: string;
    self_image: string | null;
    model_image: string | null;
    dress_description: string | null;
    dress_image: string | null;
    product_url: string | null;
    processing_status: string;
    result_image: string | null;
    created_at: string;
  };
};

export interface ToggleLikeRequest {
  try_on_id: string;
}

export interface AddToWardrobeRequest {
  liked?: boolean | null;
}

export interface UpdateWardrobeRequest {
  liked?: boolean | null;
}

class WardrobeService {
  // Get all wardrobe items with try_on data
  async getWardrobe(filter?: 'all' | 'liked'): Promise<WardrobeWithTryOn[]> {
    const params = filter && filter !== 'all' ? `?filter=${filter}` : '';
    const response = await apiClient.get<ApiResponse<WardrobeWithTryOn[]>>(`/wardrobe${params}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get wardrobe');
    }
    
    return response.data;
  }

  // Get favorites
  async getFavorites(): Promise<UserFavorites[]> {
    const response = await apiClient.get<ApiResponse<UserFavorites[]>>('/wardrobe/favorites');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get favorites');
    }
    
    return response.data;
  }

  // Get wardrobe statistics
  async getWardrobeStats(): Promise<UserStats> {
    const response = await apiClient.get<ApiResponse<UserStats>>('/wardrobe/stats');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get wardrobe stats');
    }
    
    return response.data;
  }

  // Toggle like status
  async toggleLike(tryOnId: string): Promise<Wardrobe> {
    const response = await apiClient.post<ApiResponse<Wardrobe>>('/wardrobe/toggle-like', {
      try_on_id: tryOnId
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to toggle like');
    }
    
    return response.data;
  }

  // Toggle dislike status
  async toggleDislike(tryOnId: string): Promise<Wardrobe> {
    const response = await apiClient.post<ApiResponse<Wardrobe>>('/wardrobe/toggle-dislike', {
      try_on_id: tryOnId
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to toggle dislike');
    }
    
    return response.data;
  }

  // Add try-on to wardrobe
  async addToWardrobe(tryOnId: string, liked?: boolean | null): Promise<Wardrobe> {
    const response = await apiClient.post<ApiResponse<Wardrobe>>(`/wardrobe/${tryOnId}`, {
      liked
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add to wardrobe');
    }
    
    return response.data;
  }

  // Update wardrobe item
  async updateWardrobeItem(tryOnId: string, updates: UpdateWardrobeRequest): Promise<Wardrobe> {
    const response = await apiClient.put<ApiResponse<Wardrobe>>(`/wardrobe/${tryOnId}`, updates);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update wardrobe item');
    }
    
    return response.data;
  }

  // Remove from wardrobe
  async removeFromWardrobe(tryOnId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/wardrobe/${tryOnId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove from wardrobe');
    }
  }

  // Get liked items
  async getLikedItems(): Promise<WardrobeWithTryOn[]> {
    return this.getWardrobe('liked');
  }

  // Check if try-on is in wardrobe
  async isInWardrobe(tryOnId: string): Promise<boolean> {
    try {
      const wardrobe = await this.getWardrobe();
      return wardrobe.some(item => item.try_on_id === tryOnId);
    } catch (error) {
      console.error('Error checking wardrobe status:', error);
      return false;
    }
  }

  // Get wardrobe item by try-on ID
  async getWardrobeItemByTryOn(tryOnId: string): Promise<Wardrobe | null> {
    try {
      const wardrobe = await this.getWardrobe();
      return wardrobe.find(item => item.try_on_id === tryOnId) || null;
    } catch (error) {
      console.error('Error getting wardrobe item:', error);
      return null;
    }
  }
}

export const wardrobeService = new WardrobeService();