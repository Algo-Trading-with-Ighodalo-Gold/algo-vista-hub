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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      affiliate_applications: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          social_link: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          social_link?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          social_link?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          commission_earned: number
          created_at: string
          id: string
          payout_status: string
          referral_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_earned?: number
          created_at?: string
          id?: string
          payout_status?: string
          referral_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_earned?: number
          created_at?: string
          id?: string
          payout_status?: string
          referral_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ea_development: {
        Row: {
          created_at: string
          id: string
          requirements: string
          status: string
          strategy_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          requirements: string
          status?: string
          strategy_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          requirements?: string
          status?: string
          strategy_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ea_products: {
        Row: {
          created_at: string
          description: string | null
          avg_monthly_return: string | null
          id: string
          image_key: string | null
          is_active: boolean | null
          key_features: string[] | null
          max_concurrent_sessions: number | null
          max_mt5_accounts: number | null
          max_drawdown: string | null
          min_deposit: string | null
          name: string
          performance: string | null
          price_label: string | null
          price_cents: number | null
          product_code: string
          requires_hardware_binding: boolean | null
          reviews: number | null
          risk_level: string | null
          short_description: string | null
          strategy_type: string | null
          timeframes: string | null
          trading_pairs: string | null
          stripe_price_id: string | null
          updated_at: string
          version: string | null
          rating: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          avg_monthly_return?: string | null
          id?: string
          image_key?: string | null
          is_active?: boolean | null
          key_features?: string[] | null
          max_concurrent_sessions?: number | null
          max_mt5_accounts?: number | null
          max_drawdown?: string | null
          min_deposit?: string | null
          name: string
          performance?: string | null
          price_label?: string | null
          price_cents?: number | null
          product_code: string
          requires_hardware_binding?: boolean | null
          reviews?: number | null
          risk_level?: string | null
          short_description?: string | null
          strategy_type?: string | null
          timeframes?: string | null
          trading_pairs?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          version?: string | null
          rating?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          avg_monthly_return?: string | null
          id?: string
          image_key?: string | null
          is_active?: boolean | null
          key_features?: string[] | null
          max_concurrent_sessions?: number | null
          max_mt5_accounts?: number | null
          max_drawdown?: string | null
          min_deposit?: string | null
          name?: string
          performance?: string | null
          price_label?: string | null
          price_cents?: number | null
          product_code?: string
          requires_hardware_binding?: boolean | null
          reviews?: number | null
          risk_level?: string | null
          short_description?: string | null
          strategy_type?: string | null
          timeframes?: string | null
          trading_pairs?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          version?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      license_sessions: {
        Row: {
          created_at: string
          ea_instance_id: string | null
          expires_at: string
          hardware_fingerprint: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_heartbeat: string
          license_id: string
          mt5_account_number: string | null
          session_token: string
          started_at: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          ea_instance_id?: string | null
          expires_at?: string
          hardware_fingerprint: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_heartbeat?: string
          license_id: string
          mt5_account_number?: string | null
          session_token: string
          started_at?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          ea_instance_id?: string | null
          expires_at?: string
          hardware_fingerprint?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_heartbeat?: string
          license_id?: string
          mt5_account_number?: string | null
          session_token?: string
          started_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "license_sessions_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      license_validations: {
        Row: {
          ea_instance_id: string | null
          failure_reason: string | null
          hardware_fingerprint: string | null
          id: string
          ip_address: unknown | null
          license_id: string | null
          mt5_account_number: string | null
          session_id: string | null
          suspicious_activity: boolean | null
          user_agent: string | null
          validated_at: string
          validation_result: Database["public"]["Enums"]["validation_result"]
        }
        Insert: {
          ea_instance_id?: string | null
          failure_reason?: string | null
          hardware_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          license_id?: string | null
          mt5_account_number?: string | null
          session_id?: string | null
          suspicious_activity?: boolean | null
          user_agent?: string | null
          validated_at?: string
          validation_result: Database["public"]["Enums"]["validation_result"]
        }
        Update: {
          ea_instance_id?: string | null
          failure_reason?: string | null
          hardware_fingerprint?: string | null
          id?: string
          ip_address?: unknown | null
          license_id?: string | null
          mt5_account_number?: string | null
          session_id?: string | null
          suspicious_activity?: boolean | null
          user_agent?: string | null
          validated_at?: string
          validation_result?: Database["public"]["Enums"]["validation_result"]
        }
        Relationships: [
          {
            foreignKeyName: "license_validations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_validations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "license_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string
          current_active_sessions: number | null
          ea_product_id: string | null
          ea_product_name: string | null
          expires_at: string | null
          hardware_fingerprint: string | null
          id: string
          issued_at: string
          last_hour_reset: string | null
          last_hour_validations: number | null
          last_validated_at: string | null
          license_key: string
          license_type: Database["public"]["Enums"]["license_type"]
          max_concurrent_sessions: number | null
          max_validations_per_hour: number | null
          status: Database["public"]["Enums"]["license_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
          validation_count: number | null
        }
        Insert: {
          created_at?: string
          current_active_sessions?: number | null
          ea_product_id?: string | null
          ea_product_name?: string | null
          expires_at?: string | null
          hardware_fingerprint?: string | null
          id?: string
          issued_at?: string
          last_hour_reset?: string | null
          last_hour_validations?: number | null
          last_validated_at?: string | null
          license_key: string
          license_type: Database["public"]["Enums"]["license_type"]
          max_concurrent_sessions?: number | null
          max_validations_per_hour?: number | null
          status?: Database["public"]["Enums"]["license_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
          validation_count?: number | null
        }
        Update: {
          created_at?: string
          current_active_sessions?: number | null
          ea_product_id?: string | null
          ea_product_name?: string | null
          expires_at?: string | null
          hardware_fingerprint?: string | null
          id?: string
          issued_at?: string
          last_hour_reset?: string | null
          last_hour_validations?: number | null
          last_validated_at?: string | null
          license_key?: string
          license_type?: Database["public"]["Enums"]["license_type"]
          max_concurrent_sessions?: number | null
          max_validations_per_hour?: number | null
          status?: Database["public"]["Enums"]["license_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
          validation_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affiliate_code: string | null
          avatar_url: string | null
          created_at: string
          eas_data: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          mt5_accounts: Json | null
          subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code?: string | null
          avatar_url?: string | null
          created_at?: string
          eas_data?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mt5_accounts?: Json | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string | null
          avatar_url?: string | null
          created_at?: string
          eas_data?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mt5_accounts?: Json | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_inquiries: {
        Row: {
          budget: string | null
          created_at: string
          email: string
          entry_logic: string
          exit_logic: string
          id: string
          instruments: string | null
          name: string
          nda_agreed: boolean
          risk_management: string | null
          special_features: string | null
          status: string
          strategy: string
          timeframes: string | null
          timeline: string | null
          trade_management: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email: string
          entry_logic: string
          exit_logic: string
          id?: string
          instruments?: string | null
          name: string
          nda_agreed?: boolean
          risk_management?: string | null
          special_features?: string | null
          status?: string
          strategy: string
          timeframes?: string | null
          timeline?: string | null
          trade_management?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string
          entry_logic?: string
          exit_logic?: string
          id?: string
          instruments?: string | null
          name?: string
          nda_agreed?: boolean
          risk_management?: string | null
          special_features?: string | null
          status?: string
          strategy?: string
          timeframes?: string | null
          timeline?: string | null
          trade_management?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          clicked_at: string
          conversion_date: string | null
          converted: boolean | null
          created_at: string
          id: string
          ip_address: string | null
          referrer_user_id: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          conversion_date?: string | null
          converted?: boolean | null
          created_at?: string
          id?: string
          ip_address?: string | null
          referrer_user_id: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          conversion_date?: string | null
          converted?: boolean | null
          created_at?: string
          id?: string
          ip_address?: string | null
          referrer_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          included_eas: string[] | null
          is_active: boolean | null
          max_concurrent_sessions: number | null
          max_mt5_accounts: number | null
          name: string
          price_cents: number
          stripe_price_id: string | null
          tier_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          included_eas?: string[] | null
          is_active?: boolean | null
          max_concurrent_sessions?: number | null
          max_mt5_accounts?: number | null
          name: string
          price_cents: number
          stripe_price_id?: string | null
          tier_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          included_eas?: string[] | null
          is_active?: boolean | null
          max_concurrent_sessions?: number | null
          max_mt5_accounts?: number | null
          name?: string
          price_cents?: number
          stripe_price_id?: string | null
          tier_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          payment_method: string | null
          plan: string
          start_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_method?: string | null
          plan: string
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          payment_method?: string | null
          plan?: string
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      trading_accounts: {
        Row: {
          id: string
          user_id: string
          license_id: string
          account_name: string
          mt5_account_number: string
          broker: string
          status: string
          balance: number
          equity: number
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_id: string
          account_name: string
          mt5_account_number: string
          broker: string
          status?: string
          balance?: number
          equity?: number
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_id?: string
          account_name?: string
          mt5_account_number?: string
          broker?: string
          status?: string
          balance?: number
          equity?: number
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      generate_license_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      reset_hourly_validation_counters: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      license_status: "active" | "expired" | "suspended" | "revoked"
      license_type:
        | "individual_ea"
        | "basic_tier"
        | "premium_tier"
        | "enterprise_tier"
      validation_result:
        | "valid"
        | "expired"
        | "hardware_mismatch"
        | "concurrent_violation"
        | "revoked"
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
      license_status: ["active", "expired", "suspended", "revoked"],
      license_type: [
        "individual_ea",
        "basic_tier",
        "premium_tier",
        "enterprise_tier",
      ],
      validation_result: [
        "valid",
        "expired",
        "hardware_mismatch",
        "concurrent_violation",
        "revoked",
      ],
    },
  },
} as const
