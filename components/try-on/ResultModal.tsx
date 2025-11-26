import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Heart, ThumbsUp, ThumbsDown, Download } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTryOnById } from '@/hooks/useTryOn';
import { useAvatarById } from '@/hooks/useAvatar';
import { useCustomModelById } from '@/hooks/useCustomModels';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ProcessingStatus } from '@/types/database';
import { useAppStore } from '@/store/appStore';
import { useWorkflowStore } from '@/store/workflowStore';
import useFeedback, { type FeedbackType, type WorkflowType } from '@/hooks/useFeedback';
import useDownload from '@/hooks/useDownload';

interface ResultModalProps {
  visible: boolean;
  tryOnId: string | null;
  onClose: () => void;
  onRetry?: () => void;
  onClearForm?: () => void;
  isAvatarProcessing?: boolean; // Flag to indicate if this is avatar processing
  isTextToFashionProcessing?: boolean; // Flag to indicate if this is text-to-fashion processing
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  tryOnId,
  onClose,
  onRetry,
  onClearForm,
  isAvatarProcessing = false,
  isTextToFashionProcessing = false,
}) => {
  const { t } = useTranslation();
  const [currentStatus, setCurrentStatus] = useState<ProcessingStatus>('pending');
  const [isSavingToWardrobe, setIsSavingToWardrobe] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  
  // New states for feedback and download
  const [thumbsFeedback, setThumbsFeedback] = useState<FeedbackType | null>(null);
  
  // New hooks
  const { 
    toggleThumbsFeedback, 
    getThumbsFeedback, 
    isLoading: isFeedbackLoading 
  } = useFeedback();
  
  const { 
    downloadImage, 
    isDownloading, 
    isValidImageUrl 
  } = useDownload();
  
  // Use different hooks based on processing type
  const { tryOn, isLoading: isTryOnLoading, error: tryOnError, subscribeToUpdates: subscribeTryOnUpdates } = useTryOnById(isAvatarProcessing || isTextToFashionProcessing ? '' : (tryOnId || ''));
  const { avatar, isLoading: isAvatarLoading, error: avatarError, subscribeToUpdates: subscribeAvatarUpdates } = useAvatarById(isAvatarProcessing ? (tryOnId || '') : '');
  const { customModel, isLoading: isCustomModelLoading, error: customModelError, subscribeToUpdates: subscribeCustomModelUpdates } = useCustomModelById(isTextToFashionProcessing ? (tryOnId || '') : '');


  
  const { addToWardrobe, toggleLike } = useWardrobe();
  const removeActiveTryOn = useAppStore((state) => state.removeActiveTryOn);
  const clearExpiredData = useWorkflowStore((state) => state.clearExpiredData);
  
  // Helper function to determine workflow type
  const getWorkflowType = useCallback((): WorkflowType => {
    if (isAvatarProcessing) return 'avatar';
    if (isTextToFashionProcessing) return 'text-to-fashion';
    // For classic and product-to-model, we'll default to 'classic'
    // In a real implementation, you might need to add more logic to distinguish these
    return 'classic';
  }, [isAvatarProcessing, isTextToFashionProcessing]);
  
  // Determine which data to use based on processing type
  const isLoading = isAvatarProcessing ? isAvatarLoading : 
                   isTextToFashionProcessing ? isCustomModelLoading : isTryOnLoading;
  const error = isAvatarProcessing ? avatarError : 
               isTextToFashionProcessing ? customModelError : tryOnError;
  const resultData = isAvatarProcessing ? avatar : 
                    isTextToFashionProcessing ? customModel : tryOn;
  const subscribeToUpdates = isAvatarProcessing ? subscribeAvatarUpdates : 
                           isTextToFashionProcessing ? subscribeCustomModelUpdates : subscribeTryOnUpdates;
  
  // Type-safe property access
  const getStatus = (data: any) => {
    if (isAvatarProcessing || isTextToFashionProcessing) {
      return data?.status;
    }
    return data?.processing_status;
  };
  
  const getImageUrl = (data: any) => {
    if (isAvatarProcessing) {
      return data?.avatar_image_url;
    }
    if (isTextToFashionProcessing) {
      return data?.image_url;
    }
    return data?.result_image;
  };

  
  // Use ref to avoid dependency issues
  const addToWardrobeRef = useRef(addToWardrobe);
  addToWardrobeRef.current = addToWardrobe;

  useEffect(() => {
    if (!tryOnId || !visible) return;

    // Subscribe to status updates based on processing type
    const unsubscribe = subscribeToUpdates((statusOrData: any) => {
      if (isAvatarProcessing) {
        // For avatar, the callback receives the full avatar object
        const avatarData = statusOrData as any;
        setCurrentStatus(avatarData.status as ProcessingStatus);
      } else if (isTextToFashionProcessing) {
        // For text-to-fashion, the callback receives the full custom model object
        const customModelData = statusOrData as any;
        setCurrentStatus(customModelData.status as ProcessingStatus);
      } else {
        // For try-on, the callback receives the status string
        setCurrentStatus(statusOrData as ProcessingStatus);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tryOnId, visible, subscribeToUpdates, isAvatarProcessing, isTextToFashionProcessing]);

  useEffect(() => {
    if (resultData) {
      // Different status fields for different processing types
      const statusValue = getStatus(resultData);
      

      setCurrentStatus(statusValue as ProcessingStatus);
    }
  }, [resultData, isAvatarProcessing, isTextToFashionProcessing, currentStatus]);

  // Load existing feedback when component mounts or tryOnId changes
  useEffect(() => {
    if (tryOnId && currentStatus === 'completed') {
      const loadFeedback = async () => {
        try {
          const existingFeedback = await getThumbsFeedback(tryOnId);
          setThumbsFeedback(existingFeedback);
          
        } catch (error) {
          console.error('[RESULT_MODAL] ❌ Error loading feedback:', error);
        }
      };

      loadFeedback();
    }
  }, [tryOnId, currentStatus, getThumbsFeedback, getWorkflowType]);

  const handleClose = async () => {
    // Don't allow closing during processing
    if (currentStatus === 'processing') {
      return;
    }

    try {
      // Clean up storage when closing
      if (tryOnId) {
        removeActiveTryOn(tryOnId);
      }
      
      // Clear workflow data to reset form
      clearExpiredData();
    } catch (error) {
      console.error('[RESULT_MODAL] ❌ Error cleaning up storage:', error);
    } finally {
      // Reset all states
      setCurrentStatus('pending');
      setAutoSaved(false);
      setIsLiked(null);
      setIsSavingToWardrobe(false);
      setThumbsFeedback(null);
      onClose();
    }
  };

  const handleRetry = async () => {
    if (onRetry) {
      setCurrentStatus('pending');
      setThumbsFeedback(null);
      setIsLiked(null);
      setAutoSaved(false);
      
      // Clear the form data
      if (onClearForm) {
        onClearForm();
      }
      
      // Clear storage as well
      try {
        clearExpiredData();
      } catch (error) {
        console.error('[RESULT_MODAL] ❌ Error clearing form data:', error);
      }
      
      onRetry();
    }
  };

  // Auto-save to wardrobe when completed (only for try-on, not avatar or text-to-fashion)
  useEffect(() => {
    const autoSaveToWardrobe = async () => {
      if (!isAvatarProcessing && !isTextToFashionProcessing && currentStatus === 'completed' && tryOnId && !autoSaved && getImageUrl(resultData)) {
        try {
          setIsSavingToWardrobe(true);
          await addToWardrobeRef.current(tryOnId, isLiked);
          setAutoSaved(true);
        } catch (error) {
          console.error('[RESULT_MODAL] ❌ Error auto-saving to wardrobe:', error);
          // Ignore duplicate key errors (already saved)
          if (error?.message?.includes('duplicate key value')) {
            setAutoSaved(true);
          }
        } finally {
          setIsSavingToWardrobe(false);
        }
      }
    };

    autoSaveToWardrobe();
  }, [currentStatus, tryOnId, getImageUrl(resultData), autoSaved, isLiked, isAvatarProcessing, isTextToFashionProcessing]);

  const handleToggleLike = async () => {
    if (!tryOnId) return;
    
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // If already saved to wardrobe, toggle the like
      if (autoSaved) {
        await toggleLike(tryOnId);
      }
    } catch (error) {
      console.error('[RESULT_MODAL] ❌ Error toggling like:', error);
      // Revert the like state on error
      setIsLiked(!isLiked);
    }
  };

  // Handle thumbs feedback
  const handleThumbsFeedback = async (feedbackType: FeedbackType) => {
    if (!tryOnId) return;
    
    try {
      const workflowType = getWorkflowType();
      const newFeedbackType = await toggleThumbsFeedback(tryOnId, workflowType, feedbackType);
      setThumbsFeedback(newFeedbackType);
      
    } catch (error) {
      console.error('[RESULT_MODAL] ❌ Error setting thumbs feedback:', error);
    }
  };

  // Handle download (will be called with imageUrl parameter)
  const handleDownload = async (imageUrl: string) => {
    if (!tryOnId || !imageUrl) return;
    
    try {
      const workflowType = getWorkflowType();
      
      
      if (!isValidImageUrl(imageUrl)) {
        console.error('[RESULT_MODAL] ❌ Invalid image URL:', imageUrl);
        return;
      }

      const success = await downloadImage(imageUrl, tryOnId, workflowType);
      
      if (success) {
      }
    } catch (error) {
      console.error('[RESULT_MODAL] ❌ Error downloading image:', error);
    }
  };

  const renderContent = () => {

    if (isLoading) {
      return (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-600 mt-4">{t('common.loading')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center py-8">
          <Text className="text-red-500 text-center mb-4">
            {t('common.error')}: {error.message}
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="bg-virtual-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // If we don't have data yet (still fetching), show loading
    if (!resultData) {
      return (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-600 mt-4">
            {isAvatarProcessing ? 'Loading avatar...' : 
             isTextToFashionProcessing ? 'Loading text-to-fashion model...' : 
             'Loading try-on...'}
          </Text>
        </View>
      );
    }

    switch (currentStatus) {
      case 'pending':
        return (
          <View className="items-center py-8">
            <View className="w-20 h-20 rounded-full border-4 border-gray-200 items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
            <Text className="text-gray-600 mt-4 text-center font-medium">
              {t('tryOn.messages.preparingRequest')}
            </Text>
          </View>
        );

      case 'processing':
        return (
          <View className="items-center py-8">
            <View className="w-24 h-24 rounded-full border-4 border-virtual-primary/20 items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
            <Text className="text-gray-600 mt-4 text-center font-semibold text-lg">
              {t('tryOn.messages.processingDescription')}
            </Text>
            <Text className="text-gray-400 mt-2 text-center text-sm">
              {t('tryOn.messages.processingDuration')}
            </Text>
            <Text className="text-gray-400 mt-4 text-center text-xs">
              {t('tryOn.messages.processingTip')}
            </Text>
          </View>
        );

      case 'completed':
        // Simple and explicit image URL mapping for each workflow type
        const resultImageUrl = getImageUrl(resultData);
        

        if (resultImageUrl) {
          return (
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{ uri: resultImageUrl }}
                  style={{
                    width: screenWidth * 0.85,
                    height: screenHeight * 0.6,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
                
                {/* Heart Icon - only show for try-on, not avatar or text-to-fashion */}
                {!isAvatarProcessing && !isTextToFashionProcessing && (
                  <TouchableOpacity 
                    className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-lg"
                    onPress={handleToggleLike}
                    activeOpacity={0.7}
                  >
                    <Heart 
                      size={20} 
                      color={isLiked ? "#ec4899" : "#6b7280"} 
                      fill={isLiked ? "#ec4899" : "transparent"}
                    />
                  </TouchableOpacity>
                )}
                
                {/* Auto-save indicator - only show for try-on, not avatar or text-to-fashion */}
                {!isAvatarProcessing && !isTextToFashionProcessing && isSavingToWardrobe && (
                  <View className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-full">
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white text-xs ml-2">{t('wardrobe.messages.autoSaving')}</Text>
                    </View>
                  </View>
                )}
                
                {/* Auto-saved indicator - only show for try-on, not avatar or text-to-fashion */}
                {!isAvatarProcessing && !isTextToFashionProcessing && autoSaved && !isSavingToWardrobe && (
                  <View className="absolute bottom-4 left-4 bg-green-500/90 px-3 py-2 rounded-full">
                    <Text className="text-white text-xs font-medium">{t('wardrobe.messages.autoSaved')}</Text>
                  </View>
                )}
                
                {/* Thumbs Feedback (Satisfaction) - for all workflow types */}
                <View className={`absolute flex-row gap-2 ${
                  // Position based on auto-save indicator visibility
                  (!isAvatarProcessing && !isTextToFashionProcessing && autoSaved && !isSavingToWardrobe) 
                    ? 'bottom-16 left-4' // Above auto-saved indicator
                    : (!isAvatarProcessing && !isTextToFashionProcessing && isSavingToWardrobe)
                      ? 'bottom-16 left-4' // Above saving indicator  
                      : 'bottom-4 left-4'  // Normal position
                }`}>
                  {/* Thumbs Up */}
                  <TouchableOpacity 
                    className={`bg-white/90 rounded-full p-3 shadow-lg ${
                      thumbsFeedback === 'like' ? 'bg-green-500' : ''
                    }`}
                    onPress={() => handleThumbsFeedback('like')}
                    activeOpacity={0.7}
                    disabled={isFeedbackLoading}
                  >
                    <ThumbsUp 
                      size={18} 
                      color={thumbsFeedback === 'like' ? "#22c55e" : "#22c55e"} 
                      fill={thumbsFeedback === 'like' ? "#22c55e" : "transparent"}
                    />
                  </TouchableOpacity>
                  
                  {/* Thumbs Down */}
                  <TouchableOpacity 
                    className={`bg-white/90 rounded-full p-3 shadow-lg ${
                      thumbsFeedback === 'dislike' ? 'bg-red-500' : ''
                    }`}
                    onPress={() => handleThumbsFeedback('dislike')}
                    activeOpacity={0.7}
                    disabled={isFeedbackLoading}
                  >
                    <ThumbsDown 
                      size={18} 
                      color={thumbsFeedback === 'dislike' ? "#ef4444" : "#ef4444"} 
                      fill={thumbsFeedback === 'dislike' ? "#ef4444" : "transparent"}
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Download Button - bottom right */}
                <TouchableOpacity 
                  className="absolute bottom-4 right-4 bg-white/90 rounded-full p-3 shadow-lg"
                  onPress={() => handleDownload(resultImageUrl)}
                  activeOpacity={0.7}
                  disabled={isDownloading || !isValidImageUrl(resultImageUrl)}
                >
                  <Download 
                    size={18} 
                    color={isDownloading ? "#9ca3af" : "#6366f1"} 
                  />
                  {isDownloading && (
                    <ActivityIndicator 
                      size="small" 
                      color="#6366f1" 
                      className="absolute inset-0"
                    />
                  )}
                </TouchableOpacity>
              </View>
              
              <View className="mt-6 w-full">
                {/* Action Buttons: Retry / Close */}
                <View className="flex-row justify-between gap-4">
                  <TouchableOpacity
                    onPress={handleRetry}
                    className="bg-gray-200 px-6 py-3 rounded-lg flex-1"
                  >
                    <Text className="text-gray-700 font-semibold text-center">
                      {t('tryOn.buttons.newTryOn')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="bg-virtual-primary px-6 py-3 rounded-lg flex-1"
                  >
                    <Text className="text-white font-semibold text-center">
                      {t('common.close')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        } else {
          
          return (
            <View className="items-center py-8">
              <Text className="text-red-500 text-center mb-4">
                🖼️ Image not available
              </Text>
              <Text className="text-gray-500 text-center text-sm">
                Processing completed but image URL not found
              </Text>
            </View>
          );
        }

      case 'failed':
        return (
          <View className="items-center py-8">
            <Text className="text-red-500 text-xl mb-2">❌</Text>
            <Text className="text-red-500 text-center mb-4">
              {t('errors.processingError')}
            </Text>
            <Text className="text-gray-500 text-center mb-4 text-sm">
              {error?.message || t('errors.unknownError')}
            </Text>
            {__DEV__ && resultData && (
              <View className="bg-gray-100 p-3 rounded-lg mb-4 w-full">
                <Text className="text-xs text-gray-600 text-center">
                  DEBUG: Status={getStatus(resultData)}, ID={(resultData as any).id}
                </Text>
                <Text className="text-xs text-gray-600 text-center mt-1">
                  {isAvatarProcessing 
                    ? `Avatar: name=${(resultData as any).name || 'N/A'}, face_image=${(resultData as any).face_image_url ? '✓' : '✗'}`
                    : `Request: self_image=${(resultData as any).self_image ? '✓' : '✗'}, dress_desc=${(resultData as any).dress_description ? '✓' : '✗'}`
                  }
                </Text>
                {error?.message && (
                  <Text className="text-xs text-red-600 text-center mt-1">
                    Error: {error.message}
                  </Text>
                )}
              </View>
            )}
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={handleRetry}
                className="bg-virtual-primary px-6 py-3 rounded-lg flex-1"
              >
                <Text className="text-white font-semibold text-center">{t('common.retry')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClose}
                className="bg-gray-200 px-6 py-3 rounded-lg flex-1"
              >
                <Text className="text-gray-700 font-semibold text-center">{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return (
          <View className="items-center py-8">
            <Text className="text-gray-600">{t('errors.unknownError')}</Text>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">
            {currentStatus === 'completed' ? t('tryOn.processing.completed') : 
             currentStatus === 'processing' ? t('tryOn.processing.processing') : 
             currentStatus === 'failed' ? t('tryOn.processing.failed') : 
             t('tryOn.processing.pending')}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="w-8 h-8 items-center justify-center"
            disabled={currentStatus === 'processing'}
          >
            <Text className={`text-xl ${currentStatus === 'processing' ? 'text-gray-300' : 'text-gray-500'}`}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 p-4 justify-center">
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;