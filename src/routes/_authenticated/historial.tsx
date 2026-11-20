import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/_authenticated/historial")({
  head: () => ({
    meta: [
      { title: "Historial · Actividades UTP" },
      { name: "description", content: "Eventos asistidos y horas de labor social acumuladas." },
      { property: "og:title", content: "Historial · Actividades UTP" },
      { property: "og:description", content: "Eventos asistidos y horas de labor social acumuladas." },
    ],
  }),
  component: () => <ComingSoon title="Historial" description="Eventos asistidos y horas de labor social acumuladas." />,
});
