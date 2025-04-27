export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lead_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          linkedin_url: string
          name: string
          request_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          linkedin_url: string
          name: string
          request_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          linkedin_url?: string
          name?: string
          request_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_contacts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "lead_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_intents: {
        Row: {
          activity_summary: string
          created_at: string | null
          id: string
          request_id: string | null
          urgency_score: number
        }
        Insert: {
          activity_summary: string
          created_at?: string | null
          id?: string
          request_id?: string | null
          urgency_score: number
        }
        Update: {
          activity_summary?: string
          created_at?: string | null
          id?: string
          request_id?: string | null
          urgency_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_intents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "lead_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_requests: {
        Row: {
          created_at: string | null
          id: string
          provider_company: string
          provider_services: string
          target_client: string
          target_client_website: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider_company: string
          provider_services: string
          target_client: string
          target_client_website: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          provider_company?: string
          provider_services?: string
          target_client?: string
          target_client_website?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lead_sales_plans: {
        Row: {
          cold_call_script: string
          created_at: string | null
          email_sequence: string
          id: string
          marketing_tips: string
          request_id: string | null
        }
        Insert: {
          cold_call_script: string
          created_at?: string | null
          email_sequence: string
          id?: string
          marketing_tips: string
          request_id?: string | null
        }
        Update: {
          cold_call_script?: string
          created_at?: string | null
          email_sequence?: string
          id?: string
          marketing_tips?: string
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_sales_plans_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "lead_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_search_history: {
        Row: {
          created_at: string | null
          id: string
          lead_request_id: string | null
          search_params: Json
          search_query: string
          search_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_request_id?: string | null
          search_params: Json
          search_query: string
          search_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_request_id?: string | null
          search_params?: Json
          search_query?: string
          search_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_search_history_lead_request_id_fkey"
            columns: ["lead_request_id"]
            isOneToOne: false
            referencedRelation: "lead_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          image_url: string | null
          sender: string
          text: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          sender: string
          text: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          sender?: string
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      salesforce_auth: {
        Row: {
          created_at: string
          id: string
          instance_url: string | null
          is_sandbox: boolean | null
          last_used_at: string | null
          password: string
          security_token: string
          session_id: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_url?: string | null
          is_sandbox?: boolean | null
          last_used_at?: string | null
          password: string
          security_token: string
          session_id?: string | null
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_url?: string | null
          is_sandbox?: boolean | null
          last_used_at?: string | null
          password?: string
          security_token?: string
          session_id?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      salesforce_connections: {
        Row: {
          access_token: string
          created_at: string
          id: string
          instance_url: string
          last_sync_at: string | null
          last_sync_status: string | null
          refresh_token: string
          token_expires_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          instance_url: string
          last_sync_at?: string | null
          last_sync_status?: string | null
          refresh_token: string
          token_expires_at: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          instance_url?: string
          last_sync_at?: string | null
          last_sync_status?: string | null
          refresh_token?: string
          token_expires_at?: string
          user_id?: string
        }
        Relationships: []
      }
      salesforce_oauth_states: {
        Row: {
          created_at: string
          state: string
          user_id: string
        }
        Insert: {
          created_at?: string
          state: string
          user_id: string
        }
        Update: {
          created_at?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email_updates: boolean | null
          full_name: string | null
          id: string
          notification_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_updates?: boolean | null
          full_name?: string | null
          id: string
          notification_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_updates?: boolean | null
          full_name?: string | null
          id?: string
          notification_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      lead_search_history_details: {
        Row: {
          contacts: Json | null
          history_id: string | null
          intent: Json | null
          lead_request_id: string | null
          provider_company: string | null
          provider_services: string | null
          sales_plan: Json | null
          search_params: Json | null
          search_query: string | null
          search_type: string | null
          searched_at: string | null
          target_client: string | null
          target_client_website: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_search_history_lead_request_id_fkey"
            columns: ["lead_request_id"]
            isOneToOne: false
            referencedRelation: "lead_requests"
            referencedColumns: ["id"]
          },
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
