/* Jazyky webu. Čeština je výchozí a žije bez prefixu, ostatní pod /en/, /de/, …
 * Prefix v URL je zdroj pravdy — každý jazyk má vlastní adresy, které Google umí indexovat. */

export const LANGS = ["cs", "en", "de", "es", "fr", "it", "pl"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "cs";

/** Jak se jazyk jmenuje sám sobě — do přepínače. */
export const LANG_NAMES: Record<Lang, string> = {
  cs: "Čeština",
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pl: "Polski",
};

/** Krátký štítek do lišty; čeština se na webu odjakživa značí CZ. */
export const LANG_LABELS: Record<Lang, string> = { cs: "CZ", en: "EN", de: "DE", es: "ES", fr: "FR", it: "IT", pl: "PL" };

// Stejný klíč, jaký dřív plnil i18next LanguageDetector — kdo si zvolil EN, o volbu nepřijde.
const STORAGE_KEY = "i18nextLng";

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

/** Kód z i18n je vždy jeden z LANGS; cokoli jiného padá na češtinu. */
export const asLang = (value: string): Lang => (isLang(value) ? value : DEFAULT_LANG);

/** Jazyk z prefixu cesty (/de/blog → de). Bez prefixu vrací null. */
export const langFromPath = (pathname: string): Lang | null => {
  const first = pathname.split("/")[1];
  return isLang(first) && first !== DEFAULT_LANG ? first : null;
};

/** Prefix cesty daného jazyka — basename routeru i základ odkazů v přepínači. */
export const basenameOf = (lang: Lang): string => (lang === DEFAULT_LANG ? "" : `/${lang}`);

export const rememberLang = (lang: Lang): void => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // soukromé okno bez úložiště
  }
};

const rememberedLang = (): Lang | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
};

/** Jazyk tohoto načtení stránky: prefix v URL, jinak dřív zvolený jazyk, jinak čeština. */
export const resolveLang = (): Lang => langFromPath(location.pathname) ?? rememberedLang() ?? DEFAULT_LANG;
