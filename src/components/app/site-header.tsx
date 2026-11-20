import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, History, LayoutDashboard, LogOut, Menu, PlusCircle, Settings, User } from "lucide-react";
import { useState } from "react";
import logoUtp from "@/assets/logo-utp.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const linkCls =
  "rounded-lg px-3 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-primary-soft hover:text-primary";
const activeCls = "bg-primary-soft text-primary";

export function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };
}

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src={logoUtp.url} alt="Logo de la Universidad Tecnológica de Panamá" className="size-10 rounded-full bg-card p-0.5 shadow-sm sm:size-11" />
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold tracking-tight ${light ? "text-primary-foreground" : "text-primary"}`}>
          Actividades UTP
        </span>
        <span className={`hidden text-[11px] font-medium sm:block ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          Universidad Tecnológica de Panamá
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, profile, isStaff, isAdmin } = useAuth();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <Link to="/" className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: true }} onClick={() => setOpen(false)}>
        Inicio
      </Link>
      <Link to="/cronograma" className={linkCls} activeProps={{ className: activeCls }} onClick={() => setOpen(false)}>
        Cronograma
      </Link>
      {user && (
        <>
          <Link to="/mi-horario" className={linkCls} activeProps={{ className: activeCls }} onClick={() => setOpen(false)}>
            Mi horario
          </Link>
          <Link to="/historial" className={linkCls} activeProps={{ className: activeCls }} onClick={() => setOpen(false)}>
            Historial
          </Link>
        </>
      )}
      {isStaff && (
        <Link to="/mis-eventos" className={linkCls} activeProps={{ className: activeCls }} onClick={() => setOpen(false)}>
          Mis eventos
        </Link>
      )}
      {isAdmin && (
        <Link to="/admin" className={linkCls} activeProps={{ className: activeCls }} onClick={() => setOpen(false)}>
          Administración
        </Link>
      )}
    </>
  );

  const initials = (profile?.nombre || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="h-1 bg-band" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px]">
        <BrandMark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {links}
        </nav>
        <div className="flex items-center gap-2">
          {isStaff && (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/mis-eventos/nuevo">
                <PlusCircle /> Crear evento
              </Link>
            </Button>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full focus-visible:ring-2 focus-visible:ring-ring" aria-label="Menú de cuenta">
                <Avatar className="size-9 border-2 border-primary/30">
                  {profile?.foto_url && <AvatarImage src={profile.foto_url} alt="" />}
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {profile?.nombre || "Mi cuenta"}
                  <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/perfil"><User /> Mi perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/mi-horario"><CalendarDays /> Mi horario</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/historial"><History /> Historial</Link></DropdownMenuItem>
                {isStaff && <DropdownMenuItem asChild><Link to="/mis-eventos"><LayoutDashboard /> Mis eventos</Link></DropdownMenuItem>}
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Settings /> Administración</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}><LogOut /> Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth" search={{ redirect: undefined, mode: undefined }}>Iniciar sesión</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-primary">Actividades UTP</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4" aria-label="Menú móvil">
                {links}
                {isStaff && (
                  <Link to="/mis-eventos/nuevo" className={linkCls} onClick={() => setOpen(false)}>
                    Crear evento
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
