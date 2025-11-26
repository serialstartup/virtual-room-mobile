import { apiClient } from './api';
import { 
  downloadAsync, 
  documentDirectory, 
  cacheDirectory,
} from 'expo-file-system/legacy';
import type { DownloadProgressData } from 'expo-file-system/build/legacy/FileSystem.types';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export type WorkflowType = 'classic' | 'avatar' | 'text-to-fashion' | 'product-to-model';

export interface DownloadInfo {
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

export const downloadService = {
  // Generate filename with timestamp
  generateFilename(workflowType: WorkflowType): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `VirtualRoom_${workflowType}_${timestamp}.jpg`;
  },

  // Request media library permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to save images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {
              // You might want to add a function to open app settings
            }}
          ]
        );
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error requesting permissions:', err);
      return false;
    }
  },

  // Check if image URL is valid
  isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('http') && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png'));
  },

  // Get download info from backend
  async getDownloadInfo(
    imageUrl: string,
    tryOnId: string,
    workflowType: WorkflowType
  ): Promise<DownloadInfo> {
    try {
      console.log(`📥 [DownloadService] Getting download info:`, {
        imageUrl,
        tryOnId,
        workflowType
      });

      const response = await apiClient.post('/download/info', {
        image_url: imageUrl,
        try_on_id: tryOnId,
        workflow_type: workflowType
      });

      if (response.success && response.data?.download_info) {
        console.log(`✅ [DownloadService] Download info retrieved:`, response.data.download_info);
        return response.data.download_info;
      }

      throw new Error('Failed to get download info');
    } catch (error: any) {
      console.error('[DownloadService] Error getting download info:', error);
      throw new Error(error.response?.data?.error || 'Failed to get download info');
    }
  },

  // Get download URL from backend
  async getDownloadUrl(imageUrl: string, workflowType: WorkflowType): Promise<string> {
    try {
      console.log(`🔗 [DownloadService] Getting download URL:`, {
        imageUrl,
        workflowType
      });

      const response = await apiClient.post('/download/url', {
        image_url: imageUrl,
        workflow_type: workflowType
      });

      if (response.success && response.data?.download_url) {
        console.log(`✅ [DownloadService] Download URL retrieved`);
        return response.data.download_url;
      }

      throw new Error('Failed to get download URL');
    } catch (error: any) {
      console.error('[DownloadService] Error getting download URL:', error);
      throw new Error(error.response?.data?.error || 'Failed to get download URL');
    }
  },

  // Log download activity
  async logDownload(
    imageUrl: string,
    tryOnId: string,
    workflowType: WorkflowType
  ): Promise<void> {
    try {
      console.log(`📊 [DownloadService] Logging download:`, {
        imageUrl,
        tryOnId,
        workflowType
      });

      await apiClient.post('/download/log', {
        image_url: imageUrl,
        try_on_id: tryOnId,
        workflow_type: workflowType
      });

      console.log(`✅ [DownloadService] Download logged successfully`);
    } catch (error: any) {
      console.error('[DownloadService] Error logging download:', error);
      // Don't throw error for logging failures
    }
  },

  // Check download permissions
  async canDownload(tryOnId: string): Promise<boolean> {
    try {
      console.log(`🔐 [DownloadService] Checking download permissions:`, { 
        tryOnId,
        typeof: typeof tryOnId,
        isValid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(tryOnId)
      });

      const response = await apiClient.get('/download/permissions', {
        params: { try_on_id: tryOnId }
      });

      if (response.success && typeof response.data?.can_download === 'boolean') {
        console.log(`✅ [DownloadService] Download permissions checked:`, response.data.can_download);
        return response.data.can_download;
      }

      return false;
    } catch (error: any) {
      if (error.message?.includes('User not authenticated')) {
        console.warn('[DownloadService] ⚠️ User not authenticated - cannot check download permissions');
        return false;
      }
      
      console.error('[DownloadService] Error checking download permissions:', error);
      return false;
    }
  },

  // Download image to device
  async downloadImage(
    imageUrl: string,
    tryOnId: string,
    workflowType: WorkflowType
  ): Promise<boolean> {
    if (!this.isValidImageUrl(imageUrl)) {
      Alert.alert('Download Error', 'Invalid image URL');
      return false;
    }

    try {
      // Check permissions first
      const canDownload = await this.canDownload(tryOnId);
      if (!canDownload) {
        Alert.alert('Download Error', 'You do not have permission to download this image');
        return false;
      }

      // Request device permissions
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        return false;
      }

      // Get download info from backend
      const downloadInfo = await this.getDownloadInfo(imageUrl, tryOnId, workflowType);
      const downloadUrl = await this.getDownloadUrl(imageUrl, workflowType);

      const fileUri = documentDirectory + downloadInfo.filename;

      console.log(`📥 [DownloadService] Starting download:`, {
        downloadUrl,
        filename: downloadInfo.filename,
        workflowType
      });

      // Download the image
      const downloadResult = await downloadAsync(downloadUrl, fileUri);
      
      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status: ${downloadResult.status}`);
      }

      console.log(`✅ [DownloadService] Image downloaded to:`, downloadResult.uri);

      if (Platform.OS === 'ios') {
        // On iOS, save to media library
        try {
          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
          await MediaLibrary.createAlbumAsync('Virtual Room', asset, false);
          
          Alert.alert(
            'Download Successful',
            'Image saved to your photo library in the "Virtual Room" album.',
            [{ text: 'OK' }]
          );
          
          console.log(`📱 [DownloadService] Image saved to Photos app:`, asset);
        } catch (saveError) {
          console.error('Error saving to media library:', saveError);
          // Fallback to sharing
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'image/jpeg',
              dialogTitle: 'Save Virtual Room Image'
            });
          }
        }
      } else {
        // On Android, save to media library
        try {
          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
          
          Alert.alert(
            'Download Successful',
            'Image saved to your photo library.',
            [{ text: 'OK' }]
          );
          
          console.log(`📱 [DownloadService] Image saved to gallery:`, asset);
        } catch (saveError) {
          console.error('Error saving to media library:', saveError);
          // Fallback to sharing
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'image/jpeg',
              dialogTitle: 'Save Virtual Room Image'
            });
          }
        }
      }

      // Log download activity
      await this.logDownload(imageUrl, tryOnId, workflowType);

      return true;
    } catch (err: any) {
      console.error('Error downloading image:', err);
      const error = err instanceof Error ? err : new Error('Failed to download image');
      
      Alert.alert(
        'Download Failed',
        error.message || 'Failed to download image. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;
    }
  },

  // Share image (alternative to download)
  async shareImage(
    imageUrl: string,
    tryOnId: string,
    workflowType: WorkflowType
  ): Promise<boolean> {
    if (!this.isValidImageUrl(imageUrl)) {
      Alert.alert('Share Error', 'Invalid image URL');
      return false;
    }

    try {
      // Check permissions first
      const canDownload = await this.canDownload(tryOnId);
      if (!canDownload) {
        Alert.alert('Share Error', 'You do not have permission to share this image');
        return false;
      }

      // Get download info from backend
      const downloadInfo = await this.getDownloadInfo(imageUrl, tryOnId, workflowType);
      const downloadUrl = await this.getDownloadUrl(imageUrl, workflowType);

      const fileUri = cacheDirectory + downloadInfo.filename;

      console.log(`📤 [DownloadService] Starting share:`, {
        downloadUrl,
        filename: downloadInfo.filename,
        workflowType
      });

      // Download to cache first
      const downloadResult = await downloadAsync(downloadUrl, fileUri);
      
      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status: ${downloadResult.status}`);
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      // Share the image
      await Sharing.shareAsync(downloadResult.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share Virtual Room Image'
      });

      console.log(`✅ [DownloadService] Image shared successfully`);
      
      // Log download activity (sharing counts as download)
      await this.logDownload(imageUrl, tryOnId, workflowType);
      
      return true;
    } catch (err: any) {
      console.error('Error sharing image:', err);
      const error = err instanceof Error ? err : new Error('Failed to share image');
      
      Alert.alert(
        'Share Failed',
        error.message || 'Failed to share image. Please try again.',
        [{ text: 'OK' }]
      );
      
      return false;
    }
  },

  // Get download progress (for future use with large images)
  getDownloadProgress(downloadProgress?: DownloadProgressData): number {
    if (!downloadProgress) return 0;
    return Math.round((downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100);
  }
};