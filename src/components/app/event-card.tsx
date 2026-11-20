import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Monitor, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeRange } from "@/lib/format";
import { getRegistrationState, spotsLeft } from "@/lib/event-rules";
import { MODALITY_LABEL, type EventFull } from "@/lib/types";
import { CategoryBadge, catStyle } from "./category-badge";
import { DateChip } from "./date-chip";
import { OrgLogo } from "./org-logo";

export function SpotsLabel({ event, registered = false }: { event: EventFull; registered?: boolean }) {
  const state = getRegistrationState(event, registered);
  const left = spotsLeft(event);
  if (state === "cancelado") return <span className="font-semibold text-destructive">Cancelado</span>;
  if (state === "finalizado") return <span className="text-muted-foreground">Finalizado</span>;
  if (state === "informativo") return <span className="text-muted-foreground">Solo informativo</span>;
  if (state === "agotado") return <span className="font-semibold text-destructive">Cupos agotados</span>;
  if (left == null) return <span className="text-success font-semibold">Cupo libre</span>;
  return (
    <span className={cn("font-semibold", left <= 10 ? "text-warning-foreground" : "text-success")}>
      {left} cupos disponibles
    </span>
  );
}

export function EventCard({
  event,
  registered = false,
  tag,
  className,
}: {
  event: EventFull;
  registered?: boolean;
  tag?: string;
  className?: string;
}) {
  return (
    <Link
      to="/eventos/$id"
      params={{ id: event.id }}
      style={catStyle(event.category?.color)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border-b-4 cat-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-lift",
        event.estado === "cancelado" && "opacity-70",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full cat-tile" />
        )}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={event.category} />
        </div>
        {(registered || tag) && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-gold-foreground shadow">
            {tag ?? "Inscrito"}
          </span>
        )}
        <DateChip date={event.fecha_inicio} className="absolute -bottom-6 right-4" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
        <h3 className="pr-16 font-display text-lg font-bold leading-snug text-foreground line-clamp-2">
          {event.titulo}
        </h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 cat-text" />
            {formatTimeRange(event.fecha_inicio, event.fecha_fin)}
          </p>
          <p className="flex items-center gap-2">
            {event.modalidad === "virtual" ? (
              <Monitor className="size-4 shrink-0 cat-text" />
            ) : (
              <MapPin className="size-4 shrink-0 cat-text" />
            )}
            <span className="line-clamp-1">
              {event.modalidad === "virtual" ? "Virtual" : event.ubicacion}
              {event.modalidad === "hibrida" && ` · ${MODALITY_LABEL.hibrida}`}
            </span>
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-xs">
          <span className="flex items-center gap-2 text-muted-foreground">
            <OrgLogo org={event.organization} className="size-6 text-[9px]" />
            <span className="line-clamp-1">{event.organization?.siglas || event.organization?.nombre}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5 text-muted-foreground" />
            <SpotsLabel event={event} registered={registered} />
          </span>
        </div>
      </div>
    </Link>
  );
}
