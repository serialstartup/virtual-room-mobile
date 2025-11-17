import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { useTryOnById } from '@/hooks/useTryOn';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ProcessingStatus } from '@/types/database';
import { storageService } from '@/services/storage';

interface ResultModalProps {
  visible: boolean;
  tryOnId: string | null;
  onClose: () => void;
  onRetry?: () => void;
  onClearForm?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  tryOnId,
  onClose,
  onRetry,
  onClearForm,
}) => {
  const [currentStatus, setCurrentStatus] = useState<ProcessingStatus>('pending');
  const [isSavingToWardrobe, setIsSavingToWardrobe] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  const { tryOn, isLoading, error, subscribeToUpdates } = useTryOnById(tryOnId || '');
  const { addToWardrobe, toggleLike } = useWardrobe();
  
  // Use ref to avoid dependency issues
  const addToWardrobeRef = useRef(addToWardrobe);
  addToWardrobeRef.current = addToWardrobe;

  useEffect(() => {
    if (!tryOnId || !visible) return;

    // Subscribe to status updates
    const unsubscribe = subscribeToUpdates((status) => {
      setCurrentStatus(status as ProcessingStatus);
    });

    return () => {
      unsubscribe();
    };
  }, [tryOnId, visible, subscribeToUpdates]);

  useEffect(() => {
    if (tryOn) {
      setCurrentStatus(tryOn.processing_status as ProcessingStatus);
    }
  }, [tryOn]);

  const handleClose = async () => {
    try {
      // Clean up storage when closing
      if (tryOnId) {
        await storageService.removeActiveTryOn(tryOnId);
      }
    } catch (error) {
      console.error('[RESULT_MODAL] ❌ Error cleaning up storage:', error);
    } finally {
      // Reset all states
      setCurrentStatus('pending');
      setAutoSaved(false);
      setIsLiked(null);
      setIsSavingToWardrobe(false);
      onClose();
    }
  };

  const handleRetry = async () => {
    if (onRetry) {
      setCurrentStatus('pending');
      
      // Clear the form data
      if (onClearForm) {
        onClearForm();
      }
      
      // Clear storage as well
      try {
        await storageService.clearTryOnData();
      } catch (error) {
        console.error('[RESULT_MODAL] ❌ Error clearing form data:', error);
      }
      
      onRetry();
    }
  };

  // Auto-save to wardrobe when completed
  useEffect(() => {
    const autoSaveToWardrobe = async () => {
      if (currentStatus === 'completed' && tryOnId && !autoSaved && tryOn?.result_image) {
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
  }, [currentStatus, tryOnId, tryOn?.result_image, autoSaved, isLiked]);

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-600 mt-4">Yükleniyor...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center py-8">
          <Text className="text-red-500 text-center mb-4">
            Bir hata oluştu: {error.message}
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="bg-virtual-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (currentStatus) {
      case 'pending':
        return (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="text-gray-600 mt-4 text-center">
              İstek hazırlanıyor...
            </Text>
          </View>
        );

      case 'processing':
        return (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="text-gray-600 mt-4 text-center">
              AI kıyafetinizi size uyduruyor...
            </Text>
            <Text className="text-gray-400 mt-2 text-center text-sm">
              Bu işlem 30-60 saniye sürebilir
            </Text>
          </View>
        );

      case 'completed':
        if (tryOn?.result_image) {
          return (
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{ uri: tryOn.result_image }}
                  style={{
                    width: screenWidth * 0.85,
                    height: screenWidth * 1.1,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
                
                {/* Heart Icon */}
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
                
                {/* Auto-save indicator */}
                {isSavingToWardrobe && (
                  <View className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-full">
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white text-xs ml-2">Kaydediliyor...</Text>
                    </View>
                  </View>
                )}
                
                {/* Auto-saved indicator */}
                {autoSaved && !isSavingToWardrobe && (
                  <View className="absolute bottom-4 left-4 bg-green-500/90 px-3 py-2 rounded-full">
                    <Text className="text-white text-xs font-medium">✓ Kaydedildi</Text>
                  </View>
                )}
              </View>
              
              <View className="mt-6 w-full">
                {/* Action Buttons: Retry / Close */}
                <View className="flex-row justify-between gap-4">
                  <TouchableOpacity
                    onPress={handleRetry}
                    className="bg-gray-200 px-6 py-3 rounded-lg flex-1"
                  >
                    <Text className="text-gray-700 font-semibold text-center">
                      Yeni Deneme
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="bg-virtual-primary px-6 py-3 rounded-lg flex-1"
                  >
                    <Text className="text-white font-semibold text-center">
                      Kapat
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }
        break;

      case 'failed':
        return (
          <View className="items-center py-8">
            <Text className="text-red-500 text-xl mb-2">❌</Text>
            <Text className="text-red-500 text-center mb-4">
              İşlem başarısız oldu
            </Text>
            <Text className="text-gray-500 text-center mb-4 text-sm">
              {error?.message || 'Lütfen farklı bir fotoğraf ile tekrar deneyin'}
            </Text>
            {__DEV__ && tryOn && (
              <View className="bg-gray-100 p-3 rounded-lg mb-4 w-full">
                <Text className="text-xs text-gray-600 text-center">
                  DEBUG: Status={tryOn.processing_status}, ID={tryOn.id}
                </Text>
                <Text className="text-xs text-gray-600 text-center mt-1">
                  Request: self_image={tryOn.self_image ? '✓' : '✗'}, dress_desc={tryOn.dress_description ? '✓' : '✗'}
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
                <Text className="text-white font-semibold text-center">Tekrar Dene</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClose}
                className="bg-gray-200 px-6 py-3 rounded-lg flex-1"
              >
                <Text className="text-gray-700 font-semibold text-center">Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return (
          <View className="items-center py-8">
            <Text className="text-gray-600">Bilinmeyen durum</Text>
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
            İşte sonucunuz! 🎉
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-gray-500 text-xl">✕</Text>
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