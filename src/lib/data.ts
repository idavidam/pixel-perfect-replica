import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole, AppSettings, Campus, Category, EventFull, Organization, Profile, Registration } from "./types";

export const EVENT_SELECT =
  "*, category:categories(*), organization:organizations(*), campus:campuses(*), sponsors:event_sponsors(*)";

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("orden");
    if (error) throw error;
    return data as Category[];
  },
  staleTime: 5 * 60_000,
});

export const campusesQuery = queryOptions({
  queryKey: ["campuses"],
  queryFn: async () => {
    const { data, error } = await supabase.from("campuses").select("*").order("nombre");
    if (error) throw error;
    return data as Campus[];
  },
  staleTime: 5 * 60_000,
});

export const organizationsQuery = queryOptions({
  queryKey: ["organizations"],
  queryFn: async () => {
    const { data, error } = await supabase.from("organizations").select("*").order("nombre");
    if (error) throw error;
    return data as Organization[];
  },
  staleTime: 5 * 60_000,
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("app_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data as AppSettings | null;
  },
  staleTime: 5 * 60_000,
});

/** All publicly visible events (published / finished / cancelled), ordered by date. */
export const publicEventsQuery = queryOptions({
  queryKey: ["events", "public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_SELECT)
      .in("estado", ["publicado", "finalizado", "cancelado"])
      .order("fecha_inicio");
    if (error) throw error;
    return data as unknown as EventFull[];
  },
});

export const eventQuery = (id: string) =>
  queryOptions({
    queryKey: ["events", "detail", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select(EVENT_SELECT).eq("id", id).maybeSingle();
      if (error) throw error;
      return data as unknown as EventFull | null;
    },
  });

export type MyRegistration = Registration & { event: EventFull | null };

export const myRegistrationsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["registrations", "mine", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select(`*, event:events(${EVENT_SELECT})`)
        .eq("user_id", userId!)
        .order("fecha_inscripcion", { ascending: false });
      if (error) throw error;
      return data as unknown as MyRegistration[];
    },
  });

/** Events created by the user (admins see every event). */
export const managedEventsQuery = (userId: string | undefined, isAdmin: boolean) =>
  queryOptions({
    queryKey: ["events", "managed", userId, isAdmin],
    enabled: !!userId,
    queryFn: async () => {
      let q = supabase.from("events").select(EVENT_SELECT).order("fecha_inicio", { ascending: false });
      if (!isAdmin) q = q.eq("creado_por", userId!);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as EventFull[];
    },
  });

export const profileQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

export const rolesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });

/** Upload an image to storage and return a long-lived URL. */
export async function uploadImage(userId: string, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data) throw signErr ?? new Error("No se pudo obtener la URL de la imagen");
  return data.signedUrl;
}

export function friendlyError(e: unknown) {
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  if (/duplicate key/i.test(msg)) return "Ya existe un registro con esos datos.";
  if (/row-level security|permission denied/i.test(msg)) return "No tienes permiso para realizar esta acción.";
  return msg;
}
