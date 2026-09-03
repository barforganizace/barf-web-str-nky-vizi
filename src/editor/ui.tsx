import type { ButtonHTMLAttributes, ReactNode } from "react";
import { STATUS_LABEL, type Nutrients } from "./api";

export const inputClass =
  "h-11 w-full rounded-xl border border-strong bg-surface px-4 text-sm text-fg-1 outline-none transition placeholder:text-fg-6 focus:border-lime-muted focus:ring-2 focus:ring-lime disabled:bg-app disabled:text-fg-4";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-fg-5">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-fg-6">{hint}</span>}
    </label>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "lime" | "danger";
};

const BUTTON_STYLE = {
  primary: "bg-navy text-fg-0 hover:bg-navy-2",
  secondary: "border-2 border-strong bg-surface text-fg-2 hover:bg-app-2",
  lime: "bg-lime text-[#191c1d] hover:opacity-90",
  danger: "border-2 border-red-200 bg-surface text-red-700 hover:bg-red-50",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-card px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_STYLE[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-panel border border-hairline bg-surface p-5 shadow-soft sm:p-6 ${className}`}>
      {title && <h2 className="mb-4 text-lg font-extrabold text-fg-1">{title}</h2>}
      {children}
    </section>
  );
}

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-app text-fg-4",
  in_review: "bg-amber-100 text-amber-800",
  published: "bg-lime-faint text-lime-ink",
  rejected: "bg-red-50 text-red-700",
  archived: "bg-app text-fg-5",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[status] ?? STATUS_STYLE.draft}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function SourceBadge({ source }: { source: string }) {
  const short = source.startsWith("USDA") ? "USDA" : source.startsWith("BLS") ? "BLS" : source;
  const style = short === "BarfingApp" ? "bg-lime-faint text-lime-ink" : "bg-app text-fg-5";
  return <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${style}`}>{short}</span>;
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-hairline border-t-lime-muted" />
    </div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{children}</p>;
}

// ---------- živiny ----------

/** [klíč v per100g, popisek, jednotka]. Procenta z databáze = gramy na 100 g. */
type NutrientRowDef = [string, string, string];

const BASIC_ROWS: NutrientRowDef[] = [
  ["kcal_per_100g", "Energie", "kcal"],
  ["protein_pct", "Bílkoviny", "g"],
  ["fat_pct", "Tuk", "g"],
  ["carbs_pct", "Sacharidy", "g"],
];

const DETAIL_GROUPS: { title: string; rows: NutrientRowDef[] }[] = [
  {
    title: "Další složení",
    rows: [
      ["moisture_pct", "Voda", "g"],
      ["fiber_pct", "Vláknina", "g"],
    ],
  },
  {
    title: "Minerály",
    rows: [
      ["calcium_mg", "Vápník", "mg"],
      ["phosphorus_mg", "Fosfor", "mg"],
      ["ca_to_p", "Poměr Ca : P", ": 1"],
      ["magnesium_mg", "Hořčík", "mg"],
      ["potassium_mg", "Draslík", "mg"],
      ["sodium_mg", "Sodík", "mg"],
      ["iron_mg", "Železo", "mg"],
      ["zinc_mg", "Zinek", "mg"],
      ["copper_mg", "Měď", "mg"],
      ["manganese_mg", "Mangan", "mg"],
      ["selenium_ug", "Selen", "µg"],
      ["iodine_ug", "Jód", "µg"],
    ],
  },
  {
    title: "Vitamíny",
    rows: [
      ["vitamin_a_ug", "Vitamín A", "µg"],
      ["vitamin_d_ug", "Vitamín D", "µg"],
      ["vitamin_e_mg", "Vitamín E", "mg"],
      ["vitamin_k_ug", "Vitamín K", "µg"],
      ["vitamin_b1_mg", "B1 (thiamin)", "mg"],
      ["vitamin_b2_mg", "B2 (riboflavin)", "mg"],
      ["vitamin_b3_mg", "B3 (niacin)", "mg"],
      ["vitamin_b6_mg", "B6", "mg"],
      ["vitamin_b9_ug", "B9 (folát)", "µg"],
      ["vitamin_b12_ug", "B12", "µg"],
      ["vitamin_c_mg", "Vitamín C", "mg"],
    ],
  },
  {
    title: "Mastné kyseliny",
    rows: [
      ["omega3_epa_dha_mg", "Omega-3 (EPA+DHA)", "mg"],
      ["omega6_la_mg", "Omega-6 (LA)", "mg"],
    ],
  },
];

