import { useState } from 'react';
import { feedbackService } from '@/services/feedback';
import { useUser } from '@/hooks/useUser';
import { Alert } from 'react-native';

import type { 
  FeedbackType, 
  FeedbackSource, 
  WorkflowType, 
  TryOnFeedback 
} from '@/services/feedback';

// Re-export types for convenience
export type { FeedbackType, WorkflowType, FeedbackSource, TryOnFeedback };

export const useFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const clearError = () => setError(null);

  // Get existing feedback for a specific try-on and source
  const getFeedback = async (
    tryOnId: string,
    feedbackSource: FeedbackSource
  ): Promise<TryOnFeedback | null> => {
    try {
      if (!user?.id) {
        throw new Error('User must be logged in to get feedback');
      }

      return await feedbackService.getFeedback(tryOnId, feedbackSource);
    } catch (err) {
      console.error('Error getting feedback:', err);
      setError(err instanceof Error ? err : new Error('Failed to get feedback'));
      return null;
    }
  };

  // Set or update feedback
  const setFeedback = async (
    tryOnId: string,
    tryOnType: WorkflowType,
    feedbackSource: FeedbackSource,
    feedbackType: FeedbackType
  ): Promise<boolean> => {
    if (!user?.id) {
      setError(new Error('User must be logged in to provide feedback'));
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      await feedbackService.setFeedback(tryOnId, tryOnType, feedbackSource, feedbackType);

      console.log(`✅ [FEEDBACK] ${feedbackSource} feedback set:`, {
        tryOnId,
        tryOnType,
        feedbackType
      });

      return true;
    } catch (err) {
      console.error('Error setting feedback:', err);
      const error = err instanceof Error ? err : new Error('Failed to set feedback');
      setError(error);
      Alert.alert('Feedback Error', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove feedback
  const removeFeedback = async (
    tryOnId: string,
    feedbackSource: FeedbackSource
  ): Promise<boolean> => {
    if (!user?.id) {
      setError(new Error('User must be logged in to remove feedback'));
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      await feedbackService.removeFeedback(tryOnId, feedbackSource);

      console.log(`✅ [FEEDBACK] ${feedbackSource} feedback removed:`, { tryOnId });
      return true;
    } catch (err) {
      console.error('Error removing feedback:', err);
      const error = err instanceof Error ? err : new Error('Failed to remove feedback');
      setError(error);
      Alert.alert('Feedback Error', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle thumbs feedback (like/dislike)
  const toggleThumbsFeedback = async (
    tryOnId: string,
    tryOnType: WorkflowType,
    newFeedbackType: FeedbackType
  ): Promise<FeedbackType | null> => {
    try {
      return await feedbackService.toggleThumbsFeedback(tryOnId, tryOnType, newFeedbackType);
    } catch (err) {
      console.error('Error toggling thumbs feedback:', err);
      const error = err instanceof Error ? err : new Error('Failed to toggle thumbs feedback');
      setError(error);
      Alert.alert('Feedback Error', error.message);
      return null;
    }
  };

  // Toggle heart feedback (favorite)
  const toggleHeartFeedback = async (
    tryOnId: string,
    tryOnType: WorkflowType
  ): Promise<boolean> => {
    try {
      return await feedbackService.toggleHeartFeedback(tryOnId, tryOnType);
    } catch (err) {
      console.error('Error toggling heart feedback:', err);
      const error = err instanceof Error ? err : new Error('Failed to toggle heart feedback');
      setError(error);
      Alert.alert('Feedback Error', error.message);
      return false;
    }
  };

  // Get all feedback for a user (for analytics)
  const getUserFeedback = async (): Promise<TryOnFeedback[]> => {
    if (!user?.id) return [];

    try {
      return await feedbackService.getUserFeedback();
    } catch (err) {
      console.error('Error getting user feedback:', err);
      setError(err instanceof Error ? err : new Error('Failed to get user feedback'));
      return [];
    }
  };

  // Check if try-on is liked (heart feedback)
  const isLiked = async (tryOnId: string): Promise<boolean> => {
    try {
      return await feedbackService.isLiked(tryOnId);
    } catch (err) {
      console.error('Error checking if liked:', err);
      return false;
    }
  };

  // Get thumbs feedback type
  const getThumbsFeedback = async (tryOnId: string): Promise<FeedbackType | null> => {
    try {
      return await feedbackService.getThumbsFeedback(tryOnId);
    } catch (err) {
      console.error('Error getting thumbs feedback:', err);
      return null;
    }
  };

  return {
    // State
    isLoading,
    error,
    clearError,
    
    // Core functions
    getFeedback,
    setFeedback,
    removeFeedback,
    
    // Helper functions
    toggleThumbsFeedback,
    toggleHeartFeedback,
    getUserFeedback,
    isLiked,
    getThumbsFeedback
  };
};

export default useFeedback;