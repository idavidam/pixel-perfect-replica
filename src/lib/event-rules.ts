import type { EventRow } from "./types";

export type RegistrationState =
  | "cancelado"
  | "finalizado"
  | "informativo"
  | "inscrito"
  | "agotado"
  | "cerrado"
  | "disponible";

type RuleEvent = Pick<
  EventRow,
  "estado" | "fecha_inicio" | "fecha_fin" | "modo_inscripcion" | "cupos" | "inscritos_count" | "fecha_limite"
>;

/** Which state the "Inscribirme" button shows for a given event and user. */
export function getRegistrationState(
  event: RuleEvent,
  isRegistered: boolean,
  now: Date = new Date(),
): RegistrationState {
  if (event.estado === "cancelado") return "cancelado";
  if (new Date(event.fecha_fin) < now) return "finalizado";
  if (event.modo_inscripcion === "ninguna") return "informativo";
  if (isRegistered) return "inscrito";
  if (event.cupos != null && event.inscritos_count >= event.cupos) return "agotado";
  if (event.fecha_limite && new Date(event.fecha_limite) < now) return "cerrado";
  return "disponible";
}

/** A registration can be cancelled until the event starts. */
export function canCancel(event: Pick<EventRow, "fecha_inicio">, now: Date = new Date()) {
  return new Date(event.fecha_inicio) > now;
}

export function spotsLeft(event: Pick<EventRow, "cupos" | "inscritos_count">) {
  if (event.cupos == null) return null;
  return Math.max(0, event.cupos - event.inscritos_count);
}

type Span = Pick<EventRow, "id" | "fecha_inicio" | "fecha_fin">;

/** Events from `others` whose time overlaps `target` (warning only, never blocks). */
export function findConflicts<T extends Span>(target: Span, others: T[]): T[] {
  const s = new Date(target.fecha_inicio).getTime();
  const e = new Date(target.fecha_fin).getTime();
  return others.filter((o) => {
    if (o.id === target.id) return false;
    const os = new Date(o.fecha_inicio).getTime();
    const oe = new Date(o.fecha_fin).getTime();
    return s < oe && os < e;
  });
}

function icsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function icsEscape(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(
  events: Pick<EventRow, "id" | "titulo" | "descripcion" | "fecha_inicio" | "fecha_fin" | "ubicacion">[],
) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Actividades UTP//ES", "CALSCALE:GREGORIAN"];
  for (const ev of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.id}@actividades-utp`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(ev.fecha_inicio)}`,
      `DTEND:${icsDate(ev.fecha_fin)}`,
      `SUMMARY:${icsEscape(ev.titulo)}`,
      `DESCRIPTION:${icsEscape(ev.descripcion ?? "")}`,
      `LOCATION:${icsEscape(ev.ubicacion ?? "")}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function googleCalendarUrl(
  ev: Pick<EventRow, "titulo" | "descripcion" | "fecha_inicio" | "fecha_fin" | "ubicacion">,
) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.titulo,
    dates: `${icsDate(ev.fecha_inicio)}/${icsDate(ev.fecha_fin)}`,
    details: ev.descripcion ?? "",
    location: ev.ubicacion ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function toCsv(rows: (string | number | boolean | null)[][]) {
  return rows
    .map((r) =>
      r
        .map((c) => {
          const v = c == null ? "" : String(c);
          return /[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        })
        .join(","),
    )
    .join("\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Whether a sign-up email matches the allowed institutional domain. */
export function isAllowedEmail(email: string, domain: string, restrict: boolean) {
  if (!restrict) return true;
  return email.trim().toLowerCase().endsWith(`@${domain.trim().toLowerCase()}`);
}
