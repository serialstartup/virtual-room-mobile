import { apiClient, ApiResponse } from './api';
import { TryOn, TryOnWithWardrobe, CreateTryOnRequest, ProcessingStatus } from '@/types/database';

interface TryOnStatusUpdate {
  new: TryOn;
  old: TryOn;
}

// Multi-Modal Workflow Types
export interface ClassicTryOnRequest {
  self_image: string; // or model_image
  dress_image?: string;
  dress_description?: string;
}

export interface ProductToModelRequest {
  product_image: string;
  product_name: string;
  scene_prompt?: string;
}

export interface TextToFashionRequest {
  fashion_description: string;
  scene_prompt?: string;
}

export interface AvatarTryOnRequest {
  avatar_id: string;
  garment_image_url?: string;
  garment_description?: string;
  try_on_type: 'classic' | 'text-to-fashion';
}

export type MultiModalTryOnRequest = {
  workflow_type: 'classic';
  data: ClassicTryOnRequest;
} | {
  workflow_type: 'product-to-model';
  data: ProductToModelRequest;
} | {
  workflow_type: 'text-to-fashion';
  data: TextToFashionRequest;
} | {
  workflow_type: 'avatar';
  data: AvatarTryOnRequest;
};

export class TryOnService {
  // Get all try-ons for the current user
  async getTryOns(): Promise<TryOnWithWardrobe[]> {
    const response = await apiClient.get<ApiResponse<TryOnWithWardrobe[]>>('/try-on');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch try-ons');
    }
    
    return response.data || [];
  }

  // Get a specific try-on by ID
  async getTryOn(tryOnId: string): Promise<TryOn> {
    const response = await apiClient.get<ApiResponse<TryOn>>(`/try-on/${tryOnId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch try-on');
    }
    
    return response.data!;
  }

  // Create a new try-on request (legacy method)
  async createTryOn(data: CreateTryOnRequest): Promise<TryOn> {
    console.log('[TRYON_SERVICE] 📤 Creating try-on with data:', data);
    
    try {
      const response = await apiClient.post<ApiResponse<TryOn>>('/try-on/create', data);
      console.log('[TRYON_SERVICE] 📥 API Response:', response);
      
      if (!response.success) {
        console.error('[TRYON_SERVICE] ❌ API Error:', response.error);
        throw new Error(response.error || 'Failed to create try-on');
      }
      
      console.log('[TRYON_SERVICE] ✅ Try-on created successfully:', response.data);
      return response.data!;
    } catch (error: any) {
      console.error('[TRYON_SERVICE] ❌ Network/API Error:', error);
      throw error;
    }
  }

  // Multi-Modal Try-On Methods
  
  // Classic Try-On: Upload your photo and try on clothes
  async createClassicTryOn(data: ClassicTryOnRequest): Promise<TryOn> {
    console.log('[TRYON_SERVICE] 📤 Creating classic try-on:', data);
    
    const response = await apiClient.post<ApiResponse<TryOn>>('/try-on/classic', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create classic try-on');
    }
    
    return response.data!;
  }

  // Product to Model: Generate model showcase for business product images
  async createProductToModel(data: ProductToModelRequest): Promise<TryOn> {
    console.log('[TRYON_SERVICE] 📤 Creating product-to-model:', data);
    
    const response = await apiClient.post<ApiResponse<TryOn>>('/try-on/product-to-model', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create product-to-model');
    }
    
    return response.data!;
  }

  // Text to Fashion: Create complete fashion looks from text descriptions
  async createTextToFashion(data: TextToFashionRequest): Promise<{ model: TryOn }> {
    console.log('[TRYON_SERVICE] 📤 Creating text-to-fashion:', data);
    
    const response = await apiClient.post<ApiResponse<{ model: TryOn }>>('/try-on/text-to-fashion', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create text-to-fashion');
    }
    
    return response.data!;
  }

  // Avatar Try-On: Use saved avatars for consistent try-on experiences
  async createAvatarTryOn(data: AvatarTryOnRequest): Promise<TryOn> {
    console.log('[TRYON_SERVICE] 📤 Creating avatar try-on:', data);
    
    const response = await apiClient.post<ApiResponse<TryOn>>('/try-on/avatar', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create avatar try-on');
    }
    
    return response.data!;
  }

  // Unified Multi-Modal Try-On Method
  async createMultiModalTryOn(request: MultiModalTryOnRequest): Promise<TryOn> {
    console.log('[TRYON_SERVICE] 📤 Creating multi-modal try-on:', request.workflow_type);
    
    switch (request.workflow_type) {
      case 'classic':
        return this.createClassicTryOn(request.data);
      case 'product-to-model':
        return this.createProductToModel(request.data);
      case 'text-to-fashion':
        const result = await this.createTextToFashion(request.data);
        return result.model;
      case 'avatar':
        return this.createAvatarTryOn(request.data);
      default:
        throw new Error('Invalid workflow type');
    }
  }

  // Update a try-on
  async updateTryOn(tryOnId: string, updates: Partial<TryOn>): Promise<TryOn> {
    const response = await apiClient.put<ApiResponse<TryOn>>(`/try-on/${tryOnId}`, updates);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update try-on');
    }
    
    return response.data!;
  }

  // Delete a try-on
  async deleteTryOn(tryOnId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/try-on/${tryOnId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete try-on');
    }
  }

  // Get processing status for a specific try-on
  async getProcessingStatus(tryOnId: string): Promise<ProcessingStatus> {
    const response = await apiClient.get<ApiResponse<{ processing_status: ProcessingStatus }>>(`/try-on/${tryOnId}/status`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get processing status');
    }
    
    return response.data!.processing_status;
  }

  // Get credits balance
  async getCreditsBalance(): Promise<{ credits: number }> {
    const response = await apiClient.get<ApiResponse<{ credits: number }>>('/try-on/credits');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get credits balance');
    }
    
    return response.data!;
  }

  // Subscribe to try-on updates (WebSocket or polling-based)
  // For now, we'll implement a simple polling mechanism
  subscribeTryOnUpdates(
    tryOnId: string, 
    callback: (update: TryOnStatusUpdate) => void
  ): () => void {
    let isSubscribed = true;
    let lastStatus: ProcessingStatus | null = null;
    
    const poll = async () => {
      if (!isSubscribed) return;
      
      try {
        const tryOn = await this.getTryOn(tryOnId);
        
        if (tryOn.processing_status !== lastStatus) {
          const update: TryOnStatusUpdate = {
            new: tryOn,
            old: { ...tryOn, processing_status: (lastStatus || 'pending') as ProcessingStatus }
          };
          
          callback(update);
          lastStatus = tryOn.processing_status;
        }
        
        // Continue polling if still processing  
        const status = tryOn.processing_status as ProcessingStatus;
        if (status === 'pending' || status === 'processing') {
          setTimeout(poll, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('[TRYON_SERVICE] ❌ Error polling try-on status:', error);
        // Retry after a longer delay on error
        if (isSubscribed) {
          setTimeout(poll, 5000);
        }
      }
    };
    
    // Start polling immediately
    poll();
    
    // Return unsubscribe function
    return () => {
      isSubscribed = false;
    };
  }
}

// Export singleton instance
export const tryOnService = new TryOnService();