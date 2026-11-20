import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil · Actividades UTP" },
      { name: "description", content: "Tu nombre, carrera, facultad, sede e ID estudiantil." },
      { property: "og:title", content: "Mi perfil · Actividades UTP" },
      { property: "og:description", content: "Tu nombre, carrera, facultad, sede e ID estudiantil." },
    ],
  }),
  component: () => <ComingSoon title="Mi perfil" description="Tu nombre, carrera, facultad, sede e ID estudiantil." />,
});
