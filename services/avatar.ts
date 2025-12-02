import { apiClient, ApiResponse } from './api';

export interface Avatar {
  id: string;
  user_id: string;
  name: string;
  face_image_url: string;
  status: 'processing' | 'completed' | 'failed';
  processing_status: 'processing' | 'completed' | 'failed'; // Alias for status to match ResultModal interface
  avatar_image_url?: string;
  is_primary?: boolean;
  created_at: string;
}

export interface CreateAvatarRequest {
  name: string;
  face_image_url: string; // Base64 or URL
}

export interface UpdateAvatarRequest {
  name?: string;
}

export class AvatarService {
  // Create a new avatar from face photo
  async createAvatar(data: CreateAvatarRequest): Promise<Avatar> {
    console.log('[AVATAR_SERVICE] 📤 Creating avatar:', { name: data.name });
    
    const response = await apiClient.post<ApiResponse<Avatar>>('/avatars', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create avatar');
    }
    
    console.log('[AVATAR_SERVICE] ✅ Avatar created:', response.data?.id);
    return response.data!;
  }

  // Get all avatars for current user
  async getAvatars(): Promise<Avatar[]> {
    const response = await apiClient.get<ApiResponse<Avatar[]>>('/avatars');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch avatars');
    }
    
    return response.data || [];
  }

  // Get specific avatar by ID
  async getAvatar(avatarId: string): Promise<Avatar> {
    const response = await apiClient.get<ApiResponse<Avatar>>(`/avatars/${avatarId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch avatar');
    }
    
    return response.data!;
  }


  // Update avatar details
  async updateAvatar(avatarId: string, data: UpdateAvatarRequest): Promise<Avatar> {
    const response = await apiClient.put<ApiResponse<Avatar>>(`/avatars/${avatarId}`, data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update avatar');
    }
    
    return response.data!;
  }


  // Get avatar processing status
  async getAvatarStatus(avatarId: string): Promise<Avatar['status']> {
    const response = await apiClient.get<ApiResponse<{ status: Avatar['status'] }>>(`/avatars/${avatarId}/status`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get avatar status');
    }
    
    return response.data!.status;
  }

  // Retry avatar creation if it failed
  async retryAvatarCreation(avatarId: string): Promise<Avatar> {
    const response = await apiClient.post<ApiResponse<Avatar>>(`/avatars/${avatarId}/retry`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to retry avatar creation');
    }
    
    return response.data!;
  }

  // Delete avatar
  async deleteAvatar(avatarId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/avatars/${avatarId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete avatar');
    }
  }

  // Subscribe to avatar status updates (polling-based)
  subscribeAvatarUpdates(
    avatarId: string, 
    callback: (avatar: Avatar) => void
  ): () => void {
    if (!avatarId) {
      console.error('[AVATAR_SERVICE] ❌ Cannot subscribe without avatarId');
      return () => {}; // Return empty unsubscribe function
    }

    let isSubscribed = true;
    let lastStatus: Avatar['status'] | null = null;
    let pollTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const poll = async () => {
      if (!isSubscribed) return;
      
      try {
        const avatar = await this.getAvatar(avatarId);
        
        if (avatar && avatar.status !== lastStatus) {
          console.log(`[AVATAR_SERVICE] 🔄 Avatar ${avatarId} status: ${lastStatus} -> ${avatar.status}`);
          callback(avatar);
          lastStatus = avatar.status;
        }
        
        // Continue polling if still processing  
        if (avatar && avatar.status === 'processing' && isSubscribed) {
          pollTimeout = setTimeout(poll, 3000); // Poll every 3 seconds for avatars
        } else {
          console.log(`[AVATAR_SERVICE] ⏹️ Stopped polling for avatar ${avatarId}, final status: ${avatar?.status}`);
        }
      } catch (error) {
        console.error('[AVATAR_SERVICE] ❌ Error polling avatar status:', error);
        // Retry after a longer delay on error
        if (isSubscribed) {
          pollTimeout = setTimeout(poll, 8000);
        }
      }
    };
    
    // Start polling immediately
    poll();
    
    // Return unsubscribe function
    return () => {
      console.log(`[AVATAR_SERVICE] 🛑 Unsubscribing from avatar ${avatarId} updates`);
      isSubscribed = false;
      if (pollTimeout) {
        clearTimeout(pollTimeout);
        pollTimeout = null;
      }
    };
  }
}

// Export singleton instance
export const avatarService = new AvatarService();