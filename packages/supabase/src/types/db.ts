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
      lamp_chat: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          study_id: string
          title: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          study_id: string
          title?: string
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          study_id?: string
          title?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "lamp_chat_profile_id_lamp_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "lamp_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lamp_chat_study_id_lamp_study_id_fk"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "lamp_study"
            referencedColumns: ["id"]
          },
        ]
      }
      lamp_customer: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      lamp_feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lamp_feedback_profile_id_lamp_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "lamp_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      lamp_message: {
        Row: {
          chat_id: string
          content: Json
          created_at: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          chat_id: string
          content?: Json
          created_at?: string
          id?: string
          role: string
          updated_at?: string | null
        }
        Update: {
          chat_id?: string
          content?: Json
          created_at?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lamp_message_chat_id_lamp_chat_id_fk"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "lamp_chat"
            referencedColumns: ["id"]
          },
        ]
      }
      lamp_note: {
        Row: {
          content: Json
          created_at: string
          id: string
          profile_id: string
          study_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          profile_id: string
          study_id: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          profile_id?: string
          study_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lamp_note_profile_id_lamp_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "lamp_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lamp_note_study_id_lamp_study_id_fk"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "lamp_study"
            referencedColumns: ["id"]
          },
        ]
      }
      lamp_price: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lamp_price_product_id_lamp_product_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "lamp_product"
            referencedColumns: ["id"]
          },
        ]
      }
      lamp_product: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      lamp_profile: {
        Row: {
          billing_address: Json | null
          email: string | null
          id: string
          image: string | null
          name: string
          payment_method: Json | null
        }
        Insert: {
          billing_address?: Json | null
          email?: string | null
          id: string
          image?: string | null
          name: string
          payment_method?: Json | null
        }
        Update: {
          billing_address?: Json | null
          email?: string | null
          id?: string
          image?: string | null
          name?: string
          payment_method?: Json | null
        }
        Relationships: []
      }
      lamp_study: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lamp_study_profile_id_lamp_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "lamp_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      lamp_subscription: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string | null
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lamp_subscription_price_id_lamp_price_id_fk"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "lamp_price"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
