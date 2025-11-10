export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          premium_status: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          premium_status?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          premium_status?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          push_notifications: boolean
          email_notifications: boolean
          new_features: boolean
          language: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          push_notifications?: boolean
          email_notifications?: boolean
          new_features?: boolean
          language?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          push_notifications?: boolean
          email_notifications?: boolean
          new_features?: boolean
          language?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      try_on: {
        Row: {
          id: string
          user_id: string
          self_image: string | null
          model_image: string | null
          dress_description: string | null
          dress_image: string | null
          product_url: string | null
          processing_status: string
          result_image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          self_image?: string | null
          model_image?: string | null
          dress_description?: string | null
          dress_image?: string | null
          product_url?: string | null
          processing_status?: string
          result_image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          self_image?: string | null
          model_image?: string | null
          dress_description?: string | null
          dress_image?: string | null
          product_url?: string | null
          processing_status?: string
          result_image?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "try_on_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wardrobe: {
        Row: {
          id: string
          user_id: string
          try_on_id: string
          liked: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          try_on_id: string
          liked?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          try_on_id?: string
          liked?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wardrobe_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wardrobe_try_on_id_fkey"
            columns: ["try_on_id"]
            isOneToOne: false
            referencedRelation: "try_on"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_favorites: {
        Row: {
          user_id: string
          id: string
          self_image: string | null
          model_image: string | null
          dress_description: string | null
          dress_image: string | null
          product_url: string | null
          processing_status: string
          result_image: string | null
          created_at: string
          added_to_wardrobe_at: string
        }
        Relationships: [
          {
            foreignKeyName: "try_on_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          user_id: string
          name: string
          email: string
          total_try_ons: number
          favorites_count: number
          disliked_count: number
          undecided_count: number
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type UserSettings = Tables<'user_settings'>
export type TryOn = Tables<'try_on'>
export type Wardrobe = Tables<'wardrobe'>

// Custom types
export type TryOnWithWardrobe = TryOn & {
  wardrobe?: Wardrobe | null
}

export type UserFavorites = Database['public']['Views']['user_favorites']['Row']
export type UserStats = Database['public']['Views']['user_stats']['Row']

// Processing status enum
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

// API Request/Response types
export interface CreateTryOnRequest {
  self_image?: string
  model_image?: string
  dress_description?: string
  dress_image?: string
  product_url?: string
}

export interface UpdateWardrobeRequest {
  try_on_id: string
  liked?: boolean | null
}

export interface UpdateUserSettingsRequest {
  push_notifications?: boolean
  email_notifications?: boolean
  new_features?: boolean
  language?: string
}