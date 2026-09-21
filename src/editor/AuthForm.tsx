import { AuthForm as SharedAuthForm } from "../components/AuthForm";

/** Přihlášení do editoru: text pro výrobce + společný formulář. */
export function AuthForm() {
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

      <SharedAuthForm redirectPath="/editor" nameLabel="Název firmy nebo tvoje jméno" nameHint="Nepovinné, půjde změnit později." />
    </div>
  );
}
