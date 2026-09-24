import { asLang, type Lang } from "./lang";

export type GlossaryEntry = { term: string; definition: string };

/**
 * Slovníček pojmů pro blog. V markdownu se pojem označí odkazem
 * `[text](#pojem:slug)` a vyrenderuje se jako klikací bublina.
 */
const glossary: Record<Lang, Record<string, GlossaryEntry>> = {
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
  de: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "Der europäische Verband der Heimtiernahrungsindustrie. Er veröffentlicht die offiziellen Nährstofftabellen — wie viel Protein, Kalzium und andere Nährstoffe ein Hund pro Tag je nach Gewicht, Alter und Aktivität braucht. Genau nach diesen Tabellen rechnet der Rechner in der App.",
    },
  },
  es: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "La federación europea de la industria de alimentos para mascotas. Publica las tablas nutricionales oficiales: cuánta proteína, calcio y otros nutrientes necesita un perro al día según su peso, edad y actividad. La calculadora de la app se basa exactamente en estas tablas.",
    },
  },
  fr: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "La fédération européenne de l'industrie des aliments pour animaux de compagnie. Elle publie les tableaux nutritionnels officiels : la quantité de protéines, de calcium et d'autres nutriments dont un chien a besoin par jour selon son poids, son âge et son activité. Le calculateur de l'appli se base exactement sur ces tableaux.",
    },
  },
  it: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "La federazione europea dell'industria degli alimenti per animali da compagnia. Pubblica le tabelle nutrizionali ufficiali: quante proteine, calcio e altri nutrienti servono a un cane al giorno in base a peso, età e attività. Il calcolatore dell'app si basa proprio su queste tabelle.",
    },
  },
  pl: {
    fediaf: {
      term: "FEDIAF",
      definition:
        "Europejska federacja producentów karm dla zwierząt. Publikuje oficjalne tabele żywieniowe — ile białka, wapnia i innych składników odżywczych pies potrzebuje dziennie w zależności od wagi, wieku i aktywności. Kalkulator w aplikacji liczy dawki właśnie według nich.",
    },
  },
};

export const getGlossaryEntry = (lang: string, slug: string): GlossaryEntry | undefined =>
  glossary[asLang(lang)][slug];
