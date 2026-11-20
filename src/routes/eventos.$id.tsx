import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin } from "lucide-react";
import { eventQuery } from "@/lib/data";
import { formatLongDate, formatTimeRange } from "@/lib/format";
import { CategoryBadge } from "@/components/app/category-badge";
import { RegisterButton } from "@/components/app/register-button";

export const Route = createFileRoute("/eventos/$id")({
  head: () => ({
    meta: [
      { title: "Detalle del evento · Actividades UTP" },
      { name: "description", content: "Información e inscripción del evento." },
      { property: "og:title", content: "Detalle del evento · Actividades UTP" },
      { property: "og:description", content: "Información e inscripción del evento." },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const { data: event, isLoading } = useQuery(eventQuery(id));
  if (isLoading) return <p className="mx-auto max-w-5xl px-4 py-12 text-muted-foreground">Cargando…</p>;
  if (!event) return <p className="mx-auto max-w-5xl px-4 py-12">Evento no encontrado.</p>;
  return (
    <article className="mx-auto max-w-5xl px-4 py-8">
      {event.banner_url && <img src={event.banner_url} alt="" className="aspect-[16/7] w-full rounded-3xl object-cover shadow-lift" />}
      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <CategoryBadge category={event.category} />
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{event.titulo}</h1>
          <p className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" />{formatLongDate(event.fecha_inicio)} · {formatTimeRange(event.fecha_inicio, event.fecha_fin)}</p>
          <p className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{event.ubicacion}</p>
          <p className="whitespace-pre-line leading-relaxed">{event.descripcion}</p>
        </div>
        <aside className="h-fit rounded-2xl bg-card p-5 shadow-card"><RegisterButton event={event} /></aside>
      </div>
    </article>
  );
}
