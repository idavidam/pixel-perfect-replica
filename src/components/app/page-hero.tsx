import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: ReactNode }) {
  return (
    <section className="bg-hero text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-extrabold sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-primary-foreground/80">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
