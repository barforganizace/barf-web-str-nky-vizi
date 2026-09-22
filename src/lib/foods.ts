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
  /** Živiny na 100 g podle sloupců tabulky foods; null = hodnota bez ověřeného zdroje. */
  values: Record<string, number | null>;
  /** Řádek USDA SR28 / BLS 4.0, ze kterého jdou omega-3 a omega-6 (food_nutrition_profiles). */
  omegaSource: { version: string; id: string; name: string } | null;
  /** Toxická / nikdy nevařit / jen tepelně upravená; null = běžná surovina. */
  flag: FoodFlag | null;
}

interface Profile {
  source: string;
  source_id: string | null;
  source_name: string | null;
  source_version: string | null;
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
  food_nutrition_profiles: Profile[];
  [nutrient: string]: unknown;
}

/** Vlastnost suroviny, kterou katalog obarvuje. V databázi appky zatím není, drží se tady. */
export type FoodFlag = "toxic" | "never_cook" | "must_cook";

/** Pastelové pozadí karty (a tmavší text štítku) pro každou vlastnost. */
export const FLAG_STYLE: Record<FoodFlag, { bg: string; hover: string; text: string }> = {
  toxic: { bg: "#fdecea", hover: "#fbdfdc", text: "#a1382f" },
  never_cook: { bg: "#eaf3fc", hover: "#dde9f8", text: "#2f6ea3" },
  must_cook: { bg: "#fdf0e2", hover: "#fae4cd", text: "#96591b" },
};

/* Suroviny, které se podávají jen tepelně upravené; zbytek příznaků plyne z kategorie.
 * Zvěřina kvůli Aujeszkyho chorobě a trichinelám — kůň a chovaný králík mají v databázi
 * taky subcategory "game", ale zvěřina to není, proto jmenovitý seznam. */
const MUST_COOK_IDS = new Set([
  "702a5427-731f-4730-8f64-7efd6289ac10", // Divočák
  "0c85323f-f4b7-420d-aeee-f5075540d621", // Daňčí maso
  "8c40218d-0b9e-49c5-b376-34b3dd3e58bf", // Srnčí maso
  "914c4da0-4e64-4384-b334-59fdbf8516db", // Zvěřina (jelení)
  "fc9b60eb-dc25-43c2-bae7-6e5502792888", // Jelení játra
  "c689b537-46e6-45e2-9afc-a310893e6d7c", // Batáty
  "16d2ff5e-eadc-4bfd-ad6b-081e7b14cc9a", // Dýně
]);

const flagOf = (row: FoodRow): FoodFlag | null => {
  if (row.subcategory === "allium") return "toxic"; // cibule, česnek, pórek — hemolytická anémie
  if (row.category === "bone") return "never_cook"; // vařené kosti se štípou
  if (MUST_COOK_IDS.has(row.id)) return "must_cook";
  return null;
};

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
  const values: Record<string, number | null> = {};
  for (const key of NUTRIENT_KEYS) values[key] = row[key] == null ? null : Number(row[key]);
  const profile = row.food_nutrition_profiles.find((p) => p.source === "usda" || p.source === "bls");
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
    omegaSource: profile
      ? { version: profile.source_version ?? profile.source, id: profile.source_id ?? "", name: profile.source_name ?? "" }
      : null,
    flag: flagOf(row),
  };
};

// Načte se jednou pro oba jazyky; přepnutí jazyka jen přemapuje názvy.
let cache: FoodRow[] | null = null;

const fetchFoods = async (): Promise<FoodRow[]> => {
  if (cache) return cache;
  const { data, error } = await supabase
    .from("foods")
    .select(
      `id, category, subcategory, photo_url, bucket_composition, kcal_per_100g, ${NUTRIENT_KEYS.join(", ")}, food_translations ( locale, name, description ), food_nutrition_profiles ( source, source_id, source_name, source_version )`,
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
