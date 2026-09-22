import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { DOG_SELECT, type Dog } from "../account/dogs";

// Jedna session pro celý web: editor výrobců (/editor) i účet majitele psa (/ucet).
// Účet je jeden — role se pozná z dat: člen firmy má řádek v organization_members,
// majitel psa má řádek v dogs. Jeden člověk může být obojí.
interface Session {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  /** Člen aspoň jedné firmy → má smysl mu ukázat editor produktů. */
  hasOrg: boolean;
  dogs: Dog[];
  dogsLoading: boolean;
  refetchDogs: () => Promise<void>;
}

const SessionContext = createContext<Session>({
  user: null, loading: true, isAdmin: false, hasOrg: false, dogs: [], dogsLoading: true, refetchDogs: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasOrg, setHasOrg] = useState(false);
  // Psi se drží spolu s uživatelem, ke kterému patří. Jinak by hned po přihlášení
  // chvíli platil prázdný seznam z odhlášeného stavu a účet by poslal do průvodce,
  // i když už je pes uložený.
  const [loaded, setLoaded] = useState<{ userId: string | null; dogs: Dog[] } | null>(null);
  const userId = user?.id ?? null;
  const dogs = loaded?.userId === userId ? loaded.dogs : [];
  const dogsLoading = loaded?.userId !== userId;

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
    if (!userId) {
      setIsAdmin(false);
      setHasOrg(false);
      return;
    }
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(data === true));
    supabase.from("organization_members").select("user_id").eq("user_id", userId).limit(1)
      .then(({ data }) => setHasOrg((data?.length ?? 0) > 0));
  }, [userId]);

  const refetchDogs = useCallback(async () => {
    if (!userId) {
      setLoaded({ userId: null, dogs: [] });
      return;
    }
    const { data, error } = await supabase.from("dogs").select(DOG_SELECT).order("created_at", { ascending: true });
    if (error) console.error("[db] dogs.select:", error.message);
    setLoaded({ userId, dogs: (data ?? []) as Dog[] });
  }, [userId]);

  useEffect(() => {
    if (!loading) refetchDogs();
  }, [loading, refetchDogs]);

  return (
    <SessionContext.Provider value={{ user, loading, isAdmin, hasOrg, dogs, dogsLoading, refetchDogs }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
