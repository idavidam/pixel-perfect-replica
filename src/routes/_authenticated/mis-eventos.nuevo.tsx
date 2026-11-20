import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/_authenticated/mis-eventos/nuevo")({
  head: () => ({
    meta: [
      { title: "Crear evento · Actividades UTP" },
      { name: "description", content: "Crea un evento paso a paso con vista previa en vivo." },
      { property: "og:title", content: "Crear evento · Actividades UTP" },
      { property: "og:description", content: "Crea un evento paso a paso con vista previa en vivo." },
    ],
  }),
  component: () => <ComingSoon title="Crear evento" description="Crea un evento paso a paso con vista previa en vivo." />,
});
