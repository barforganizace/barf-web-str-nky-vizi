import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { Button, Card, ErrorText, Field, inputClass } from "./ui";

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

export function AuthForm() {
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
            emailRedirectTo: `${window.location.origin}/editor`,
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
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <div className="pt-4">
        <span className="mb-4 inline-block rounded-full bg-lime-faint px-3 py-1 text-xs font-bold text-lime-ink">Pro výrobce a prodejce</span>
        <h1 className="text-[32px] font-extrabold leading-tight text-fg-1 sm:text-[40px]">Editor produktů</h1>
        <p className="mt-4 max-w-[520px] text-base leading-relaxed text-fg-4">
          Sestav mix, menu nebo balíček ze surovin a hned uvidíš, kolik má energie, bílkovin, vápníku a dalších živin.
          Hotový produkt pošleš ke schválení — a po schválení ho lidé najdou přímo v BarfingApp.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-fg-3">
          {[
            "Přes 2 000 surovin z databází USDA a BLS plus standardní katalog BarfingApp.",
            "Živiny na 100 g se počítají automaticky z receptury.",
            "Produkt schvaluje tým BarfingApp, pak se objeví v appce.",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-[11px] font-black text-[#191c1d]">✓</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

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
              <Field label="Název firmy nebo tvoje jméno" hint="Nepovinné, půjde změnit později.">
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="organization" />
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
    </div>
  );
}
