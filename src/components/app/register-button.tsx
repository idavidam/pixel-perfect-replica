import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CalendarCheck, CheckCircle2, Info, Loader2, Lock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError, myRegistrationsQuery } from "@/lib/data";
import { canCancel, findConflicts, getRegistrationState } from "@/lib/event-rules";
import { formatTimeRange, formatShortDate } from "@/lib/format";
import type { EventFull } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RegisterButton({ event, size = "xl" }: { event: EventFull; size?: "lg" | "xl" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: myRegs } = useQuery(myRegistrationsQuery(user?.id));
  const mine = myRegs?.find((r) => r.event_id === event.id);
  const isRegistered = mine?.estado === "inscrito";
  const state = getRegistrationState(event, isRegistered);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const activeOthers = (myRegs ?? [])
    .filter((r) => r.estado === "inscrito" && r.event && r.event_id !== event.id)
    .map((r) => r.event!);
  const conflicts = findConflicts(event, activeOthers);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["events"] });
    qc.invalidateQueries({ queryKey: ["registrations"] });
  };

  const register = useMutation({
    mutationFn: async () => {
      if (mine) {
        const { error } = await supabase.from("registrations").update({ estado: "inscrito" }).eq("id", mine.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("registrations").insert({ event_id: event.id, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("¡Inscripción confirmada!", { description: "El evento ya aparece en Mi horario." });
      invalidate();
    },
    onError: (e) => toast.error("No se pudo completar la inscripción", { description: friendlyError(e) }),
  });

  const cancel = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("registrations").update({ estado: "cancelado" }).eq("id", mine!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Inscripción cancelada");
      invalidate();
    },
    onError: (e) => toast.error("No se pudo cancelar", { description: friendlyError(e) }),
  });

  const onRegister = () => {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/eventos/${event.id}`, mode: undefined } });
      return;
    }
    if (conflicts.length > 0) {
      setConflictOpen(true);
      return;
    }
    register.mutate();
  };

  const busy = register.isPending || cancel.isPending;
  const cls = "w-full";

  if (state === "inscrito") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-success/12 px-4 py-3 font-semibold text-success">
          <CheckCircle2 className="size-5" /> Estás inscrito
        </div>
        {canCancel(event) && (
          <Button variant="outline" className={cls} onClick={() => setCancelOpen(true)} disabled={busy}>
            {cancel.isPending ? <Loader2 className="animate-spin" /> : <XCircle />} Cancelar inscripción
          </Button>
        )}
        <Button asChild variant="soft" className={cls}>
          <Link to="/mi-horario"><CalendarCheck /> Ver en Mi horario</Link>
        </Button>
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cancelar tu inscripción?</AlertDialogTitle>
              <AlertDialogDescription>
                Liberarás tu cupo en “{event.titulo}”. Podrás volver a inscribirte si aún hay cupos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mantener inscripción</AlertDialogCancel>
              <AlertDialogAction onClick={() => cancel.mutate()}>Sí, cancelar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (state !== "disponible") {
    const map = {
      cancelado: { icon: XCircle, text: "Evento cancelado" },
      finalizado: { icon: Lock, text: "Evento finalizado" },
      informativo: { icon: Info, text: "Solo informativo · sin inscripción" },
      agotado: { icon: XCircle, text: "Cupos agotados" },
      cerrado: { icon: Lock, text: "Inscripción cerrada" },
    } as const;
    const { icon: Icon, text } = map[state];
    return (
      <Button size={size} variant="secondary" className={cls} disabled>
        <Icon /> {text}
      </Button>
    );
  }

  return (
    <>
      <Button size={size} className={cls} onClick={onRegister} disabled={busy}>
        {register.isPending ? <Loader2 className="animate-spin" /> : <CalendarCheck />}
        {event.modo_inscripcion === "opcional" ? "Inscribirme (opcional)" : "Inscribirme"}
      </Button>
      {event.modo_inscripcion === "opcional" && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          La inscripción es opcional: nos ayuda a estimar la asistencia.
        </p>
      )}
      <AlertDialog open={conflictOpen} onOpenChange={setConflictOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-warning" /> Conflicto de horario
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Este evento coincide con otro en el que ya estás inscrito:</p>
                <ul className="space-y-1">
                  {conflicts.map((c) => (
                    <li key={c.id} className="rounded-lg bg-muted px-3 py-2 text-foreground">
                      <span className="font-semibold">{c.titulo}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatShortDate(c.fecha_inicio)} · {formatTimeRange(c.fecha_inicio, c.fecha_fin)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p>Puedes inscribirte de todos modos.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction onClick={() => register.mutate()}>Inscribirme de todos modos</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
