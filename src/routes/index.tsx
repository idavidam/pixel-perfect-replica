import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { publicEventsQuery } from "@/lib/data";
import { EventCard } from "@/components/app/event-card";
import { LogoStrip } from "@/components/app/logo-strip";
import { PageHero } from "@/components/app/page-hero";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Actividades UTP · Eventos de la Universidad Tecnológica de Panamá" },
      { name: "description", content: "Descubre, inscríbete y da seguimiento a las actividades de la UTP." },
      { property: "og:title", content: "Actividades UTP" },
      { property: "og:description", content: "Descubre, inscríbete y da seguimiento a las actividades de la UTP." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useQuery(publicEventsQuery);
  const upcoming = (data ?? []).filter((e) => new Date(e.fecha_fin) > new Date() && e.estado === "publicado").slice(0, 6);
  return (
    <>
      <PageHero eyebrow="Universidad Tecnológica de Panamá" title="Todas las actividades UTP en un solo lugar" description="Conferencias, labor social, giras, ferias y más. Inscríbete con un clic.">
        <Button asChild variant="hero" size="lg"><Link to="/cronograma">Ver cronograma</Link></Button>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 font-display text-2xl font-extrabold">Próximos eventos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>
      <LogoStrip />
    </>
  );
}
