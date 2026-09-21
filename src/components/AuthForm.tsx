import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { Button, Card, ErrorText, Field, inputClass } from "../editor/ui";

// Přihlášení a registrace — společné pro editor výrobců (/editor) i účet
// majitele psa (/ucet). Účet je jeden pro web i appku; liší se jen popisek
// jména a cesta, na kterou se uživatel vrátí z potvrzovacího e-mailu.

const AUTH_MESSAGES: [string, string][] = [
  ["Invalid login credentials", "Nesprávný e-mail nebo heslo."],
  ["Email not confirmed", "Nejdřív potvrď e-mail — odkaz máš ve schránce."],
  ["User already registered", "Tenhle e-mail už je zaregistrovaný. Zkus se přihlásit."],
  ["Password should be at least", "Heslo musí mít aspoň 6 znaků."],
  ["Unable to validate email", "Tohle nevypadá jako platný e-mail."],
  ["rate limit", "Příliš mnoho pokusů. Zkus to za chvíli."],
];

function authMessage(e: unknown): string {
  const raw = e instanceof Error ? e.message : "";
  return AUTH_MESSAGES.find(([needle]) => raw.toLowerCase().includes(needle.toLowerCase()))?.[1] ?? (raw || "Něco se pokazilo.");
}

interface Props {
  /** Cesta na webu, kam vede odkaz z potvrzovacího e-mailu. */
  redirectPath: string;
  nameLabel: string;
  nameHint?: string;
}

export function AuthForm({ redirectPath, nameLabel, nameHint }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectPath}`,
            data: name ? { display_name: name } : undefined,
          },
        });
        if (signUpError) throw signUpError;
        // Bez session = zapnuté potvrzování e-mailu, uživatel musí kliknout na odkaz.
        if (!data.session) setSent(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-5 flex gap-1 rounded-xl bg-app p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); setSent(false); }}
            className={`h-10 flex-1 rounded-lg text-sm font-bold transition ${mode === m ? "bg-surface text-fg-1 shadow-soft" : "text-fg-5 hover:text-fg-2"}`}
          >
            {m === "login" ? "Přihlásit se" : "Registrace"}
          </button>
        ))}
      </div>

      {sent ? (
        <div className="rounded-xl bg-lime-faint px-4 py-4 text-sm text-lime-ink">
          <p className="font-bold">Poslali jsme ti potvrzovací e-mail.</p>
          <p className="mt-1">Klikni na odkaz v něm a pak se sem vrať a přihlas se.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <Field label={nameLabel} hint={nameHint}>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
          )}
          <Field label="E-mail">
            <input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="Heslo" hint={mode === "register" ? "Aspoň 6 znaků." : undefined}>
            <input
              className={inputClass}
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          </Field>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" variant="lime" className="w-full" disabled={loading}>
            {loading ? "Chvilku…" : mode === "login" ? "Přihlásit se" : "Vytvořit účet"}
          </Button>
          <p className="text-center text-xs text-fg-6">
            Stejný účet funguje i v appce BarfingApp.
          </p>
        </form>
      )}
    </Card>
  );
}
