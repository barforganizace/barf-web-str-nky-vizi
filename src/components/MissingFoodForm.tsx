import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { track } from "../lib/analytics";

/* Anonymní návrh chybějící suroviny. Ukládá se do food_suggestions — bez
 * přihlášení, bez e-mailu, bez IP. Limity délky sedí s CHECK v databázi.
 */
const NAME_MAX = 120;
const NOTE_MAX = 600;

type State = "idle" | "sending" | "sent" | "error";

export const MissingFoodForm = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<State>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;

    setState("sending");
    const { error } = await supabase.from("food_suggestions").insert({
      name: name.trim(),
      note: note.trim() || null,
      locale: i18n.language,
    });

    if (error) {
      setState("error");
      return;
    }
    track("suroviny-navrh-odeslan");
    setState("sent");
  };

  if (state === "sent") {
    return (
      <section className="mt-12 rounded-feature border border-hairline bg-surface px-7 py-8 sm:px-8">
        <p className="text-[18px] font-extrabold tracking-[-0.01em] text-fg-1">{t("foods_page.missing.sent_title")}</p>
        <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-fg-5">{t("foods_page.missing.sent_desc")}</p>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-feature border border-hairline bg-surface px-7 py-8 sm:px-8">
      <h2 className="text-[20px] font-extrabold tracking-[-0.01em] text-fg-1">{t("foods_page.missing.title")}</h2>
      <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-fg-5">{t("foods_page.missing.desc")}</p>

      <form onSubmit={submit} className="mt-6 flex max-w-[520px] flex-col gap-3">
        <input
          type="text"
          value={name}
          maxLength={NAME_MAX}
          onChange={(e) => { setName(e.target.value); setState("idle"); }}
          placeholder={t("foods_page.missing.name_placeholder")}
          aria-label={t("foods_page.missing.name_label")}
          className="h-12 rounded-card border border-hairline bg-app-2 px-4 text-[15px] text-fg-1 placeholder:text-fg-6 focus:outline-none focus:ring-2 focus:ring-lime"
        />
        <textarea
          value={note}
          rows={3}
          maxLength={NOTE_MAX}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("foods_page.missing.note_placeholder")}
          aria-label={t("foods_page.missing.note_label")}
          className="resize-none rounded-card border border-hairline bg-app-2 px-4 py-3 text-[15px] leading-relaxed text-fg-1 placeholder:text-fg-6 focus:outline-none focus:ring-2 focus:ring-lime"
        />

        {state === "error" && <p className="text-[13px] font-medium text-red-500">{t("foods_page.missing.error")}</p>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            disabled={name.trim().length < 2 || state === "sending"}
            data-umami-event="suroviny-navrh-odeslan"
            className="h-12 shrink-0 rounded-card bg-lime px-7 text-sm font-bold text-navy transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {state === "sending" ? t("foods_page.missing.sending") : t("foods_page.missing.submit")}
          </button>
          <p className="text-[13px] leading-relaxed text-fg-6">{t("foods_page.missing.anonymous")}</p>
        </div>
      </form>
    </section>
  );
};
