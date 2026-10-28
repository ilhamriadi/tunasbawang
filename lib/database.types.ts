// Hand-defined Supabase database types, kept in sync with supabase/migrations.
// Regenerate anytime with:  supabase gen types typescript --local > lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          slug: string
          name: string
          tagline: string | null
          image: string | null
          tone: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['categories']['Row']>
        Update: Partial<Database['public']['Tables']['categories']['Row']>
        Relationships: []
      }
      products: {
        Row: {
          slug: string
          sku: string
          name: string
          category: string
          price: number
          sale_price: number | null
          unit: string
          image: string | null
          description: string | null
          stock: number
          options: Json
          badge: string | null
          rating: number
          sold: number
          featured: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['products']['Row']>
        Update: Partial<Database['public']['Tables']['products']['Row']>
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          user_id: string | null
          name: string
          phone: string | null
          email: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['customers']['Row']>
        Update: Partial<Database['public']['Tables']['customers']['Row']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          status: string
          payment_status: string
          subtotal: number
          shipping_cost: number
          discount: number
          total: number
          shipping_name: string | null
          payment_name: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_address: string | null
          customer_city: string | null
          customer_postal_code: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['orders']['Row']>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_slug: string | null
          product_name: string
          option_label: string | null
          quantity: number
          unit_price: number
          line_total: number
        }
        Insert: Partial<Database['public']['Tables']['order_items']['Row']>
        Update: Partial<Database['public']['Tables']['order_items']['Row']>
        Relationships: []
      }
      inventory_movements: {
        Row: {
          id: string
          product_slug: string | null
          product_name: string
          type: string
          quantity: number
          reason: string
          reference: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['inventory_movements']['Row']>
        Update: Partial<Database['public']['Tables']['inventory_movements']['Row']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
        Relationships: []
      }
      admin_activity_log: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          detail: Json | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['admin_activity_log']['Row']>
        Update: Partial<Database['public']['Tables']['admin_activity_log']['Row']>
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['settings']['Row']>
        Update: Partial<Database['public']['Tables']['settings']['Row']>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      place_order: {
        Args: { payload: Json }
        Returns: string
      }
      adjust_stock: {
        Args: {
          p_slug: string
          p_delta: number
          p_reason: string
          p_reference?: string | null
        }
        Returns: number
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