export function formatNumber(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const digits = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
  return value.toLocaleString("cs-CZ", { maximumFractionDigits: digits });
}

function NutrientRow({ label, value, unit }: { label: string; value: number | null | undefined; unit: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-hairline py-1.5">
      <dt className="text-fg-5">{label}</dt>
      <dd className="font-semibold tabular-nums text-fg-1">
        {formatNumber(value)} <span className="font-normal text-fg-6">{unit}</span>
      </dd>
    </div>
  );
}

const BUCKETS = [
  { key: "muscle", label: "Svalovina", color: "#d9534f" },
  { key: "rmb", label: "Kosti", color: "#e8b923" },
  { key: "organs", label: "Vnitřnosti", color: "#8e5bb5" },
  { key: "other", label: "Ostatní", color: "#5cb85c" },
] as const;

/** Pruh + seznam podílů svalovina / kosti / vnitřnosti / ostatní. */
export function BucketBar({ buckets }: { buckets: Nutrients["buckets"] }) {
  const parts = BUCKETS.map((b) => ({ ...b, share: buckets?.[b.key] ?? 0 }));
  if (parts.every((p) => p.share <= 0)) return null;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-app">
        {parts.filter((p) => p.share > 0).map((p) => (
          <div key={p.key} style={{ width: `${p.share * 100}%`, background: p.color }} title={`${p.label} ${Math.round(p.share * 100)} %`} />
        ))}
      </div>
      <ul className="mt-3 divide-y divide-hairline text-sm">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center justify-between py-1.5">
            <span className="inline-flex items-center gap-2 text-fg-3">
              <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              {p.label}
            </span>
            <span className="font-semibold tabular-nums text-fg-1">{Math.round(p.share * 100)} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NutrientSummary({ nutrients }: { nutrients: Nutrients | null }) {
  if (!nutrients || nutrients.total_percent <= 0) {
    return <p className="text-sm text-fg-5">Přidej suroviny a zadej gramy — živiny se dopočítají samy.</p>;
  }
  const ca = nutrients.per100g.calcium_mg;
  const p = nutrients.per100g.phosphorus_mg;
  const values: Record<string, number | null | undefined> = {
    ...nutrients.per100g,
    ca_to_p: ca != null && p != null && p > 0 ? ca / p : null,
  };

  return (
    <div>
      <BucketBar buckets={nutrients.buckets} />

      <dl className="mt-5 text-sm">
        {BASIC_ROWS.map(([key, label, unit]) => (
          <NutrientRow key={key} label={label} value={values[key]} unit={unit} />
        ))}
      </dl>

      <details className="group mt-4 rounded-xl border border-hairline">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-fg-2 hover:bg-app-2 [&::-webkit-details-marker]:hidden">
          Podrobné živiny
          <span className="text-fg-5 transition group-open:rotate-180">▾</span>
        </summary>
        <div className="border-t border-hairline px-4 pb-4">
          {DETAIL_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-fg-5">{group.title}</h4>
              <dl className="text-sm">
                {group.rows.map(([key, label, unit]) => (
                  <NutrientRow key={key} label={label} value={values[key]} unit={unit} />
                ))}
              </dl>
            </div>
          ))}
        </div>
      </details>

      <p className="mt-3 text-xs text-fg-6">
        Hodnoty na 100 g produktu. Pomlčka znamená, že údaj chybí u víc než 15 % hmotnosti receptury.
      </p>
    </div>
  );
}
