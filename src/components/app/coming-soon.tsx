import { PageHero } from "./page-hero";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <>
      <PageHero eyebrow="Actividades UTP" title={title} description={description} />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted-foreground">
        Esta sección aún está en construcción.
      </div>
    </>
  );
}
