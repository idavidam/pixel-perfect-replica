import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/_authenticated/mi-horario")({
  head: () => ({
    meta: [
      { title: "Mi horario · Actividades UTP" },
      { name: "description", content: "Tus eventos inscritos y los que organizas, por semana y por mes." },
      { property: "og:title", content: "Mi horario · Actividades UTP" },
      { property: "og:description", content: "Tus eventos inscritos y los que organizas, por semana y por mes." },
    ],
  }),
  component: () => <ComingSoon title="Mi horario" description="Tus eventos inscritos y los que organizas, por semana y por mes." />,
});
