import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { type FC } from 'react';
import { Colors } from '@/constants';
import { useUserAvatars, type UserAvatar } from '@/hooks/useUserAvatars';
import UploadSkeleton from './UploadSkeleton';
import { User } from 'lucide-react-native';

interface UploadWithAvatarSelectionProps {
  title: string;
  onImageSelect: (uri: string) => void;
  selectedImage?: string;
  disabled?: boolean;
  enableAvatarSelection?: boolean;
  onAvatarSelect?: (avatar: UserAvatar | null) => void;
  selectedAvatar?: UserAvatar | null;
}

const UploadWithAvatarSelection: FC<UploadWithAvatarSelectionProps> = ({ 
  title, 
  onImageSelect, 
  selectedImage,
  disabled = false,
  enableAvatarSelection = false,
  onAvatarSelect,
  selectedAvatar
}) => {
  const { avatars, isLoading: avatarsLoading, error: avatarsError } = useUserAvatars();
  

  const handleAvatarSelect = (avatar: UserAvatar) => {
    if (onAvatarSelect) {
      onAvatarSelect(avatar);
    }
  };

  const handleImageSelect = (uri: string) => {
    onImageSelect(uri);
    // Clear avatar selection when image is uploaded
    if (onAvatarSelect && uri) {
      onAvatarSelect(null);
    }
  };

  return (
    <View>
      {/* Normal Upload Section */}
      <UploadSkeleton
        title={title}
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage || (selectedAvatar?.avatar_image_url)}
        disabled={disabled}
      />
      
      {/* Avatar Selection Section */}
      {enableAvatarSelection && (
        <View className="mt-6 ">
          <Text className="text-lg font-outfit-semibold text-gray-900 mb-3">
            Veya Modellerimden Seç
          </Text>
          
          {avatarsLoading ? (
            <View className="h-24 items-center justify-center bg-gray-50 rounded-lg">
              <Text className="text-gray-500 font-outfit">Avatarlar yükleniyor...</Text>
            </View>
          ) : avatarsError ? (
            <View className="h-24 items-center justify-center bg-red-50 rounded-lg border border-red-200">
              <Text className="text-red-500 font-outfit text-center text-sm">{avatarsError.message}</Text>
            </View>
          ) : avatars.length === 0 ? (
            <View className="h-24 items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <User size={24} color={Colors.gray[400]} />
              <Text className="text-gray-500 font-outfit text-center mt-1 text-sm">Henüz avatar oluşturmadınız</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
              <View className="flex-row gap-4 px-1">
                {avatars.map((avatar) => (
                  <TouchableOpacity
                    key={avatar.id}
                    onPress={() => handleAvatarSelect(avatar)}
                    disabled={disabled}
                    className={`relative flex items-center ${disabled ? 'opacity-50' : ''}`}
                  >
                    {/* Circular Avatar */}
                    <View 
                      className={`w-40 h-40 rounded-full overflow-hidden border-4 ${
                        selectedAvatar?.id === avatar.id 
                          ? 'border-virtual-primary' 
                          : 'border-gray-300'
                      }`}
                    >
                      <Image
                        source={{ uri: avatar.avatar_image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      {/* Selection Indicator */}
                      {selectedAvatar?.id === avatar.id && (
                        <View className="absolute inset-0 bg-virtual-primary/20 items-center justify-center">
                          <View className="bg-virtual-primary rounded-full w-8 h-8 items-center justify-center shadow-lg">
                            <Text className="text-white text-sm font-outfit-semibold">✓</Text>
                          </View>
                        </View>
                      )}
                    </View>
                    
                    {/* Avatar Name */}
                    <Text 
                      className={`text-sm text-center mt-3 w-40 font-outfit-medium ${
                        selectedAvatar?.id === avatar.id 
                          ? 'text-virtual-primary' 
                          : 'text-gray-600'
                      }`}
                      numberOfLines={1}
                    >
                      {avatar.name || `Avatar`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
          
          {/* Selection Feedback */}
          {selectedAvatar && (
            <View className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Text className="text-green-700 font-outfit-medium text-sm">
                ✓ Seçilen Model: {selectedAvatar.name || `Avatar ${selectedAvatar.id.slice(0, 8)}`}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default UploadWithAvatarSelection;