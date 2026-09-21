import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

// Katalog surovin appky — tabulky foods + food_translations ve sdíleném
// Supabase projektu. Složky (svalovina, kosti, …), jejich barvy i seznam
// živin jsou převzaté z appky (barf-dog-nutrition-main: src/lib/barf.ts,
// src/components/FoodNutrientCards.tsx, src/index.css), aby katalog na webu
// vypadal stejně jako výběr suroviny v appce.

export type Bucket = "muscle" | "rmb" | "organs" | "liver" | "other";

export const BUCKET_ORDER: Bucket[] = ["muscle", "rmb", "organs", "liver", "other"];

export const BUCKET_COLOR: Record<Bucket, string> = {
  muscle: "#e66c6c",
  rmb: "#e6dcc5",
  organs: "#b886f7",
  liver: "#c4b5fd",
  other: "#58d37e",
};

const bucketOf = (category: string): Bucket => {
  if (category === "muscle_meat") return "muscle";
  if (category === "bone") return "rmb";
  if (category === "liver") return "liver";
  if (category === "organ") return "organs";
  return "other";
};

export interface NutrientDef {
  /** Sloupec tabulky foods — hodnota na 100 g. */
  key: string;
  unit: string;
  decimals: number;
  /** Barva baru (jen makra, podle Figmy appky). */
  color?: string;
}

export const MACROS: NutrientDef[] = [
  { key: "protein_pct", unit: "g", decimals: 1, color: "#e66c6c" },
  { key: "fat_pct", unit: "g", decimals: 1, color: "#ecd053" },
  { key: "carbs_pct", unit: "g", decimals: 1, color: "#93c5fc" },
  { key: "fiber_pct", unit: "g", decimals: 1, color: "#58d37e" },
];

export const MICRO_SECTIONS: { key: string; rows: NutrientDef[] }[] = [
  {
    key: "macrominerals",
    rows: [
      { key: "calcium_mg", unit: "mg", decimals: 0 },
      { key: "phosphorus_mg", unit: "mg", decimals: 0 },
      { key: "magnesium_mg", unit: "mg", decimals: 0 },
      { key: "potassium_mg", unit: "mg", decimals: 0 },
      { key: "sodium_mg", unit: "mg", decimals: 0 },
      { key: "chloride_mg", unit: "mg", decimals: 0 },
    ],
  },
  {
    key: "trace_elements",
    rows: [
      { key: "iron_mg", unit: "mg", decimals: 1 },
      { key: "zinc_mg", unit: "mg", decimals: 1 },
      { key: "copper_mg", unit: "mg", decimals: 2 },
      { key: "manganese_mg", unit: "mg", decimals: 2 },
      { key: "selenium_ug", unit: "µg", decimals: 1 },
      { key: "iodine_ug", unit: "µg", decimals: 1 },
      { key: "chromium_ug", unit: "µg", decimals: 1 },
      { key: "molybdenum_ug", unit: "µg", decimals: 1 },
    ],
  },
  {
    key: "fat_vitamins",
    rows: [
      { key: "vitamin_a_ug", unit: "µg", decimals: 0 },
      { key: "vitamin_d_ug", unit: "µg", decimals: 1 },
      { key: "vitamin_e_mg", unit: "mg", decimals: 1 },
      { key: "vitamin_k_ug", unit: "µg", decimals: 1 },
    ],
  },
  {
    key: "water_vitamins",
    rows: [
      { key: "vitamin_b1_mg", unit: "mg", decimals: 2 },
      { key: "vitamin_b2_mg", unit: "mg", decimals: 2 },
      { key: "vitamin_b3_mg", unit: "mg", decimals: 1 },
      { key: "vitamin_b6_mg", unit: "mg", decimals: 2 },
      { key: "vitamin_b9_ug", unit: "µg", decimals: 1 },
      { key: "vitamin_b12_ug", unit: "µg", decimals: 1 },
      { key: "vitamin_c_mg", unit: "mg", decimals: 1 },
    ],
  },
  {
    key: "fatty_acids",
    rows: [
      { key: "omega3_epa_dha_mg", unit: "mg", decimals: 0 },
      { key: "omega6_la_mg", unit: "mg", decimals: 0 },
    ],
  },
];

