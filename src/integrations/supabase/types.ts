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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_invites: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          color_primario: string
          dominio_correo: string
          id: number
          logo_url: string | null
          restringir_dominio: boolean
          updated_at: string
        }
        Insert: {
          color_primario?: string
          dominio_correo?: string
          id?: number
          logo_url?: string | null
          restringir_dominio?: boolean
          updated_at?: string
        }
        Update: {
          color_primario?: string
          dominio_correo?: string
          id?: number
          logo_url?: string | null
          restringir_dominio?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      campuses: {
        Row: {
          activa: boolean
          ciudad: string
          created_at: string
          id: string
          nombre: string
        }
        Insert: {
          activa?: boolean
          ciudad?: string
          created_at?: string
          id?: string
          nombre: string
        }
        Update: {
          activa?: boolean
          ciudad?: string
          created_at?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          activa: boolean
          color: string
          created_at: string
          icono: string
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          activa?: boolean
          color?: string
          created_at?: string
          icono?: string
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          activa?: boolean
          color?: string
          created_at?: string
          icono?: string
          id?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: []
      }
      event_sponsors: {
        Row: {
          created_at: string
          event_id: string
          id: string
          logo_url: string | null
          nombre: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          logo_url?: string | null
          nombre: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          logo_url?: string | null
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          categoria_id: string | null
          creado_por: string | null
          created_at: string
          cupos: number | null
          descripcion: string
          destacado: boolean
          enlace_mapa: string | null
          enlace_virtual: string | null
          estado: Database["public"]["Enums"]["event_status"]
          fecha_fin: string
          fecha_inicio: string
          fecha_limite: string | null
          horas_labor_social: number
          id: string
          inscritos_count: number
          modalidad: Database["public"]["Enums"]["event_modality"]
          modo_inscripcion: Database["public"]["Enums"]["registration_mode"]
          organizacion_id: string | null
          publico_objetivo: string
          requisitos: string
          sede_id: string | null
          titulo: string
          ubicacion: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          categoria_id?: string | null
          creado_por?: string | null
          created_at?: string
          cupos?: number | null
          descripcion?: string
          destacado?: boolean
          enlace_mapa?: string | null
          enlace_virtual?: string | null
          estado?: Database["public"]["Enums"]["event_status"]
          fecha_fin: string
          fecha_inicio: string
          fecha_limite?: string | null
          horas_labor_social?: number
          id?: string
          inscritos_count?: number
          modalidad?: Database["public"]["Enums"]["event_modality"]
          modo_inscripcion?: Database["public"]["Enums"]["registration_mode"]
          organizacion_id?: string | null
          publico_objetivo?: string
          requisitos?: string
          sede_id?: string | null
          titulo: string
          ubicacion?: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          categoria_id?: string | null
          creado_por?: string | null
          created_at?: string
          cupos?: number | null
          descripcion?: string
          destacado?: boolean
          enlace_mapa?: string | null
          enlace_virtual?: string | null
          estado?: Database["public"]["Enums"]["event_status"]
          fecha_fin?: string
          fecha_inicio?: string
          fecha_limite?: string | null
          horas_labor_social?: number
          id?: string
          inscritos_count?: number
          modalidad?: Database["public"]["Enums"]["event_modality"]
          modo_inscripcion?: Database["public"]["Enums"]["registration_mode"]
          organizacion_id?: string | null
          publico_objetivo?: string
          requisitos?: string
          sede_id?: string | null
          titulo?: string
          ubicacion?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizacion_id_fkey"
            columns: ["organizacion_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          mostrar_en_franja: boolean
          nombre: string
          siglas: string
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          mostrar_en_franja?: boolean
          nombre: string
          siglas?: string
          tipo?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          mostrar_en_franja?: boolean
          nombre?: string
          siglas?: string
          tipo?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          carrera: string
          correo: string
          created_at: string
          facultad: string
          foto_url: string | null
          id: string
          id_estudiantil: string
          nombre: string
          sede_id: string | null
          updated_at: string
        }
        Insert: {
          carrera?: string
          correo?: string
          created_at?: string
          facultad?: string
          foto_url?: string | null
          id: string
          id_estudiantil?: string
          nombre?: string
          sede_id?: string | null
          updated_at?: string
        }
        Update: {
          carrera?: string
          correo?: string
          created_at?: string
          facultad?: string
          foto_url?: string | null
          id?: string
          id_estudiantil?: string
          nombre?: string
          sede_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          asistio: boolean
          estado: Database["public"]["Enums"]["registration_status"]
          event_id: string
          fecha_inscripcion: string
          id: string
          user_id: string
        }
        Insert: {
          asistio?: boolean
          estado?: Database["public"]["Enums"]["registration_status"]
          event_id: string
          fecha_inscripcion?: string
          id?: string
          user_id: string
        }
        Update: {
          asistio?: boolean
          estado?: Database["public"]["Enums"]["registration_status"]
          event_id?: string
          fecha_inscripcion?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      admin_list_users: {
        Args: never
        Returns: {
          carrera: string
          correo: string
          created_at: string
          facultad: string
          id: string
          nombre: string
          roles: Database["public"]["Enums"]["app_role"][]
        }[]
      }
      can_view_profile: {
        Args: { _profile: string; _viewer: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      owns_event: {
        Args: { _event_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "estudiante" | "organizador" | "administrador"
      event_modality: "presencial" | "virtual" | "hibrida"
      event_status: "borrador" | "publicado" | "cancelado" | "finalizado"
      registration_mode: "obligatoria" | "opcional" | "ninguna"
      registration_status: "inscrito" | "cancelado"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["estudiante", "organizador", "administrador"],
      event_modality: ["presencial", "virtual", "hibrida"],
      event_status: ["borrador", "publicado", "cancelado", "finalizado"],
      registration_mode: ["obligatoria", "opcional", "ninguna"],
      registration_status: ["inscrito", "cancelado"],
    },
  },
} as const
