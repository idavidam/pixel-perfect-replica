const TZ = "America/Panama";
const LOCALE = "es-PA";

function fmt(date: string | Date, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, ...opts }).format(new Date(date));
}

export const formatDay = (d: string | Date) => fmt(d, { day: "numeric" });
export const formatMonthShort = (d: string | Date) =>
  fmt(d, { month: "short" }).replace(".", "").toUpperCase();
export const formatWeekdayShort = (d: string | Date) => fmt(d, { weekday: "short" }).replace(".", "");
export const formatTime = (d: string | Date) => fmt(d, { hour: "numeric", minute: "2-digit" });
export const formatLongDate = (d: string | Date) =>
  fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const formatShortDate = (d: string | Date) =>
  fmt(d, { day: "numeric", month: "short", year: "numeric" });
export const formatMonthYear = (d: string | Date) => fmt(d, { month: "long", year: "numeric" });

/** YYYY-MM key in Panama time, used to group events by month. */
export function monthKey(d: string | Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" })
    .formatToParts(new Date(d));
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  return `${y}-${m}`;
}

/** YYYY-MM-DD key in Panama time. */
export function dayKey(d: string | Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(d));
}

export function formatTimeRange(start: string, end: string) {
  if (dayKey(start) === dayKey(end)) return `${formatTime(start)} – ${formatTime(end)}`;
  return `${formatShortDate(start)} ${formatTime(start)} – ${formatShortDate(end)} ${formatTime(end)}`;
}

/** Convert a value from <input type="datetime-local"> (Panama time) to ISO. */
export function localInputToIso(value: string) {
  if (!value) return null;
  return new Date(`${value}:00-05:00`).toISOString();
}

/** Convert ISO to a value for <input type="datetime-local"> in Panama time. */
export function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() - 5 * 3600 * 1000);
  return d.toISOString().slice(0, 16);
}
