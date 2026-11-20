import { cn } from "@/lib/utils";
import type { Organization } from "@/lib/types";

export function OrgLogo({
  org,
  className,
}: {
  org: Pick<Organization, "nombre" | "siglas" | "logo_url"> | null | undefined;
  className?: string;
}) {
  if (!org) return null;
  if (org.logo_url) {
    return (
      <img
        src={org.logo_url}
        alt={`Logo de ${org.nombre}`}
        className={cn("size-10 rounded-full bg-card object-contain", className)}
        loading="lazy"
      />
    );
  }
  const initials = org.siglas || org.nombre.split(" ").map((w) => w[0]).join("").slice(0, 3);
  return (
    <span
      aria-label={org.nombre}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full bg-primary-soft font-display text-xs font-extrabold text-primary",
        className,
      )}
    >
      {initials}
    </span>
  );
}
