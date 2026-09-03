import { supabase } from "../lib/supabase";

// Datová vrstva editoru. Tabulky organizations / products / product_versions /
// product_components a funkce create_product, product_nutrients,
// new_product_version, approve_product, reject_product žijí v Supabase
// (viz supabase/migrations). Přístup hlídá RLS: člen firmy vidí jen svoje
// produkty, admin všechno.

export const CATEGORIES = [
  { value: "mix", label: "Mix více surovin" },
  { value: "complete_menu", label: "Kompletní menu" },
  { value: "monoprotein", label: "Monoprotein" },
  { value: "rmb", label: "Masité kosti" },
  { value: "treat", label: "Pamlsek" },
];

export const categoryLabel = (value: string) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value;

export const STATUS_LABEL: Record<string, string> = {
  draft: "Rozpracováno",
  in_review: "Čeká na schválení",
  published: "V databázi appky",
  rejected: "Vráceno k úpravě",
  archived: "Archivováno",
};

export interface Organization {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  org_id: string;
  name: string;
  category: string;
  status: string;
  description: string | null;
  current_version_id: string | null;
  food_id: string | null;
  review_note: string | null;
  updated_at: string;
}

export interface Version {
  id: string;
  version: number;
  net_weight_g: number | null;
  photos: { front?: string };
  is_frozen: boolean;
}

export interface Component {
  id: string;
  ingredient_id: string | null;
  food_id: string | null;
  grams: number;
  name: string;
  /** "USDA SR28" | "BLS 4.0" | "BarfingApp" */
  source: string;
}

export interface CatalogItem {
  kind: "ingredient" | "food";
  id: string;
  name: string;
  source: string;
  group: string;
  /** Název bez diakritiky a malými písmeny — pro hledání. */
  search: string;
}

export interface Nutrients {
  per100g: Record<string, number | null>;
  coverage: Record<string, number>;
  buckets: Record<"muscle" | "rmb" | "organs" | "other", number | null>;
  liver_pct: number;
  total_percent: number;
}

export interface ReviewProduct extends Product {
  organizations: { name: string; email: string | null } | null;
}

const PRODUCT_COLS = "id, org_id, name, category, status, description, current_version_id, food_id, review_note, updated_at";
const VERSION_COLS = "id, version, net_weight_g, photos, is_frozen";
const COMPONENT_COLS = "id, ingredient_id, food_id, grams, ingredients ( name_cs, source ), foods ( food_translations ( locale, name ) )";

const FOOD_GROUP: Record<string, string> = {
  muscle_meat: "Maso",
  bone: "Kosti",
  liver: "Játra",
  organ: "Vnitřnosti",
  fruit: "Ovoce",
  vegetable: "Zelenina",
  supplement: "Doplňky",
};

const INGREDIENT_GROUP: Record<string, string> = {
  maso: "Maso",
  droby: "Vnitřnosti",
  jatra: "Játra",
  kosti: "Kosti",
  ryby: "Ryby",
  "zelenina-ovoce": "Zelenina a ovoce",
  "vejce-mlecne": "Vejce a mléčné",
  oleje: "Oleje",
  ostatni: "Ostatní",
};

type Translation = { locale: string; name: string };

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Něco se pokazilo.";
}

function czechName(translations: Translation[] | null | undefined): string {
  if (!translations?.length) return "";
  return translations.find((t) => t.locale === "cs")?.name ?? translations[0].name;
}

/** Odstraní diakritiku a převede na malá písmena (hledání „kureci" najde „Kuřecí"). */
export function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// ---------- firma ----------

export async function myOrganization(userId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("organizations ( id, name )")
    .eq("user_id", userId)
    .order("created_at")
    .limit(1);
  fail(error);
  const org = data?.[0]?.organizations as Organization | Organization[] | null | undefined;
  return Array.isArray(org) ? org[0] ?? null : org ?? null;
}

export async function createOrganization(fields: { name: string; email: string; website: string; ico: string }) {
  // Trigger organizations_add_creator přidá zakladatele jako vlastníka.
  const { error } = await supabase.from("organizations").insert({
    name: fields.name,
    email: fields.email || null,
    website: fields.website || null,
    ico: fields.ico || null,
  });
  fail(error);
}

// ---------- produkty ----------

export async function listProducts(orgId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLS)
    .eq("org_id", orgId)
    .order("updated_at", { ascending: false });
  fail(error);
  return (data ?? []) as Product[];
}

export async function createProduct(orgId: string, name: string, category: string): Promise<string> {
  const { data, error } = await supabase.rpc("create_product", { p_org_id: orgId, p_name: name, p_category: category });
  fail(error);
  return data as string;
}

export async function loadProduct(id: string) {
  const { data: product, error } = await supabase.from("products").select(PRODUCT_COLS).eq("id", id).maybeSingle();
  fail(error);
  if (!product) throw new Error("Produkt nenalezen.");
  const { data: version, error: versionError } = await supabase
    .from("product_versions")
    .select(VERSION_COLS)
    .eq("id", product.current_version_id)
    .maybeSingle();
  fail(versionError);
  if (!version) throw new Error("Produkt nemá aktuální verzi.");
  return {
    product: product as Product,
    version: version as Version,
    components: await loadComponents(version.id),
  };
}

interface ComponentRow {
  id: string;
  ingredient_id: string | null;
  food_id: string | null;
  grams: number | string | null;
  ingredients: { name_cs: string; source: string } | null;
  foods: { food_translations: Translation[] } | { food_translations: Translation[] }[] | null;
}

