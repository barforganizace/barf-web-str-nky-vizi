export type GlossaryEntry = { term: string; definition: string };

/**
 * Slovníček pojmů pro blog. V markdownu se pojem označí odkazem
 * `[text](#pojem:slug)` a vyrenderuje se jako klikací bublina.
 */
const glossary: Record<"cs" | "en", Record<string, GlossaryEntry>> = {
  cs: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "Evropská federace výrobců krmiv. Vydává oficiální nutriční tabulky — kolik bílkovin, vápníku a dalších živin pes denně potřebuje podle váhy, věku a aktivity. Kalkulačka v appce počítá dávky právě podle nich.",
    },
  },
  en: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "The European pet food industry federation. It publishes official nutrition tables — how much protein, calcium and other nutrients a dog needs per day based on weight, age and activity. The calculator in the app runs on exactly these tables.",
    },
  },
};

export const getGlossaryEntry = (lang: string, slug: string): GlossaryEntry | undefined =>
  glossary[lang.startsWith("en") ? "en" : "cs"][slug];
