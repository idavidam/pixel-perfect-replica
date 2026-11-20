import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery, rolesQuery } from "./data";
import type { AppRole, Profile } from "./types";

type AuthValue = {
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  roles: AppRole[];
  isOrganizer: boolean;
  isAdmin: boolean;
  isStaff: boolean;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const { data: profile } = useQuery(profileQuery(user?.id));
  const { data: roles } = useQuery(rolesQuery(user?.id));
  const r = roles ?? [];
  const isAdmin = r.includes("administrador");
  const isOrganizer = r.includes("organizador");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile: profile ?? null,
        roles: r,
        isAdmin,
        isOrganizer,
        isStaff: isAdmin || isOrganizer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
