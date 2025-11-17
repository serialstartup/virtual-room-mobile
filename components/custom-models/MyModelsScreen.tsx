import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CreateCustomModelModal from './CreateCustomModelModal';

interface UserModel {
  id: string;
  name: string;
  prompt: string;
  image_url?: string;
  model_type: 'model-create' | 'product-to-model';
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

const MyModelsScreen: React.FC = () => {
  const [models, setModels] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchModels = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get auth token (implement based on your auth system)
      const token = await getAuthToken(); // You'll need to implement this

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/custom-models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setModels(result.data || []);
      } else {
        Alert.alert('Error', result.error || 'Failed to load models.');
      }
    } catch (error) {
      console.error('Fetch models error:', error);
      Alert.alert('Error', 'Failed to load models. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchModels(true);
  };

  const handleDeleteModel = (modelId: string) => {
    Alert.alert(
      'Delete Model',
      'Are you sure you want to delete this model? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteModel(modelId)
        }
      ]
    );
  };

  const deleteModel = async (modelId: string) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/custom-models/${modelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setModels(prev => prev.filter(model => model.id !== modelId));
      } else {
        Alert.alert('Error', result.error || 'Failed to delete model.');
      }
    } catch (error) {
      console.error('Delete model error:', error);
      Alert.alert('Error', 'Failed to delete model. Please try again.');
    }
  };

  const handleRetryModel = async (modelId: string) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/custom-models/${modelId}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Update the model status to processing
        setModels(prev => prev.map(model => 
          model.id === modelId 
            ? { ...model, status: 'processing' }
            : model
        ));
      } else {
        Alert.alert('Error', result.error || 'Failed to retry model creation.');
      }
    } catch (error) {
      console.error('Retry model error:', error);
      Alert.alert('Error', 'Failed to retry model creation. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      case 'processing': return 'time';
      default: return 'time';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderModelItem = ({ item }: { item: UserModel }) => (
    <View className="bg-white rounded-lg mb-4 shadow-sm border border-gray-200">
      <View className="flex-row">
        {/* Model Image */}
        <View className="w-24 h-24">
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-full rounded-l-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full rounded-l-lg bg-gray-100 items-center justify-center">
              {item.status === 'processing' ? (
                <ActivityIndicator size="small" color="#6B7280" />
              ) : (
                <Ionicons name="image-outline" size={24} color="#6B7280" />
              )}
            </View>
          )}
        </View>

        {/* Model Info */}
        <View className="flex-1 p-3">
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-sm font-semibold text-gray-900 flex-1" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="ml-2">
              <TouchableOpacity
                onPress={() => handleDeleteModel(item.id)}
                className="p-1"
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-xs text-gray-600 mb-2" numberOfLines={2}>
            {item.prompt}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
                name={getStatusIcon(item.status)}
                size={14}
                color={item.status === 'completed' ? '#10B981' : 
                       item.status === 'failed' ? '#EF4444' : '#F59E0B'}
              />
              <Text className={`text-xs ml-1 ${getStatusColor(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>

            <View className="flex-row items-center">
              {item.status === 'failed' && (
                <TouchableOpacity
                  onPress={() => handleRetryModel(item.id)}
                  className="mr-2"
                >
                  <Ionicons name="refresh" size={14} color="#6B7280" />
                </TouchableOpacity>
              )}
              <Text className="text-xs text-gray-400">
                {formatDate(item.created_at)}
              </Text>
            </View>
          </View>

          {/* Model Type Badge */}
          <View className="absolute top-2 right-2">
            <Text className={`text-xs px-2 py-1 rounded-full ${
              item.model_type === 'model-create' 
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {item.model_type === 'model-create' ? 'Text' : 'Product'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getAuthToken = async (): Promise<string> => {
    const { authService } = await import('../../services/authService');
    const token = await authService.getToken();
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
  };

  useFocusEffect(
    useCallback(() => {
      fetchModels();
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-600 mt-4">Loading your models...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">My Models</Text>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Models List */}
      {models.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
          <Text className="text-lg font-medium text-gray-900 mt-4 mb-2">
            No Models Yet
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Create your first custom model to get started with personalized fashion.
          </Text>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Create Your First Model</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={models}
          renderItem={renderModelItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6366F1"
            />
          }
        />
      )}

      {/* Create Model Modal */}
      <CreateCustomModelModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onModelCreated={() => {
          fetchModels();
        }}
      />
    </View>
  );
};

export default MyModelsScreen;