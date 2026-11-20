import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
export type Category = T["categories"]["Row"];
export type Organization = T["organizations"]["Row"];
export type Campus = T["campuses"]["Row"];
export type EventRow = T["events"]["Row"];
export type Sponsor = T["event_sponsors"]["Row"];
export type Registration = T["registrations"]["Row"];
export type Profile = T["profiles"]["Row"];
export type AppSettings = T["app_settings"]["Row"];
export type AppRole = Database["public"]["Enums"]["app_role"];
export type Modality = Database["public"]["Enums"]["event_modality"];
export type RegistrationMode = Database["public"]["Enums"]["registration_mode"];
export type EventStatus = Database["public"]["Enums"]["event_status"];

export type EventFull = EventRow & {
  category: Category | null;
  organization: Organization | null;
  campus: Campus | null;
  sponsors?: Sponsor[];
};

export const MODALITY_LABEL: Record<Modality, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrida: "Híbrida",
};

export const MODE_LABEL: Record<RegistrationMode, string> = {
  obligatoria: "Inscripción obligatoria",
  opcional: "Inscripción opcional",
  ninguna: "Solo informativo",
};

export const STATUS_LABEL: Record<EventStatus, string> = {
  borrador: "Borrador",
  publicado: "Publicado",
  cancelado: "Cancelado",
  finalizado: "Finalizado",
};
