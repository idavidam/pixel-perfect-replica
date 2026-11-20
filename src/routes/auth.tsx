import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Search = { redirect: string | undefined; mode: "registro" | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") ? s.redirect : undefined,
    mode: s.mode === "registro" ? "registro" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Actividades UTP" },
      { name: "description", content: "Ingresa con tu correo institucional para inscribirte en eventos." },
      { property: "og:title", content: "Iniciar sesión · Actividades UTP" },
      { property: "og:description", content: "Ingresa con tu correo institucional para inscribirte en eventos." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(search.mode === "registro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (signup) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { nombre } },
        });
        if (error) throw error;
        toast.success("Revisa tu correo para confirmar tu cuenta.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: search.redirect ?? "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo continuar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-card p-6 shadow-card">
        <h1 className="font-display text-2xl font-extrabold text-primary">{signup ? "Crear cuenta" : "Iniciar sesión"}</h1>
        {signup && (
          <div className="space-y-1.5"><Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
        )}
        <div className="space-y-1.5"><Label htmlFor="email">Correo institucional</Label>
          <Input id="email" type="email" placeholder="nombre@utp.ac.pa" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <Button type="submit" className="w-full" disabled={busy}>{signup ? "Registrarme" : "Entrar"}</Button>
        <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setSignup(!signup)}>
          {signup ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </form>
    </div>
  );
}
