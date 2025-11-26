import { apiClient } from './api';

export type FeedbackType = 'like' | 'dislike' | 'neutral';
export type FeedbackSource = 'heart' | 'thumbs';
export type WorkflowType = 'classic' | 'avatar' | 'text-to-fashion' | 'product-to-model';

export interface TryOnFeedback {
  id: string;
  user_id: string;
  try_on_id: string;
  try_on_type: WorkflowType;
  feedback_type: FeedbackType;
  feedback_source: FeedbackSource;
  created_at: string;
  updated_at: string;
}

export interface FeedbackStats {
  total_try_ons: number;
  favorites_count: number;
  disliked_count: number;
  undecided_count: number;
  satisfied_count: number;
  dissatisfied_count: number;
  created_at: string;
  updated_at: string;
}

export const feedbackService = {
  // Get existing feedback for a specific try-on and source
  async getFeedback(
    tryOnId: string,
    feedbackSource: FeedbackSource
  ): Promise<TryOnFeedback | null> {
    try {
      
      const response = await apiClient.get(`/feedback/try-on`, {
        params: { try_on_id: tryOnId, feedback_source: feedbackSource }
      });

      if (response?.success && response?.feedback) {
        return response.feedback;
      }

      return null;
    } catch (error: any) {
      if (error.message?.includes('User not authenticated')) {
        console.warn('[FeedbackService] ⚠️ User not authenticated - skipping feedback load');
        return null; // Silently fail for auth errors
      }
      
      if (error.response?.status === 404) {
        return null; // No feedback found
      }
      
      console.error('[FeedbackService] Error getting feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to get feedback');
    }
  },

  // Set or update feedback
  async setFeedback(
    tryOnId: string,
    tryOnType: WorkflowType,
    feedbackSource: FeedbackSource,
    feedbackType: FeedbackType
  ): Promise<TryOnFeedback> {
    try {

      const response = await apiClient.post('/feedback/try-on', {
        try_on_id: tryOnId,
        try_on_type: tryOnType,
        feedback_source: feedbackSource,
        feedback_type: feedbackType
      });

      if (response?.success && response?.feedback) {
        return response.feedback;
      }

      throw new Error('Failed to set feedback');
    } catch (error: any) {
      if (error.message?.includes('User not authenticated')) {
        console.warn('[FeedbackService] ⚠️ User not authenticated - cannot set feedback');
        throw error; // Re-throw auth errors
      }
      
      console.error('[FeedbackService] Error setting feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to set feedback');
    }
  },

  // Remove feedback
  async removeFeedback(
    tryOnId: string,
    feedbackSource: FeedbackSource
  ): Promise<void> {
    try {

      const response = await apiClient.delete(`/feedback/try-on`, {
        params: { try_on_id: tryOnId, feedback_source: feedbackSource }
      });

      if (response.success) {
        return;
      }

      throw new Error('Failed to remove feedback');
    } catch (error: any) {
      console.error('[FeedbackService] Error removing feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to remove feedback');
    }
  },

  // Toggle thumbs feedback (like/dislike)
  async toggleThumbsFeedback(
    tryOnId: string,
    tryOnType: WorkflowType,
    newFeedbackType: FeedbackType
  ): Promise<FeedbackType | null> {
    try {
      const currentFeedback = await this.getFeedback(tryOnId, 'thumbs');
      
      // If same feedback type, remove it (toggle off)
      if (currentFeedback?.feedback_type === newFeedbackType) {
        await this.removeFeedback(tryOnId, 'thumbs');
        return null;
      }
      
      // Set new feedback type
      const updatedFeedback = await this.setFeedback(tryOnId, tryOnType, 'thumbs', newFeedbackType);
      return updatedFeedback.feedback_type;
    } catch (error) {
      console.error('[FeedbackService] Error toggling thumbs feedback:', error);
      throw error;
    }
  },

  // Toggle heart feedback (favorite)
  async toggleHeartFeedback(
    tryOnId: string,
    tryOnType: WorkflowType
  ): Promise<boolean> {
    try {
      const currentFeedback = await this.getFeedback(tryOnId, 'heart');
      
      if (currentFeedback) {
        // Remove existing heart feedback
        await this.removeFeedback(tryOnId, 'heart');
        return false; // Not liked anymore
      } else {
        // Add heart feedback
        await this.setFeedback(tryOnId, tryOnType, 'heart', 'like');
        return true; // Liked
      }
    } catch (error) {
      console.error('[FeedbackService] Error toggling heart feedback:', error);
      throw error;
    }
  },

  // Get all feedback for a user (for analytics)
  async getUserFeedback(): Promise<TryOnFeedback[]> {
    try {
      const response = await apiClient.get('/feedback/user');

      if (response.success && response.data?.feedback) {
        return response.data.feedback;
      }

      return [];
    } catch (error: any) {
      console.error('[FeedbackService] Error getting user feedback:', error);
      throw new Error(error.response?.data?.error || 'Failed to get user feedback');
    }
  },

  // Check if try-on is liked (heart feedback)
  async isLiked(tryOnId: string): Promise<boolean> {
    try {
      const feedback = await this.getFeedback(tryOnId, 'heart');
      return feedback?.feedback_type === 'like';
    } catch (error) {
      console.error('[FeedbackService] Error checking if liked:', error);
      return false;
    }
  },

  // Get thumbs feedback type
  async getThumbsFeedback(tryOnId: string): Promise<FeedbackType | null> {
    try {
      const feedback = await this.getFeedback(tryOnId, 'thumbs');
      return feedback?.feedback_type || null;
    } catch (error) {
      console.error('[FeedbackService] Error getting thumbs feedback:', error);
      return null;
    }
  },

  // Get user feedback statistics
  async getUserFeedbackStats(): Promise<FeedbackStats> {
    try {
      const response = await apiClient.get('/feedback/stats');

      if (response.success && response.data?.stats) {
        return response.data.stats;
      }

      // Return default stats if none found
      return {
        total_try_ons: 0,
        favorites_count: 0,
        disliked_count: 0,
        undecided_count: 0,
        satisfied_count: 0,
        dissatisfied_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('[FeedbackService] Error getting user feedback stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to get user feedback stats');
    }
  }
};