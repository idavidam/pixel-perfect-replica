import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/coming-soon";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administración · Actividades UTP" },
      { name: "description", content: "Usuarios, roles, categorías, organizaciones, sedes y dominio de correo." },
      { property: "og:title", content: "Administración · Actividades UTP" },
      { property: "og:description", content: "Usuarios, roles, categorías, organizaciones, sedes y dominio de correo." },
    ],
  }),
  component: () => <ComingSoon title="Administración" description="Usuarios, roles, categorías, organizaciones, sedes y dominio de correo." />,
});
