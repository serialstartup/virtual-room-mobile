import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

export interface UserAvatar {
  id: string;
  name: string;
  avatar_image_url: string;
  face_image_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface UseUserAvatarsReturn {
  avatars: UserAvatar[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useUserAvatars = (): UseUserAvatarsReturn => {
  const [avatars, setAvatars] = useState<UserAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAvatars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get('/avatars');
      
      if (response.success && response.data?.avatars) {
        const avatarList = response.data.avatars;
        
        // Filter only completed avatars for reuse
        const completedAvatars = avatarList.filter(
          (avatar: UserAvatar) => avatar.status === 'completed' && avatar.avatar_image_url
        );
        setAvatars(completedAvatars);
      } else {
        setAvatars([]);
      }
    } catch (err: any) {
      console.error('[useUserAvatars] Error fetching avatars:', err);
      
      // Handle authentication errors gracefully
      if (err.message?.includes('User not authenticated')) {
        setError(new Error('Authentication required'));
      } else {
        setError(new Error(err.response?.data?.error || 'Failed to load avatars'));
      }
      setAvatars([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return {
    avatars,
    isLoading,
    error,
    refetch: fetchAvatars,
  };
};