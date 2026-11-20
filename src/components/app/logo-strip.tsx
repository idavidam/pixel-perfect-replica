import { useQuery } from "@tanstack/react-query";
import { organizationsQuery } from "@/lib/data";
import { OrgLogo } from "./org-logo";

export function LogoStrip() {
  const { data } = useQuery(organizationsQuery);
  const orgs = (data ?? []).filter((o) => o.mostrar_en_franja);
  if (orgs.length === 0) return null;
  const loop = [...orgs, ...orgs];
  return (
    <section aria-label="Facultades y aliados" className="border-y bg-card py-8">
      <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Facultades, organizaciones y aliados
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-12 px-6">
          {loop.map((o, i) => (
            <li key={`${o.id}-${i}`} className="flex items-center gap-3" aria-hidden={i >= orgs.length}>
              <OrgLogo org={o} className="size-14 text-sm" />
              <span className="max-w-44 text-sm font-semibold leading-tight text-foreground/80">{o.nombre}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
