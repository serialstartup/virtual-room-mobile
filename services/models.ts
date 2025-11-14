import { apiClient, ApiResponse } from './api';

export interface ModelData {
  id: number;
  name: string;
  image_url: string;
  gender: 'female' | 'male' | 'unisex';
  description?: string;
}

export interface ModelsResponse extends ApiResponse {
  data: ModelData[];
}

export interface ModelResponse extends ApiResponse {
  data: ModelData;
}

export const modelsService = {
  /**
   * Get all available models
   */
  async getModels(): Promise<ModelData[]> {
    try {
      const response: ModelsResponse = await apiClient.get('/models');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to fetch models');
    } catch (error) {
      console.error('[MODELS_SERVICE] ❌ Error fetching models:', error);
      throw error;
    }
  },

  /**
   * Get specific model by ID
   */
  async getModelById(id: number): Promise<ModelData> {
    try {
      const response: ModelResponse = await apiClient.get(`/models/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to fetch model');
    } catch (error) {
      console.error('[MODELS_SERVICE] ❌ Error fetching model:', error);
      throw error;
    }
  }
};