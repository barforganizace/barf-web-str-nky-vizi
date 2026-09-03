import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSession } from "./session";
import { AuthForm } from "./AuthForm";
import { Spinner } from "./ui";

function EditorHeader() {
  const { user, isAdmin } = useSession();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-[rgba(245,246,248,0.85)] backdrop-blur-[12px]">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-70" aria-label="BarfingApp">
            <img src="/barfingapp-logo.svg" alt="BarfingApp logo" className="h-8 w-8 object-contain" />
            <span className="hidden text-[20px] font-extrabold text-fg-1 sm:inline">BarfingApp</span>
          </Link>
          <span className="text-fg-7">/</span>
          <Link to="/editor" className="text-sm font-bold text-fg-2 hover:text-navy">Editor produktů</Link>
          {isAdmin && (
            <Link to="/editor/admin" className="rounded-full bg-lime-faint px-3 py-1 text-xs font-bold text-lime-ink hover:opacity-80">
              Schvalování
            </Link>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-xs text-fg-5 sm:inline">{user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="h-9 rounded-full border border-strong px-4 text-xs font-bold text-fg-3 transition hover:bg-app"
            >
              Odhlásit
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

/** Rámec editoru: hlavička, přihlášení (když chybí) a obsah. */
export function EditorShell({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { user, loading, isAdmin } = useSession();

  let body: ReactNode = children;
  if (loading) body = <Spinner />;
  else if (!user) body = <AuthForm />;
  else if (requireAdmin && !isAdmin) body = <p className="py-16 text-center text-fg-5">Tahle stránka je jen pro správce BarfingApp.</p>;

  return (
    <div className="flex min-h-screen flex-col bg-app-2">
      <EditorHeader />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-8 sm:px-8">{body}</main>
    </div>
  );
}
