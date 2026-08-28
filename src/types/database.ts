export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          payload: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          payload?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          banner_url: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          is_visible: boolean
          name: string
          position: number
          seo_description: string | null
          seo_title: string | null
          slug: string
        }
        Insert: {
          banner_url?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          name: string
          position?: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
        }
        Update: {
          banner_url?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_visible?: boolean
          name?: string
          position?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
        }
        Relationships: []
      }
      category_counters: {
        Row: {
          category_id: string
          last_number: number
        }
        Insert: {
          category_id: string
          last_number?: number
        }
        Update: {
          category_id?: string
          last_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_counters_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      colors: {
        Row: {
          hex: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          hex: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          hex?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      fabrics: {
        Row: {
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slides: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          position: number
          subtitle: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          position?: number
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          position?: number
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      measurements: {
        Row: {
          id: string
          label: string
          updated_at: string
          user_id: string
          values: Json
        }
        Insert: {
          id?: string
          label: string
          updated_at?: string
          user_id: string
          values?: Json
        }
        Update: {
          id?: string
          label?: string
          updated_at?: string
          user_id?: string
          values?: Json
        }
        Relationships: [
          {
            foreignKeyName: "measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      modes: {
        Row: {
          category_id: string
          created_at: string
          id: string
          is_visible: boolean
          name: string
          position: number
          slug: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          is_visible?: boolean
          name: string
          position?: number
          slug: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          is_visible?: boolean
          name?: string
          position?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "modes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_counters: {
        Row: {
          last_number: number
          year: number
        }
        Insert: {
          last_number?: number
          year: number
        }
        Update: {
          last_number?: number
          year?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          color: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          fabric: string | null
          final_price: number | null
          id: string
          internal_notes: string | null
          note: string | null
          order_number: string | null
          product_id: string
          quantity: number
          quoted_price: number | null
          size_type: string | null
          status: Database["public"]["Enums"]["order_status"]
          user_id: string | null
          whatsapp_sent_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          fabric?: string | null
          final_price?: number | null
          id?: string
          internal_notes?: string | null
          note?: string | null
          order_number?: string | null
          product_id: string
          quantity?: number
          quoted_price?: number | null
          size_type?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string | null
          whatsapp_sent_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          fabric?: string | null
          final_price?: number | null
          id?: string
          internal_notes?: string | null
          note?: string | null
          order_number?: string | null
          product_id?: string
          quantity?: number
          quoted_price?: number | null
          size_type?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          user_id?: string | null
          whatsapp_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_colors: {
        Row: {
          color_id: string
          product_id: string
        }
        Insert: {
          color_id: string
          product_id: string
        }
        Update: {
          color_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_colors_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_colors_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_fabrics: {
        Row: {
          fabric_id: string
          product_id: string
        }
        Insert: {
          fabric_id: string
          product_id: string
        }
        Update: {
          fabric_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_fabrics_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fabrics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          position: number
          product_id: string
          url_full: string
          url_thumb: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          position?: number
          product_id: string
          url_full: string
          url_thumb: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          url_full?: string
          url_thumb?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_modes: {
        Row: {
          mode_id: string
          product_id: string
        }
        Insert: {
          mode_id: string
          product_id: string
        }
        Update: {
          mode_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_modes_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_modes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          category_id: string
          created_at: string
          currency: string
          description: string | null
          gender: Database["public"]["Enums"]["gender_target"]
          id: string
          is_featured: boolean
          name: string
          og_image_url: string | null
          price: number | null
          price_type: Database["public"]["Enums"]["price_type"]
          production_days: string | null
          published_at: string | null
          reference: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          video_url: string | null
          view_count: number
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          category_id: string
          created_at?: string
          currency?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender_target"]
          id?: string
          is_featured?: boolean
          name: string
          og_image_url?: string | null
          price?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          production_days?: string | null
          published_at?: string | null
          reference?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_status"]
          category_id?: string
          created_at?: string
          currency?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender_target"]
          id?: string
          is_featured?: boolean
          name?: string
          og_image_url?: string | null
          price?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          production_days?: string | null
          published_at?: string | null
          reference?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_method: Database["public"]["Enums"]["auth_method"]
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          phone_verified: boolean
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          auth_method?: Database["public"]["Enums"]["auth_method"]
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          phone_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          auth_method?: Database["public"]["Enums"]["auth_method"]
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_reply: string | null
          author_name: string
          author_phone: string | null
          comment: string | null
          created_at: string
          id: string
          is_approved: boolean
          is_verified: boolean
          product_id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          admin_reply?: string | null
          author_name: string
          author_phone?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified?: boolean
          product_id: string
          rating: number
          user_id?: string | null
        }
        Update: {
          admin_reply?: string | null
          author_name?: string
          author_phone?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          is_verified?: boolean
          product_id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin_or_owner: { Args: never; Returns: boolean }
      is_critical_site_setting: {
        Args: { setting_key: string }
        Returns: boolean
      }
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      auth_method: "email" | "phone" | "google"
      availability_status:
        | "sur_commande"
        | "piece_disponible"
        | "sur_commande_uniquement"
        | "epuise"
      gender_target: "homme" | "femme" | "enfant" | "mixte"
      order_status:
        | "nouvelle"
        | "contactee"
        | "mesures_recues"
        | "acompte_verse"
        | "en_confection"
        | "prete"
        | "livree"
        | "annulee"
      price_type: "fixed" | "from" | "negotiable"
      product_status: "draft" | "published" | "archived"
      user_role: "client" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      auth_method: ["email", "phone", "google"],
      availability_status: [
        "sur_commande",
        "piece_disponible",
        "sur_commande_uniquement",
        "epuise",
      ],
      gender_target: ["homme", "femme", "enfant", "mixte"],
      order_status: [
        "nouvelle",
        "contactee",
        "mesures_recues",
        "acompte_verse",
        "en_confection",
        "prete",
        "livree",
        "annulee",
      ],
      price_type: ["fixed", "from", "negotiable"],
      product_status: ["draft", "published", "archived"],
      user_role: ["client", "admin", "owner"],
    },
  },
} as const
