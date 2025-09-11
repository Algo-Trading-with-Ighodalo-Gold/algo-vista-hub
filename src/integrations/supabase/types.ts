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
      licenses: {
        Row: {
          created_at: string | null
          id: string
          license_key: string
          mt5_accounts: Json | null
          status: string | null
          subscription_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          license_key: string
          mt5_accounts?: Json | null
          status?: string | null
          subscription_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          license_key?: string
          mt5_accounts?: Json | null
          status?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
