import { Link } from "@tanstack/react-router";
import logoUtp from "@/assets/logo-utp.png.asset.json";
import logoFisc from "@/assets/logo-fisc.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary-deep text-primary-foreground">
      <div className="h-1.5 bg-band" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logoUtp.url} alt="Logo de la UTP" className="size-14 rounded-full bg-card p-1" />
            <img src={logoFisc.url} alt="Logo de la FISC" className="size-14 rounded-full bg-card p-1" />
          </div>
          <p className="font-display text-xl font-extrabold">Actividades UTP</p>
          <p className="max-w-sm text-sm text-primary-foreground/70">
            Todas las actividades de la Universidad Tecnológica de Panamá en un solo lugar: descubre, inscríbete y
            lleva el registro de tu participación.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Explorar</p>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/" className="hover:text-gold">Inicio</Link></li>
            <li><Link to="/cronograma" className="hover:text-gold">Cronograma</Link></li>
            <li><Link to="/mi-horario" className="hover:text-gold">Mi horario</Link></li>
            <li><Link to="/historial" className="hover:text-gold">Historial</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gold">Universidad</p>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><a href="https://utp.ac.pa" target="_blank" rel="noreferrer" className="hover:text-gold">utp.ac.pa</a></li>
            <li>Campus Víctor Levi Sasso, Ciudad de Panamá</li>
            <li>Centros regionales en todo el país</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Universidad Tecnológica de Panamá
      </div>
    </footer>
  );
}
