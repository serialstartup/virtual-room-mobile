import { apiClient, ApiResponse } from './api';

export interface CustomModel {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  model_type: 'model-create' | 'product-to-model';
  product_image?: string;
  result_image_url?: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface CreateTextToModelRequest {
  name: string;
  prompt: string; // Full body shot description
  model_type: 'model-create';
}

export interface CreateProductToModelRequest {
  name: string;
  prompt: string; // Scene context
  model_type: 'product-to-model';
  product_image: string; // Base64 or URL
}

export interface UpdateCustomModelRequest {
  name?: string;
  prompt?: string;
}

export type CreateCustomModelRequest = CreateTextToModelRequest | CreateProductToModelRequest;

export class CustomModelsService {
  // Create a text-to-model
  async createTextToModel(data: CreateTextToModelRequest): Promise<CustomModel> {
    console.log('[CUSTOM_MODELS_SERVICE] 📤 Creating text-to-model:', { name: data.name });
    
    const response = await apiClient.post<ApiResponse<CustomModel>>('/custom-models', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create text-to-model');
    }
    
    console.log('[CUSTOM_MODELS_SERVICE] ✅ Text-to-model created:', response.data?.id);
    return response.data!;
  }

  // Create a product-to-model
  async createProductToModel(data: CreateProductToModelRequest): Promise<CustomModel> {
    console.log('[CUSTOM_MODELS_SERVICE] 📤 Creating product-to-model:', { name: data.name });
    
    const response = await apiClient.post<ApiResponse<CustomModel>>('/custom-models', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create product-to-model');
    }
    
    console.log('[CUSTOM_MODELS_SERVICE] ✅ Product-to-model created:', response.data?.id);
    return response.data!;
  }

  // Generic create method for any custom model type
  async createCustomModel(data: CreateCustomModelRequest): Promise<CustomModel> {
    console.log('[CUSTOM_MODELS_SERVICE] 📤 Creating custom model:', { type: data.model_type, name: data.name });
    
    const response = await apiClient.post<ApiResponse<CustomModel>>('/custom-models', data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to create custom model');
    }
    
    console.log('[CUSTOM_MODELS_SERVICE] ✅ Custom model created:', response.data?.id);
    return response.data!;
  }

  // Get all custom models for current user
  async getCustomModels(): Promise<CustomModel[]> {
    const response = await apiClient.get<ApiResponse<CustomModel[]>>('/custom-models');
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch custom models');
    }
    
    return response.data || [];
  }

  // Get specific custom model by ID
  async getCustomModel(modelId: string): Promise<CustomModel> {
    const response = await apiClient.get<ApiResponse<CustomModel>>(`/custom-models/${modelId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch custom model');
    }
    
    return response.data!;
  }

  // Update custom model details
  async updateCustomModel(modelId: string, data: UpdateCustomModelRequest): Promise<CustomModel> {
    const response = await apiClient.put<ApiResponse<CustomModel>>(`/custom-models/${modelId}`, data);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to update custom model');
    }
    
    return response.data!;
  }

  // Get custom model processing status
  async getModelStatus(modelId: string): Promise<CustomModel['status']> {
    const response = await apiClient.get<ApiResponse<{ status: CustomModel['status'] }>>(`/custom-models/${modelId}/status`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get model status');
    }
    
    return response.data!.status;
  }

  // Retry custom model creation if it failed
  async retryModelCreation(modelId: string): Promise<CustomModel> {
    const response = await apiClient.post<ApiResponse<CustomModel>>(`/custom-models/${modelId}/retry`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to retry model creation');
    }
    
    return response.data!;
  }

  // Delete custom model
  async deleteCustomModel(modelId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/custom-models/${modelId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete custom model');
    }
  }

  // Subscribe to custom model status updates (polling-based)
  subscribeModelUpdates(
    modelId: string, 
    callback: (model: CustomModel) => void
  ): () => void {
    let isSubscribed = true;
    let lastStatus: CustomModel['status'] | null = null;
    
    const poll = async () => {
      if (!isSubscribed) return;
      
      try {
        const model = await this.getCustomModel(modelId);
        
        if (model.status !== lastStatus) {
          callback(model);
          lastStatus = model.status;
        }
        
        // Continue polling if still processing  
        if (model.status === 'processing') {
          setTimeout(poll, 5000); // Poll every 5 seconds for custom models (longer than try-ons)
        }
      } catch (error) {
        console.error('[CUSTOM_MODELS_SERVICE] ❌ Error polling model status:', error);
        // Retry after a longer delay on error
        if (isSubscribed) {
          setTimeout(poll, 10000);
        }
      }
    };
    
    // Start polling immediately
    poll();
    
    // Return unsubscribe function
    return () => {
      isSubscribed = false;
    };
  }

  // Filter models by type
  async getTextToModels(): Promise<CustomModel[]> {
    const models = await this.getCustomModels();
    return models.filter(model => model.model_type === 'model-create');
  }

  async getProductToModels(): Promise<CustomModel[]> {
    const models = await this.getCustomModels();
    return models.filter(model => model.model_type === 'product-to-model');
  }
}

// Export singleton instance
export const customModelsService = new CustomModelsService();