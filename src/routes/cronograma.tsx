import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { publicEventsQuery } from "@/lib/data";
import { EventCard } from "@/components/app/event-card";
import { PageHero } from "@/components/app/page-hero";

export const Route = createFileRoute("/cronograma")({
  head: () => ({
    meta: [
      { title: "Cronograma · Actividades UTP" },
      { name: "description", content: "Todos los eventos de la UTP del año, por mes." },
      { property: "og:title", content: "Cronograma · Actividades UTP" },
      { property: "og:description", content: "Todos los eventos de la UTP del año, por mes." },
    ],
  }),
  component: Cronograma,
});

function Cronograma() {
  const { data, isLoading } = useQuery(publicEventsQuery);
  return (
    <>
      <PageHero eyebrow="Cronograma" title="Todas las actividades" description="Eventos de la universidad ordenados por fecha." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Cargando eventos…</p>}
        {data?.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </>
  );
}
