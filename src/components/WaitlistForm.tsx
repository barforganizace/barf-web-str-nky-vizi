import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

export const WaitlistForm = ({ dark = false }: { dark?: boolean }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Zadej platný e-mail.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      // Resend API — vlož svůj API klíč do .env jako VITE_RESEND_API_KEY
      const apiKey = import.meta.env.VITE_RESEND_API_KEY as string | undefined;

      if (apiKey) {
        // Pošle notifikaci tobě (provozovatel) o novém zájemci
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: "BarfingApp Waitlist <onboarding@resend.dev>",
            to: ["barfingapp@gmail.com"],
            subject: "Nový zájemce o BarfingApp",
            html: `<p>Nový zájemce: <strong>${email}</strong></p>`,
          }),
        });
      }

      // Vždy zobrazíme úspěch (i bez API klíče pro demo)
      setState("success");
      setEmail("");
    } catch {
      setState("error");
      setErrorMsg("Něco se pokazilo. Zkus to znovu.");
    }
  };

  if (state === "success") {
    return (
      <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${dark ? "bg-white/10" : "bg-[#f0fdf4] border border-[#bbf7d0]"}`}>
        <span className="text-2xl">✅</span>
        <div>
          <p className={`text-sm font-semibold ${dark ? "text-white" : "text-[#166534]"}`}>
            Jsi na listině!
          </p>
          <p className={`text-xs ${dark ? "text-white/60" : "text-[#166534]/70"}`}>
            Dáme ti vědět, až bude BarfingApp ke stažení.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
          placeholder="tvuj@email.cz"
          className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#c3e96b] ${
            dark
              ? "border-0 bg-white/10 text-white placeholder:text-white/40"
              : "border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400"
          } ${state === "error" ? "ring-2 ring-red-400" : ""}`}
          disabled={state === "loading"}
        />
        {state === "error" && errorMsg && (
          <p className="mt-1 text-xs text-red-400">{errorMsg}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 rounded-xl bg-[#c3e96b] px-6 py-3 text-sm font-bold text-[#191c1d] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "loading" ? "Odesílám…" : "Notifikovat mě"}
      </button>
    </form>
  );
};
