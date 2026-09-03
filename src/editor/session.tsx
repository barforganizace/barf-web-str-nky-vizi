import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface Session {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const SessionContext = createContext<Session>({ user: null, loading: true, isAdmin: false });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Admin = řádek v tabulce admins (funkce is_admin v databázi).
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
  }, [user?.id]);

  return <SessionContext.Provider value={{ user, loading, isAdmin }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