export async function loadComponents(versionId: string): Promise<Component[]> {
  const { data, error } = await supabase
    .from("product_components")
    .select(COMPONENT_COLS)
    .eq("version_id", versionId)
    .order("position");
  fail(error);
  return ((data ?? []) as unknown as ComponentRow[]).map((r) => {
    const food = Array.isArray(r.foods) ? r.foods[0] : r.foods;
    return {
      id: r.id,
      ingredient_id: r.ingredient_id,
      food_id: r.food_id,
      grams: Number(r.grams ?? 0),
      name: r.ingredients?.name_cs ?? czechName(food?.food_translations),
      source: r.ingredients?.source ?? "BarfingApp",
    };
  });
}

export async function updateProduct(id: string, fields: Partial<Pick<Product, "name" | "category" | "description" | "status">>) {
  const { error } = await supabase
    .from("products")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  fail(error);
}

export async function updateVersion(id: string, fields: Partial<Pick<Version, "net_weight_g" | "photos">>) {
  const { error } = await supabase.from("product_versions").update(fields).eq("id", id);
  fail(error);
}

/** Uloží celé složení verze: gramy zadává uživatel, procenta se dopočítají. */
export async function saveComponents(versionId: string, components: Component[]) {
  const total = components.reduce((sum, c) => sum + c.grams, 0);
  const rows = components.map((c, position) => ({
    id: c.id,
    version_id: versionId,
    ingredient_id: c.ingredient_id,
    food_id: c.food_id,
    grams: c.grams,
    percent: total > 0 ? Math.round((c.grams / total) * 10000) / 100 : 0,
    position,
  }));
  if (rows.length > 0) {
    const { error } = await supabase.from("product_components").upsert(rows);
    fail(error);
  }
  let remove = supabase.from("product_components").delete().eq("version_id", versionId);
  if (rows.length > 0) remove = remove.not("id", "in", `(${rows.map((r) => r.id).join(",")})`);
  const { error } = await remove;
  fail(error);
}

export async function productNutrients(versionId: string): Promise<Nutrients> {
  const { data, error } = await supabase.rpc("product_nutrients", { p_version_id: versionId });
  fail(error);
  return data as Nutrients;
}

export async function newVersion(productId: string) {
  const { error } = await supabase.rpc("new_product_version", { p_product_id: productId });
  fail(error);
}

export async function uploadPhoto(orgId: string, productId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${orgId}/${productId}/front-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("product-photos").upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return path;
}

export const photoUrl = (path: string) =>
  supabase.storage.from("product-photos").getPublicUrl(path).data.publicUrl;

// ---------- katalog surovin ----------

/** Standardní databáze appky (foods) + master surovin (ingredients, USDA/BLS).
 *  Načte se jednou a hledá se v prohlížeči — bez diakritiky a okamžitě. */
export async function loadCatalog(): Promise<CatalogItem[]> {
  const items: CatalogItem[] = [];

  const { data: foods, error } = await supabase
    .from("foods")
    .select("id, category, food_translations ( locale, name )")
    .eq("is_active", true);
  fail(error);
  for (const f of (foods ?? []) as { id: string; category: string; food_translations: Translation[] }[]) {
    const name = czechName(f.food_translations);
    if (!name) continue;
    items.push({ kind: "food", id: f.id, name, source: "BarfingApp", group: FOOD_GROUP[f.category] ?? "Ostatní", search: fold(name) });
  }

  // PostgREST vrací max 1000 řádků na dotaz, surovin je přes 2000.
  const page = 1000;
  for (let from = 0; ; from += page) {
    const { data, error: ingredientError } = await supabase
      .from("ingredients")
      .select("id, name_cs, source, category_app")
      .eq("is_active", true)
      .order("name_cs")
      .range(from, from + page - 1);
    fail(ingredientError);
    for (const i of (data ?? []) as { id: string; name_cs: string; source: string; category_app: string }[]) {
      items.push({ kind: "ingredient", id: i.id, name: i.name_cs, source: i.source, group: INGREDIENT_GROUP[i.category_app] ?? "Ostatní", search: fold(i.name_cs) });
    }
    if (!data || data.length < page) break;
  }
  return items;
}

export function searchCatalog(items: CatalogItem[], query: string): CatalogItem[] {
  const words = fold(query).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const score = (item: CatalogItem) =>
    (item.search.startsWith(words[0]) ? 0 : 2) + (item.kind === "food" ? 0 : 1);
  return items
    .filter((item) => words.every((w) => item.search.includes(w)))
    .sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name, "cs"))
    .slice(0, 30);
}

// ---------- admin ----------

export async function listAllProducts(): Promise<ReviewProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`${PRODUCT_COLS}, organizations ( name, email )`)
    .order("updated_at", { ascending: false });
  fail(error);
  return (data ?? []) as unknown as ReviewProduct[];
}

export async function loadVersion(id: string): Promise<Version> {
  const { data, error } = await supabase.from("product_versions").select(VERSION_COLS).eq("id", id).maybeSingle();
  fail(error);
  if (!data) throw new Error("Verze nenalezena.");
  return data as Version;
}

export async function approveProduct(id: string) {
  const { error } = await supabase.rpc("approve_product", { p_product_id: id });
  fail(error);
}

export async function rejectProduct(id: string, note: string) {
  const { error } = await supabase.rpc("reject_product", { p_product_id: id, p_note: note });
  fail(error);
}
