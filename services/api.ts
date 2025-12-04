// Backend base URL - update this based on your environment
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: any;
    token: string;
    expires_in: number;
  };
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    try {
      // Use only Auth Store (Zustand + AsyncStorage)
      const { useAuthStore } = await import('@/store/authStore');
      const storeState = useAuthStore.getState();
      
      if (storeState.token && storeState.isAuthenticated) {
        return {
          Authorization: `Bearer ${storeState.token}`,
        };
      }
      
      console.warn('[API] ⚠️ No valid auth token found in store');
      return {};
    } catch (error) {
      console.error('[API] 🚨 Error getting auth header:', error);
      return {};
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const startTime = Date.now();
    
    const authHeaders = await this.getAuthHeader();
    
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };


    try {
      const response = await fetch(url, config);
      const duration = Date.now() - startTime;
      
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[API] ❌ Error response:`, errorData);
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[API] 🚨 Request failed [${endpoint}] (${duration}ms):`, error);
      throw error;
    }
  }

  // Auth endpoints
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async get<T = any>(endpoint: string, options?: { params?: Record<string, any> }): Promise<T> {
    let url = endpoint;
    
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (endpoint.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return this.request<T>(url, {
      method: 'GET',
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options?: { params?: Record<string, any> }): Promise<T> {
    let url = endpoint;
    
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (endpoint.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(BASE_URL);