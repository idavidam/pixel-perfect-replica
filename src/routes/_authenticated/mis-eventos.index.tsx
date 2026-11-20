import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/_authenticated/mis-eventos/")({
  head: () => ({
    meta: [
      { title: "Mis eventos · Actividades UTP" },
      { name: "description", content: "Edita, duplica y cancela tus eventos, y consulta sus inscritos." },
      { property: "og:title", content: "Mis eventos · Actividades UTP" },
      { property: "og:description", content: "Edita, duplica y cancela tus eventos, y consulta sus inscritos." },
    ],
  }),
  component: () => <ComingSoon title="Mis eventos" description="Edita, duplica y cancela tus eventos, y consulta sus inscritos." />,
});
