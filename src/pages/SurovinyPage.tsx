import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, X } from "lucide-react";
import { SharedNav } from "../components/SharedNav";
import {
  BUCKET_COLOR,
  BUCKET_ORDER,
  MACROS,
  MICRO_SECTIONS,
  foodPhoto,
  normalize,
  useFoods,
  type Bucket,
  type Food,
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

const FoodDetail = ({ food, onClose }: { food: Food; onClose: () => void }): JSX.Element => {
  const { t, i18n } = useTranslation();
  const fmt = (n: number, decimals: number) => n.toLocaleString(i18n.language, { maximumFractionDigits: decimals });

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
              {t(`foods_page.bucket.${food.bucket}`)}
            </p>
            <h2 className="text-[24px] font-bold leading-tight text-gray-900">{food.name}</h2>
            {food.description && <p className="mt-2 text-sm leading-relaxed text-gray-600">{food.description}</p>}
          </div>

          <section className="flex flex-col gap-4 rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[20px] font-semibold text-black">{t("foods_page.macros")}</p>
                <p className="text-[11px] font-medium text-gray-500">{t("foods_page.per_100g")}</p>
              </div>
              <div className="flex items-baseline gap-1 text-black">
                <span className="text-[32px] font-bold leading-none">{fmt(food.kcal, 0)}</span>
                <span className="text-xs">kcal</span>
              </div>
            </div>
            {MACROS.map((m) => (
              <div key={m.key}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{t(`foods_page.nutrient.${m.key}`)}</span>
                  <span>
                    <span className="text-sm font-bold text-gray-900">{fmt(food.values[m.key], m.decimals)}</span>
                    <span className="text-xs font-medium text-gray-500"> {m.unit}</span>
                  </span>
                </div>
                {/* Gramy na 100 g jsou rovnou procenta, bar tak má přirozený strop. */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#f2f4f7]">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, food.values[m.key])}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-5 rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
            <div>
              <p className="text-[20px] font-semibold text-black">{t("foods_page.micros")}</p>
              <p className="text-[11px] font-medium text-gray-500">{t("foods_page.per_100g")}</p>
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
                        <span className="text-sm font-bold text-gray-900">{fmt(food.values[row.key], row.decimals)}</span>
                        <span className="text-xs font-medium text-gray-500"> {row.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

  useEffect(() => {
    const previous = document.title;
    document.title = `${t("foods_page.title")} — BarfingApp`;
    return () => {
      document.title = previous;
    };
  }, [t]);

  const q = normalize(query.trim());
  const visible = foods.filter((f) => (!bucket || f.bucket === bucket) && (!q || f.search.includes(q)));
  // Stejně jako v appce: seskupené podle složek, uvnitř podle názvu.
  const items = BUCKET_ORDER.flatMap((b) => visible.filter((f) => f.bucket === b));

  return (
    <div className="min-h-screen bg-app-2">
      <SharedNav />

      <main className="mx-auto w-full max-w-[1020px] px-5 py-12 sm:px-8 lg:py-16">
        <header className="mb-10 max-w-[640px]">
          <h1 className="mb-3 text-[36px] font-extrabold leading-[1.1] tracking-[-0.015em] text-fg-1 lg:text-[46px]">
            {t("foods_page.title")}
          </h1>
          <p className="text-[17px] leading-[1.6] text-fg-5">{t("foods_page.subtitle")}</p>
          {foods.length > 0 && (
            <p className="mt-3 text-[13px] font-medium text-fg-6">{t("foods_page.count", { count: foods.length })}</p>
          )}
        </header>

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
              <button
                key={food.id}
                type="button"
                onClick={() => setSelected(food)}
                data-umami-event="suroviny-detail"
                title={t("foods_page.open_detail")}
                className="flex w-full items-center gap-3 rounded-3xl bg-white p-3 text-left transition-colors hover:bg-[#fafbfc]"
                style={{ boxShadow: CARD_SHADOW }}
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
                    {t(`foods_page.bucket.${food.bucket}`)}
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2f4f7] text-gray-900">
                  <Plus className="h-5 w-5" />
                </span>
              </button>
            ))}
          </div>
        )}

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

      {selected && <FoodDetail food={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
