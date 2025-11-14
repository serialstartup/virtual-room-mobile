import { apiClient, ApiResponse } from './api';
import { TryOn, TryOnWithWardrobe, CreateTryOnRequest, ProcessingStatus } from '@/types/database';

interface TryOnStatusUpdate {
  new: TryOn;
  old: TryOn;
}

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

  // Create a new try-on request
  async createTryOn(data: CreateTryOnRequest): Promise<TryOn> {
    const response = await apiClient.post<ApiResponse<TryOn>>('/try-on/create', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create try-on');
    }
    
    return response.data!;
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
            old: { ...tryOn, processing_status: lastStatus || 'pending' as ProcessingStatus }
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
        console.error('Error polling try-on status:', error);
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