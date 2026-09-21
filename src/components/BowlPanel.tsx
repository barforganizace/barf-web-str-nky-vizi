import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useSession } from "../lib/session";
import { dailyTargets } from "../lib/targets";
import { MACROS, MICRO_SECTIONS, type Food, type NutrientDef } from "../lib/foods";

/* Miska vedle katalogu surovin: co uživatel naházel, kolik to má, a jak to
 * sedí na denní cíle jeho psa (profil z /ucet). Bary jsou delší než cíl:
 * čárka na 80 % délky je cíl, výplň za ní ukazuje překročení. */

export interface BowlItem {
  food: Food;
  grams: number;
}

const CARD_SHADOW = "0 4px 5.3px rgba(0,0,0,0.03), 0 -4px 5.3px rgba(0,0,0,0.03)";
const TARGET_AT = 0.8;
const MICRO_COLOR = "#66c8e3";
const KCAL: NutrientDef = { key: "kcal", unit: "kcal", decimals: 0, color: "#c3e366" };
const RATION: NutrientDef = { key: "ration_g", unit: "g", decimals: 0, color: "#1c232e" };

const TargetBar = ({
  label,
  value,
  target,
  def,
  fmt,
}: {
  label: string;
  value: number;
  target: number | undefined;
  def: NutrientDef;
  fmt: (n: number, decimals: number) => string;
}): JSX.Element => {
  const hasTarget = target != null && target > 0;
  const ratio = hasTarget ? value / target : 0;
  const width = hasTarget ? Math.min(100, ratio * TARGET_AT * 100) : 0;
  const over = hasTarget && ratio > 1;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-sm text-gray-900">{label}</span>
        <span className="flex items-center gap-1.5">
          {over && (
            <span className="rounded-full bg-[#fdeceb] px-1.5 py-0.5 text-[10px] font-extrabold text-[#c23c34]">
              {Math.round(ratio * 100)} %
            </span>
          )}
          <span>
            <span className="text-sm font-bold text-gray-900">{fmt(value, def.decimals)}</span>
            <span className="text-xs font-medium text-gray-500">
              {hasTarget ? ` / ${fmt(target, def.decimals)} ${def.unit}` : ` ${def.unit}`}
            </span>
          </span>
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-[#f2f4f7]">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${width}%`, backgroundColor: def.color ?? MICRO_COLOR }} />
        {hasTarget && (
          <span
            aria-hidden="true"
            className="absolute -top-[3px] h-[14px] w-[2px] rounded-full bg-gray-900"
            style={{ left: `calc(${TARGET_AT * 100}% - 1px)` }}
          />
        )}
      </div>
    </div>
  );
};

export function BowlPanel({
  items,
  onGrams,
  onRemove,
}: {
  items: BowlItem[];
  onGrams: (foodId: string, grams: number) => void;
  onRemove: (foodId: string) => void;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const { user, dogs } = useSession();
  const [dogId, setDogId] = useState<string | null>(null);
  const [showMicro, setShowMicro] = useState(false);

  const dog = dogs.find((d) => d.id === dogId) ?? dogs[0];
  const targets = dog?.daily_targets ? dailyTargets(dog.daily_targets) : null;
  const fmt = (n: number, decimals: number) => n.toLocaleString(i18n.language, { maximumFractionDigits: decimals });

  // Součet misky; surovina bez ověřené hodnoty (null) se do součtu nepočítá.
  const totals: Record<string, number> = { kcal: 0, ration_g: 0 };
  for (const { food, grams } of items) {
    totals.ration_g += grams;
    totals.kcal += (food.kcal * grams) / 100;
    for (const [key, value] of Object.entries(food.values)) {
      if (value != null) totals[key] = (totals[key] ?? 0) + (value * grams) / 100;
    }
  }

  const bar = (def: NutrientDef, label: string) => (
    <TargetBar key={def.key} label={label} value={totals[def.key] ?? 0} target={targets?.[def.key]} def={def} fmt={fmt} />
  );

  return (
    <aside className="rounded-3xl bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[20px] font-semibold text-black">{t("foods_page.bowl.title")}</p>
          {dog && <p className="text-[11px] font-medium text-gray-500">{t("foods_page.bowl.targets_for", { name: dog.name })}</p>}
        </div>
        <div className="flex items-baseline gap-1 text-black">
          <span className="text-[32px] font-bold leading-none">{fmt(totals.ration_g, 0)}</span>
          <span className="text-xs">g</span>
        </div>
      </div>

      {dogs.length > 1 && (
        <select
          value={dog?.id ?? ""}
          onChange={(e) => setDogId(e.target.value)}
          aria-label={t("foods_page.bowl.dog_select")}
          className="mb-4 h-9 w-full rounded-full bg-[#f2f4f7] px-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c3e366]"
        >
          {dogs.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      )}

      {!user && (
        <div className="mb-4 rounded-2xl bg-[#f2f4f7] p-3">
          <p className="mb-2 text-sm text-gray-600">{t("foods_page.bowl.login_text")}</p>
          <Link to="/ucet" className="inline-flex h-9 items-center rounded-full bg-navy px-4 text-sm font-bold text-white transition hover:bg-navy-2">
            {t("foods_page.bowl.login_btn")}
          </Link>
        </div>
      )}
      {user && !dog && (
        <div className="mb-4 rounded-2xl bg-[#f2f4f7] p-3">
          <p className="mb-2 text-sm text-gray-600">{t("foods_page.bowl.no_dog_text")}</p>
          <Link to="/ucet/pruvodce" className="inline-flex h-9 items-center rounded-full bg-navy px-4 text-sm font-bold text-white transition hover:bg-navy-2">
            {t("foods_page.bowl.no_dog_btn")}
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <p className="mb-4 text-sm text-gray-500">{t("foods_page.bowl.empty")}</p>
      ) : (
        <ul className="mb-4 flex flex-col gap-2">
          {items.map(({ food, grams }) => (
            <li key={food.id} className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">{food.name}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={10}
                value={grams}
                onChange={(e) => onGrams(food.id, Math.max(0, Number(e.target.value) || 0))}
                aria-label={food.name}
                className="h-8 w-[72px] rounded-full bg-[#f2f4f7] px-3 text-right text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#c3e366]"
              />
              <span className="text-xs font-medium text-gray-500">g</span>
              <button
                type="button"
                onClick={() => onRemove(food.id)}
                aria-label={`${t("foods_page.bowl.remove")}: ${food.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-[#f2f4f7] hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3">
        {bar(RATION, t("foods_page.bowl.ration"))}
        {bar(KCAL, t("foods_page.nutrient.kcal_per_100g"))}
        {MACROS.map((m) => bar(m, t(`foods_page.nutrient.${m.key}`)))}
      </div>

      <label className="mt-5 flex cursor-pointer items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-900">{t("foods_page.bowl.micro_toggle")}</span>
        <button
          type="button"
          role="switch"
          aria-checked={showMicro}
          onClick={() => setShowMicro((v) => !v)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${showMicro ? "bg-[#c3e366]" : "bg-gray-300"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${showMicro ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </label>

      {showMicro && (
        <div className="mt-4 flex flex-col gap-5">
          {MICRO_SECTIONS.map((section) => (
            <div key={section.key} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{t(`foods_page.section.${section.key}`)}</p>
              {section.rows.map((row) => bar(row, t(`foods_page.nutrient.${row.key}`)))}
            </div>
          ))}
        </div>
      )}

      {targets && <p className="mt-4 text-[11px] leading-relaxed text-gray-500">{t("foods_page.bowl.tick_note")}</p>}
    </aside>
  );
}
