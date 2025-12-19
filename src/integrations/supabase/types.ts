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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          additional_info: string | null
          address_type: Database["public"]["Enums"]["address_type"]
          created_at: string | null
          geocoded_at: string | null
          hausnummer: string | null
          id: string
          land: string
          latitude: number | null
          longitude: number | null
          order_id: string | null
          plz: string
          stadt: string
          strasse: string
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          address_type: Database["public"]["Enums"]["address_type"]
          created_at?: string | null
          geocoded_at?: string | null
          hausnummer?: string | null
          id?: string
          land?: string
          latitude?: number | null
          longitude?: number | null
          order_id?: string | null
          plz: string
          stadt: string
          strasse: string
          user_id: string
        }
        Update: {
          additional_info?: string | null
          address_type?: Database["public"]["Enums"]["address_type"]
          created_at?: string | null
          geocoded_at?: string | null
          hausnummer?: string | null
          id?: string
          land?: string
          latitude?: number | null
          longitude?: number | null
          order_id?: string | null
          plz?: string
          stadt?: string
          strasse?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_assignments: {
        Row: {
          admin_notes: string | null
          assigned_at: string | null
          assigned_by: string
          created_at: string | null
          estimated_duration: unknown
          id: string
          order_id: string
          payment_amount: number | null
          photographer_id: string
          photographer_notes: string | null
          responded_at: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          travel_cost: number | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          assigned_at?: string | null
          assigned_by: string
          created_at?: string | null
          estimated_duration?: unknown
          id?: string
          order_id: string
          payment_amount?: number | null
          photographer_id: string
          photographer_notes?: string | null
          responded_at?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          travel_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          assigned_at?: string | null
          assigned_by?: string
          created_at?: string | null
          estimated_duration?: unknown
          id?: string
          order_id?: string
          payment_amount?: number | null
          photographer_id?: string
          photographer_notes?: string | null
          responded_at?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          travel_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_deliverables: {
        Row: {
          delivered_at: string | null
          file_name: string
          file_path: string
          id: string
          order_id: string
        }
        Insert: {
          delivered_at?: string | null
          file_name: string
          file_path: string
          id?: string
          order_id: string
        }
        Update: {
          delivered_at?: string | null
          file_name?: string
          file_path?: string
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_deliverables_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_notes: string | null
          order_id: string
          quantity: number
          service_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_notes?: string | null
          order_id: string
          quantity?: number
          service_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_notes?: string | null
          order_id?: string
          quantity?: number
          service_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      order_upgrades: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
          upgrade_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          quantity?: number
          total_price: number
          unit_price: number
          upgrade_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          upgrade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_upgrades_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_upgrades_upgrade_id_fkey"
            columns: ["upgrade_id"]
            isOneToOne: false
            referencedRelation: "upgrades"
            referencedColumns: ["id"]
          },
        ]
      }
      order_uploads: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          order_id: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          order_id: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          order_id?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_uploads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          alternative_date: string | null
          alternative_time: string | null
          created_at: string | null
          delivery_deadline: string | null
          id: string
          order_number: string
          requested_date: string | null
          requested_time: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          unanswered_assignment_count: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alternative_date?: string | null
          alternative_time?: string | null
          created_at?: string | null
          delivery_deadline?: string | null
          id?: string
          order_number: string
          requested_date?: string | null
          requested_time?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          unanswered_assignment_count?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alternative_date?: string | null
          alternative_time?: string | null
          created_at?: string | null
          delivery_deadline?: string | null
          id?: string
          order_number?: string
          requested_date?: string | null
          requested_time?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          unanswered_assignment_count?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          change_frequency: string | null
          created_at: string | null
          description: string | null
          id: string
          keywords: string[] | null
          no_follow: boolean | null
          no_index: boolean | null
          og_image: string | null
          page_name: string
          page_path: string
          priority: number | null
          structured_data: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          change_frequency?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          no_follow?: boolean | null
          no_index?: boolean | null
          og_image?: string | null
          page_name: string
          page_path: string
          priority?: number | null
          structured_data?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          change_frequency?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          no_follow?: boolean | null
          no_index?: boolean | null
          og_image?: string | null
          page_name?: string
          page_path?: string
          priority?: number | null
          structured_data?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_tracking: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          page_created: boolean | null
          pictures_finalized: boolean | null
          text_finalized: boolean | null
          title: string
          updated_at: string | null
          url_handle: string
          user_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          page_created?: boolean | null
          pictures_finalized?: boolean | null
          text_finalized?: boolean | null
          title: string
          updated_at?: string | null
          url_handle: string
          user_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          page_created?: boolean | null
          pictures_finalized?: boolean | null
          text_finalized?: boolean | null
          title?: string
          updated_at?: string | null
          url_handle?: string
          user_type?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      photographer_availability: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_available: boolean
          notes: string | null
          photographer_id: string
          reason: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean
          notes?: string | null
          photographer_id: string
          reason?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean
          notes?: string | null
          photographer_id?: string
          reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photographer_availability_photographer_id_fkey"
            columns: ["photographer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aufmerksam_geworden_durch: string | null
          available_weekdays: number[] | null
          berufshaftpflicht_bis: string | null
          bic: string | null
          branche: string | null
          city: string | null
          created_at: string | null
          email: string
          equipment: Json | null
          firma: string | null
          handelsregister_nr: string | null
          iban: string | null
          id: string
          keine_berufshaftpflicht: boolean | null
          kleinunternehmer: boolean | null
          kontoinhaber: string | null
          land: string | null
          location_lat: number | null
          location_lng: number | null
          nachname: string | null
          onboarding_completed: boolean | null
          plz: string | null
          portfolio_url: string | null
          postal_code: string | null
          profile_complete: boolean | null
          rechtsform: string | null
          service_radius_km: number | null
          stadt: string | null
          steuernummer: string | null
          strasse: string | null
          telefon: string | null
          umsatzsteuer_id: string | null
          umsatzsteuer_pflichtig: boolean | null
          updated_at: string | null
          vorname: string | null
        }
        Insert: {
          aufmerksam_geworden_durch?: string | null
          available_weekdays?: number[] | null
          berufshaftpflicht_bis?: string | null
          bic?: string | null
          branche?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          equipment?: Json | null
          firma?: string | null
          handelsregister_nr?: string | null
          iban?: string | null
          id: string
          keine_berufshaftpflicht?: boolean | null
          kleinunternehmer?: boolean | null
          kontoinhaber?: string | null
          land?: string | null
          location_lat?: number | null
          location_lng?: number | null
          nachname?: string | null
          onboarding_completed?: boolean | null
          plz?: string | null
          portfolio_url?: string | null
          postal_code?: string | null
          profile_complete?: boolean | null
          rechtsform?: string | null
          service_radius_km?: number | null
          stadt?: string | null
          steuernummer?: string | null
          strasse?: string | null
          telefon?: string | null
          umsatzsteuer_id?: string | null
          umsatzsteuer_pflichtig?: boolean | null
          updated_at?: string | null
          vorname?: string | null
        }
        Update: {
          aufmerksam_geworden_durch?: string | null
          available_weekdays?: number[] | null
          berufshaftpflicht_bis?: string | null
          bic?: string | null
          branche?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          equipment?: Json | null
          firma?: string | null
          handelsregister_nr?: string | null
          iban?: string | null
          id?: string
          keine_berufshaftpflicht?: boolean | null
          kleinunternehmer?: boolean | null
          kontoinhaber?: string | null
          land?: string | null
          location_lat?: number | null
          location_lng?: number | null
          nachname?: string | null
          onboarding_completed?: boolean | null
          plz?: string | null
          portfolio_url?: string | null
          postal_code?: string | null
          profile_complete?: boolean | null
          rechtsform?: string | null
          service_radius_km?: number | null
          stadt?: string | null
          steuernummer?: string | null
          strasse?: string | null
          telefon?: string | null
          umsatzsteuer_id?: string | null
          umsatzsteuer_pflichtig?: boolean | null
          updated_at?: string | null
          vorname?: string | null
        }
        Relationships: []
      }
      rate_limit_logs: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      sea_settings: {
        Row: {
          conversion_events: Json | null
          cookie_consent_required: boolean | null
          created_at: string | null
          enabled: boolean | null
          facebook_pixel_id: string | null
          google_ads_conversion_label: string | null
          google_ads_id: string | null
          google_analytics_id: string | null
          google_tag_manager_id: string | null
          hotjar_id: string | null
          id: string
          linkedin_insight_tag: string | null
          updated_at: string | null
        }
        Insert: {
          conversion_events?: Json | null
          cookie_consent_required?: boolean | null
          created_at?: string | null
          enabled?: boolean | null
          facebook_pixel_id?: string | null
          google_ads_conversion_label?: string | null
          google_ads_id?: string | null
          google_analytics_id?: string | null
          google_tag_manager_id?: string | null
          hotjar_id?: string | null
          id?: string
          linkedin_insight_tag?: string | null
          updated_at?: string | null
        }
        Update: {
          conversion_events?: Json | null
          cookie_consent_required?: boolean | null
          created_at?: string | null
          enabled?: boolean | null
          facebook_pixel_id?: string | null
          google_ads_conversion_label?: string | null
          google_ads_id?: string | null
          google_analytics_id?: string | null
          google_tag_manager_id?: string | null
          hotjar_id?: string | null
          id?: string
          linkedin_insight_tag?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          canonical_domain: string | null
          created_at: string | null
          default_description: string | null
          default_keywords: string[] | null
          default_title: string
          id: string
          open_graph: Json | null
          robots_txt: string | null
          structured_data: Json | null
          title_suffix: string | null
          twitter_card: Json | null
          updated_at: string | null
        }
        Insert: {
          canonical_domain?: string | null
          created_at?: string | null
          default_description?: string | null
          default_keywords?: string[] | null
          default_title?: string
          id?: string
          open_graph?: Json | null
          robots_txt?: string | null
          structured_data?: Json | null
          title_suffix?: string | null
          twitter_card?: Json | null
          updated_at?: string | null
        }
        Update: {
          canonical_domain?: string | null
          created_at?: string | null
          default_description?: string | null
          default_keywords?: string[] | null
          default_title?: string
          id?: string
          open_graph?: Json | null
          robots_txt?: string | null
          structured_data?: Json | null
          title_suffix?: string | null
          twitter_card?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          category: string
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: Json | null
          colors: Json
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          favicon_url: string | null
          id: string
          logo_url: string | null
          site_description: string | null
          site_name: string
          social_links: Json | null
          typography: Json
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          colors?: Json
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          site_description?: string | null
          site_name?: string
          social_links?: Json | null
          typography?: Json
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          colors?: Json
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          site_description?: string | null
          site_name?: string
          social_links?: Json | null
          typography?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      upgrades: {
        Row: {
          base_price: number
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          pricing_config: Json | null
          pricing_type: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pricing_config?: Json | null
          pricing_type?: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pricing_config?: Json | null
          pricing_type?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: string
          created_at: string | null
          granted: boolean
          granted_at: string | null
          id: string
          ip_address: string | null
          revoked_at: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      anonymize_user_data: { Args: { _user_id: string }; Returns: undefined }
      auto_decline_expired_assignments: { Args: never; Returns: undefined }
      calculate_assignment_deadline: {
        Args: { assigned_at_param: string; scheduled_date_param: string }
        Returns: string
      }
      check_photographer_profile_complete: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          _endpoint: string
          _ip_address: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_expired_reset_tokens: { Args: never; Returns: undefined }
      cleanup_old_orders: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      generate_order_number: { Args: never; Returns: string }
      get_recent_security_events: {
        Args: { hours_back?: number }
        Returns: {
          created_at: string
          event_type: string
          ip_address: string
          metadata: Json
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_photographer: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      address_type: "shooting_location" | "billing_address"
      app_role: "admin" | "client" | "photographer" | "editor"
      order_status:
        | "draft"
        | "submitted"
        | "in_progress"
        | "completed"
        | "delivered"
        | "cancelled"
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
      address_type: ["shooting_location", "billing_address"],
      app_role: ["admin", "client", "photographer", "editor"],
      order_status: [
        "draft",
        "submitted",
        "in_progress",
        "completed",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
