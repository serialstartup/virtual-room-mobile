import { useState } from 'react';
import { downloadService } from '@/services/download';
import { Alert } from 'react-native';

import type { WorkflowType } from '@/services/download';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);


  // Download image to device
  const downloadImage = async (
    imageUrl: string,
    tryOnId: string,
    workflowType: WorkflowType
  ): Promise<boolean> => {
    setIsDownloading(true);
    clearError();

    try {
      const result = await downloadService.downloadImage(imageUrl, tryOnId, workflowType);
      return result;
    } catch (err) {
      console.error('Error downloading image:', err);
      const error = err instanceof Error ? err : new Error('Failed to download image');
      setError(error);
      
      Alert.alert(
        'Download Failed',
        error.message || 'Failed to download image. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  // Share image (alternative to download)
  const shareImage = async (
    imageUrl: string,
    tryOnId: string,
    workflowType: WorkflowType
  ): Promise<boolean> => {
    setIsDownloading(true);
    clearError();

    try {
      const result = await downloadService.shareImage(imageUrl, tryOnId, workflowType);
      return result;
    } catch (err) {
      console.error('Error sharing image:', err);
      const error = err instanceof Error ? err : new Error('Failed to share image');
      setError(error);
      
      Alert.alert(
        'Share Failed',
        error.message || 'Failed to share image. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  // Check if image URL is valid
  const isValidImageUrl = (url: string): boolean => {
    return downloadService.isValidImageUrl(url);
  };

  // Get download progress (for future use with large images)
  const getDownloadProgress = (downloadProgress?: any): number => {
    return downloadService.getDownloadProgress(downloadProgress);
  };

  // Generate filename with timestamp
  const generateFilename = (workflowType: WorkflowType): string => {
    return downloadService.generateFilename(workflowType);
  };

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    return downloadService.requestPermissions();
  };

  return {
    // State
    isDownloading,
    error,
    clearError,
    
    // Core functions
    downloadImage,
    shareImage,
    
    // Utility functions
    isValidImageUrl,
    getDownloadProgress,
    generateFilename,
    requestPermissions
  };
};

export default useDownload;