const NUTRIENT_KEYS = [...MACROS, ...MICRO_SECTIONS.flatMap((s) => s.rows)].map((n) => n.key);

export interface Food {
  id: string;
  bucket: Bucket;
  /** Doplňková svalovina (dršťky, plíce, vemeno, chrupavky…): počítá se do svaloviny, ale není základ dávky. */
  supplementary: boolean;
  /** Podíly složek u anatomicky složených surovin (kuřecí křídla = kosti + svalovina). */
  composition: Partial<Record<Bucket, number>> | null;
  photo: string | null;
  name: string;
  description: string;
  /** Název bez diakritiky a malými písmeny — pro hledání. */
  search: string;
  kcal: number;
  /** Živiny na 100 g podle sloupců tabulky foods. */
  values: Record<string, number>;
}

interface Translation {
  locale: string;
  name: string;
  description: string | null;
}

interface FoodRow {
  id: string;
  category: string;
  subcategory: string | null;
  photo_url: string | null;
  bucket_composition: Partial<Record<Bucket, number>> | null;
  kcal_per_100g: number | null;
  food_translations: Translation[];
  [nutrient: string]: unknown;
}

/** Malá písmena bez diakritiky — hledání najde „Hovězí" i při zadání „hovezi". */
export const normalize = (text: string): string =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Fotky v úložišti mají okolo 1 MB; Supabase je umí zmenšit za běhu. */
export const foodPhoto = (url: string, width: number): string =>
  `${url.replace("/object/public/", "/render/image/public/")}?width=${width}&quality=80`;

const toFood = (row: FoodRow, locale: string): Food => {
  const tr =
    row.food_translations.find((t) => t.locale === locale) ??
    row.food_translations.find((t) => t.locale === "cs") ??
    row.food_translations[0];
  const values: Record<string, number> = {};
  for (const key of NUTRIENT_KEYS) values[key] = Number(row[key] ?? 0);
  return {
    id: row.id,
    bucket: bucketOf(row.category),
    supplementary: row.subcategory === "supplementary",
    composition: row.bucket_composition,
    photo: row.photo_url,
    name: tr?.name ?? "",
    description: tr?.description ?? "",
    search: normalize(tr?.name ?? ""),
    kcal: Number(row.kcal_per_100g ?? 0),
    values,
  };
};

// Načte se jednou pro oba jazyky; přepnutí jazyka jen přemapuje názvy.
let cache: FoodRow[] | null = null;

const fetchFoods = async (): Promise<FoodRow[]> => {
  if (cache) return cache;
  const { data, error } = await supabase
    .from("foods")
    .select(
      `id, category, subcategory, photo_url, bucket_composition, kcal_per_100g, ${NUTRIENT_KEYS.join(", ")}, food_translations ( locale, name, description )`,
    )
    .eq("is_active", true);
  if (error) throw error;
  cache = data as unknown as FoodRow[];
  return cache;
};

/** Aktivní suroviny z databáze appky s názvy v jazyce webu, seřazené podle názvu. */
export const useFoods = (lang: string): { foods: Food[]; loading: boolean; error: boolean } => {
  const locale = lang.startsWith("cs") ? "cs" : "en";
  const [rows, setRows] = useState<FoodRow[]>(() => cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchFoods()
      .then((result) => {
        if (!cancelled) setRows(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const foods = useMemo(
    () => rows.map((row) => toFood(row, locale)).sort((a, b) => a.name.localeCompare(b.name, locale)),
    [rows, locale],
  );

  return { foods, loading, error };
};
