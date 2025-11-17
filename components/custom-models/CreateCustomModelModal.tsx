import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface CreateCustomModelModalProps {
  visible: boolean;
  onClose: () => void;
  onModelCreated: () => void;
}

type ModelType = 'model-create' | 'product-to-model';

const CreateCustomModelModal: React.FC<CreateCustomModelModalProps> = ({
  visible,
  onClose,
  onModelCreated
}) => {
  const [modelName, setModelName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState<ModelType>('model-create');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setModelName('');
    setPrompt('');
    setModelType('model-create');
    setProductImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setProductImage(`data:image/jpeg;base64,${asset.base64}`);
    }
  };

  const handleCreate = async () => {
    if (!modelName.trim()) {
      Alert.alert('Error', 'Please enter a model name.');
      return;
    }

    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt description.');
      return;
    }

    if (modelType === 'product-to-model' && !productImage) {
      Alert.alert('Error', 'Please upload a product image for product-to-model type.');
      return;
    }

    setLoading(true);

    try {
      // Get auth token (implement based on your auth system)
      const token = await getAuthToken(); // You'll need to implement this
      
      const requestBody = {
        name: modelName.trim(),
        prompt: prompt.trim(),
        model_type: modelType,
        ...(productImage && { product_image: productImage })
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/custom-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          'Success', 
          'Your custom model is being created! You can check the progress in My Models.',
          [
            {
              text: 'OK',
              onPress: () => {
                handleClose();
                onModelCreated();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create custom model.');
      }
    } catch (error) {
      console.error('Create custom model error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = async (): Promise<string> => {
    const { authService } = await import('../../services/authService');
    const token = await authService.getToken();
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
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
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Create Custom Model</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Model Name */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Model Name</Text>
            <TextInput
              value={modelName}
              onChangeText={setModelName}
              placeholder="e.g., Summer Casual Look"
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              maxLength={100}
            />
          </View>

          {/* Model Type */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Model Type</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setModelType('model-create')}
                className={`flex-1 p-3 rounded-lg mr-2 border ${
                  modelType === 'model-create'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`text-center font-medium ${
                  modelType === 'model-create' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Text to Model
                </Text>
                <Text className="text-xs text-gray-500 text-center mt-1">
                  Create from description
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModelType('product-to-model')}
                className={`flex-1 p-3 rounded-lg ml-2 border ${
                  modelType === 'product-to-model'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`text-center font-medium ${
                  modelType === 'product-to-model' ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  Product to Model
                </Text>
                <Text className="text-xs text-gray-500 text-center mt-1">
                  Upload product image
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Image Upload (only for product-to-model) */}
          {modelType === 'product-to-model' && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Product Image</Text>
              <TouchableOpacity
                onPress={pickImage}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
              >
                {productImage ? (
                  <View className="items-center">
                    <Image
                      source={{ uri: productImage }}
                      className="w-32 h-32 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text className="text-sm text-gray-600">Tap to change image</Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
                    <Text className="text-sm text-gray-600 mt-2">Tap to upload product image</Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      Supports JPG, PNG formats
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Prompt */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {modelType === 'model-create' ? 'Model Description' : 'Scene Description (Optional)'}
            </Text>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder={
                modelType === 'model-create'
                  ? "e.g., Full body shot, woman wearing white t-shirt and blue jeans, standing in natural lighting"
                  : "e.g., professional office setting, natural lighting"
              }
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 min-h-[100px]"
              textAlignVertical="top"
            />
            <Text className="text-xs text-gray-500 mt-1">
              {modelType === 'model-create'
                ? 'Describe the full look you want to create'
                : 'Describe the setting or scene (optional)'}
            </Text>
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-lg p-4 mb-6">
            <Text className="text-sm font-medium text-blue-900 mb-2">💡 Tips for better results:</Text>
            <Text className="text-xs text-blue-700 leading-4">
              {modelType === 'model-create'
                ? '• Use detailed descriptions\n• Mention clothing style, colors, and fit\n• Include lighting and pose details\n• Be specific about the overall look'
                : '• Use clear, high-quality product images\n• Ensure the product is well-lit\n• Crop tightly around the product\n• Add scene context for realistic results'}
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="border-t border-gray-200 p-4">
          <TouchableOpacity
            onPress={handleCreate}
            disabled={loading}
            className={`p-4 rounded-lg ${
              loading ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" />
                <Text className="text-white font-semibold ml-2">Creating Model...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center">Create Model</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreateCustomModelModal;