import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Ban, Flame, Plus, Search, Snowflake, X } from "lucide-react";
import { SharedNav } from "../components/SharedNav";
import { BowlPanel, type BowlItem } from "../components/BowlPanel";
import { MissingFoodForm } from "../components/MissingFoodForm";
import {
  BUCKET_COLOR,
  BUCKET_ORDER,
  FLAG_STYLE,
  MACROS,
  MICRO_SECTIONS,
  foodPhoto,
  normalize,
  useFoods,
  type Bucket,
  type Food,
  type FoodFlag,
} from "../lib/foods";

/* Katalog surovin z databáze appky.
 *
 * Vzhled kopíruje výběr suroviny v appce (IngredientPicker): hledání nahoře,
 * filtr podle složek, bílé zaoblené karty s barevnou tečkou složky a tlačítkem
 * plus. Detail suroviny je stejná karta jako v appce (FoodNutrientCards).
 * Barvy jsou natvrdo jako v AppScreens: jde o obraz appky, ne o tokeny webu.
 */
const CARD_SHADOW = "0 4px 5.3px rgba(0,0,0,0.03), 0 -4px 5.3px rgba(0,0,0,0.03)";
const DOT_EDGE = "inset 0 0 0 0.5px rgba(0,0,0,0.10)";

const bucketKey = (food: Food) =>
  food.supplementary ? "foods_page.bucket.supplementary" : `foods_page.bucket.${food.bucket}`;

const FLAG_ICON: Record<FoodFlag, typeof Ban> = { toxic: Ban, never_cook: Snowflake, must_cook: Flame };

/** Štítek vlastnosti: v seznamu samotný text (karta je už obarvená), v detailu pastelová plaketka. */
const FlagLabel = ({ flag, filled }: { flag: FoodFlag; filled?: boolean }): JSX.Element => {
  const { t } = useTranslation();
  const Icon = FLAG_ICON[flag];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${filled ? "rounded-full px-2.5 py-1" : ""}`}
      style={{ color: FLAG_STYLE[flag].text, backgroundColor: filled ? FLAG_STYLE[flag].bg : undefined }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {t(`foods_page.flag.${flag}`)}
    </span>
  );
};

/** Tečka složky: jednobarevná, u složených surovin koláč (kuřecí křídla = kosti + svalovina). */
const BucketDot = ({ food, size }: { food: Food; size: number }): JSX.Element => {
  const parts = Object.entries(food.composition ?? {}).filter(([, share]) => (share ?? 0) > 0) as [Bucket, number][];
  if (parts.length <= 1) {
    return (
      <span
        className="shrink-0 rounded-full"
        style={{ width: size, height: size, backgroundColor: BUCKET_COLOR[parts[0]?.[0] ?? food.bucket], boxShadow: DOT_EDGE }}
      />
    );
  }
  let cursor = 0;
  const stops = parts.map(([bucket, share]) => {
    const start = cursor;
    cursor += share * 100;
    return `${BUCKET_COLOR[bucket]} ${start}% ${cursor}%`;
  });
  return (
    <span
      className="shrink-0 rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(from -90deg, ${stops.join(", ")})`, boxShadow: DOT_EDGE }}
    />
  );
};

const FoodDetail = ({
  food,
  onClose,
  onAdd,
}: {
  food: Food;
  onClose: () => void;
  onAdd: (food: Food, grams: number) => void;
}): JSX.Element => {
  const { t, i18n } = useTranslation();
  const fmt = (n: number, decimals: number) => n.toLocaleString(i18n.language, { maximumFractionDigits: decimals });

  // Databáze má hodnoty na 100 g; uživatel si je přepočítá na svoji porci.
  const [gramsText, setGramsText] = useState("100");
  const grams = Math.max(0, Number(gramsText) || 0);
  // null = bez ověřeného zdroje, radši pomlčka než falešná nula.
  const show = (per100g: number | null, decimals: number) =>
    per100g == null ? "–" : fmt((per100g * grams) / 100, decimals);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={food.name}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[32px] bg-[#f2f4f7] sm:rounded-[32px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("foods_page.close")}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition-colors hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        {food.photo && (
          <img src={foodPhoto(food.photo, 920)} alt={food.name} className="aspect-[4/3] w-full bg-white object-cover" />
        )}

        <div className="flex flex-col gap-4 p-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
              <BucketDot food={food} size={12} />
              {t(bucketKey(food))}
            </p>
            <h2 className="text-[24px] font-bold leading-tight text-gray-900">{food.name}</h2>
            {food.flag && (
              <p className="mt-2">
                <FlagLabel flag={food.flag} filled />
              </p>
            )}
            {food.description && <p className="mt-2 text-sm leading-relaxed text-gray-600">{food.description}</p>}
          </div>

          <label className="flex items-center justify-between gap-3 rounded-3xl bg-white py-3 pl-5 pr-3" style={{ boxShadow: CARD_SHADOW }}>
            <span className="text-sm font-semibold text-gray-900">{t("foods_page.amount_label")}</span>
            <span className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={10}
                value={gramsText}
                onChange={(e) => setGramsText(e.target.value)}
                className="h-10 w-24 rounded-full bg-[#f2f4f7] px-4 text-right text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c3e366]"
              />
              <span className="text-sm font-medium text-gray-500">g</span>
            </span>
          </label>

          <button
            type="button"
            onClick={() => onAdd(food, grams)}
            disabled={grams <= 0}
            data-umami-event="suroviny-do-misky"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c3e366] text-sm font-bold text-[#191c1d] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="h-5 w-5" />
            {t("foods_page.bowl.add", { grams })}
          </button>

          <section className="flex flex-col gap-4 rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[20px] font-semibold text-black">{t("foods_page.macros")}</p>
                <p className="text-[11px] font-medium text-gray-500">{t("foods_page.per_grams", { grams })}</p>
              </div>
              <div className="flex items-baseline gap-1 text-black">
                <span className="text-[32px] font-bold leading-none">{show(food.kcal, 0)}</span>
                <span className="text-xs">kcal</span>
              </div>
            </div>
            {MACROS.map((m) => (
              <div key={m.key}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{t(`foods_page.nutrient.${m.key}`)}</span>
                  <span>
                    <span className="text-sm font-bold text-gray-900">{show(food.values[m.key], m.decimals)}</span>
                    <span className="text-xs font-medium text-gray-500"> {m.unit}</span>
                  </span>
                </div>
                {/* Gramy na 100 g jsou rovnou procenta, bar tak má přirozený strop. */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#f2f4f7]">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, food.values[m.key] ?? 0)}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-5 rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
            <div>
              <p className="text-[20px] font-semibold text-black">{t("foods_page.micros")}</p>
              <p className="text-[11px] font-medium text-gray-500">{t("foods_page.per_grams", { grams })}</p>
            </div>
            {MICRO_SECTIONS.map((section) => (
              <div key={section.key}>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  {t(`foods_page.section.${section.key}`)}
                </p>
                <div className="divide-y divide-[#f2f4f7]">
                  {section.rows.map((row) => (
                    <div key={row.key} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-900">{t(`foods_page.nutrient.${row.key}`)}</span>
                      <span>
                        <span className="text-sm font-bold text-gray-900">{show(food.values[row.key], row.decimals)}</span>
                        <span className="text-xs font-medium text-gray-500"> {row.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[11px] leading-relaxed text-gray-500">
              {food.omegaSource
                ? t("foods_page.omega_source", food.omegaSource)
                : t("foods_page.omega_no_source")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const chipClass = (active: boolean) =>
  `flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
    active ? "border-navy bg-navy text-fg-0" : "border-hairline bg-surface text-fg-4 hover:border-strong"
  }`;

export const SurovinyPage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const { foods, loading, error } = useFoods(i18n.language);

  const [query, setQuery] = useState("");
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [selected, setSelected] = useState<Food | null>(null);
  const [bowl, setBowl] = useState<BowlItem[]>([]);
  const bowlRestored = useRef(false);

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("foods_page.title")} — BarfingApp`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  // Miska přežije obnovení stránky: v localStorage jen id a gramy, suroviny se
  // dohledají v katalogu, až se načte.
  useEffect(() => {
    if (bowlRestored.current || foods.length === 0) return;
    bowlRestored.current = true;
    try {
      const saved = JSON.parse(localStorage.getItem("barf-bowl") ?? "[]") as { id: string; grams: number }[];
      setBowl(saved.flatMap((s) => {
        const food = foods.find((f) => f.id === s.id);
        return food ? [{ food, grams: s.grams }] : [];
      }));
    } catch {
      /* bez uložené misky */
    }
  }, [foods]);

  useEffect(() => {
    if (!bowlRestored.current) return;
    try {
      localStorage.setItem("barf-bowl", JSON.stringify(bowl.map((b) => ({ id: b.food.id, grams: b.grams }))));
    } catch {
      /* soukromé okno apod. */
    }
  }, [bowl]);

  const addToBowl = (food: Food, grams: number) => {
    setBowl((prev) =>
      prev.some((b) => b.food.id === food.id)
        ? prev.map((b) => (b.food.id === food.id ? { ...b, grams: b.grams + grams } : b))
        : [...prev, { food, grams }],
    );
    setSelected(null);
  };
  const setGrams = (foodId: string, grams: number) =>
    setBowl((prev) => prev.map((b) => (b.food.id === foodId ? { ...b, grams } : b)));
  const removeFromBowl = (foodId: string) => setBowl((prev) => prev.filter((b) => b.food.id !== foodId));

  const q = normalize(query.trim());
  const visible = foods.filter((f) => (!bucket || f.bucket === bucket) && (!q || f.search.includes(q)));
  // Stejně jako v appce: seskupené podle složek, uvnitř podle názvu.
  const items = BUCKET_ORDER.flatMap((b) => visible.filter((f) => f.bucket === b));

  return (
    <div className="min-h-screen bg-app-2">
      <SharedNav />

      <main className="mx-auto w-full max-w-[1020px] px-5 py-12 sm:px-8 lg:py-16">
        <header className="mb-8 max-w-[640px]">
          <h1 className="mb-3 text-[36px] font-extrabold leading-[1.1] tracking-[-0.015em] text-fg-1 lg:text-[46px]">
            {t("foods_page.title")}
          </h1>
          <p className="text-[17px] leading-[1.6] text-fg-5">{t("foods_page.subtitle")}</p>
          {foods.length > 0 && (
            <p className="mt-3 text-[13px] font-medium text-fg-6">{t("foods_page.count", { count: foods.length })}</p>
          )}
        </header>

        {/* Pod nadpisem přes celou šířku: vlevo miska s inventářem, vpravo nutriční hodnoty. */}
        <div className="mb-10">
          <BowlPanel items={bowl} onGrams={setGrams} onRemove={removeFromBowl} />
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="relative max-w-[420px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("foods_page.search_placeholder")}
              aria-label={t("foods_page.search_placeholder")}
              className="h-12 w-full rounded-full border-0 bg-white pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lime"
              style={{ boxShadow: CARD_SHADOW }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setBucket(null)} className={chipClass(bucket === null)}>
              {t("foods_page.filter_all")}
            </button>
            {BUCKET_ORDER.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBucket(bucket === b ? null : b)}
                data-umami-event={`suroviny-filtr-${b}`}
                className={chipClass(bucket === b)}
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BUCKET_COLOR[b], boxShadow: DOT_EDGE }} />
                {t(`foods_page.bucket.${b}`)}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="py-10 text-[15px] text-fg-5">{t("foods_page.loading")}</p>}
        {error && <p className="py-10 text-[15px] text-fg-5">{t("foods_page.error")}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="py-10 text-[15px] text-fg-5">{t("foods_page.no_results")}</p>
        )}

        {items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((food) => (
              <div
                key={food.id}
                className="flex items-center gap-3 rounded-3xl p-3 transition-colors hover:bg-[var(--card-hover)]"
                style={
                  {
                    boxShadow: CARD_SHADOW,
                    backgroundColor: food.flag ? FLAG_STYLE[food.flag].bg : "#ffffff",
                    "--card-hover": food.flag ? FLAG_STYLE[food.flag].hover : "#fafbfc",
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  onClick={() => setSelected(food)}
                  data-umami-event="suroviny-detail"
                  title={t("foods_page.open_detail")}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  {food.photo ? (
                    <img
                      src={foodPhoto(food.photo, 160)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 shrink-0 rounded-2xl bg-[#f2f4f7] object-cover"
                    />
                  ) : (
                    <span className="h-14 w-14 shrink-0 rounded-2xl bg-[#f2f4f7]" />
                  )}
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-base font-semibold text-gray-900">{food.name}</span>
                    <span className="flex items-center gap-1.5 truncate text-sm text-gray-500">
                      <BucketDot food={food} size={10} />
                      {t(bucketKey(food))}
                    </span>
                    {food.flag && <FlagLabel flag={food.flag} />}
                  </span>
                </button>
                {/* Plus jako v appce: hodí 100 g do misky, detail se otevírá klikem na kartu. */}
                <button
                  type="button"
                  onClick={() => addToBowl(food, 100)}
                  data-umami-event="suroviny-do-misky"
                  title={t("foods_page.bowl.add", { grams: 100 })}
                  aria-label={`${t("foods_page.bowl.add", { grams: 100 })}: ${food.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2f4f7] text-gray-900 transition-colors hover:bg-[#c3e366]"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <MissingFoodForm />

        <div className="mt-14 rounded-feature bg-navy px-7 py-10 text-center sm:px-10">
          <h2 className="mb-2.5 text-[22px] font-extrabold tracking-[-0.01em] text-fg-0 sm:text-[26px]">
            {t("foods_page.cta_title")}
          </h2>
          <p className="mx-auto mb-7 max-w-[420px] text-[15px] leading-relaxed text-white/65">{t("foods_page.cta_desc")}</p>
          <a
            href="/#stahnout"
            data-umami-event="suroviny-cta-stahnout"
            className="inline-flex h-12 items-center justify-center rounded-card bg-lime px-7 text-sm font-bold text-navy transition-opacity hover:opacity-90"
          >
            {t("foods_page.cta_btn")}
          </a>
        </div>
      </main>

      {selected && <FoodDetail food={selected} onClose={() => setSelected(null)} onAdd={addToBowl} />}
    </div>
  );
};
