import { createClient } from "@supabase/supabase-js";

// Stejný Supabase projekt jako appka (nhkxabxbgjwjsujetpcx) — editor sdílí
// uživatele, suroviny i katalog potravin.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);
