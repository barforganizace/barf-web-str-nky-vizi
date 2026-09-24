import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGS, DEFAULT_LANG, resolveLang } from "../lib/lang";
import cs from "./cs.json";
import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import fr from "./fr.json";
import it from "./it.json";
import pl from "./pl.json";

// Jazyk určuje prefix v URL (viz lib/lang.ts), žádná detekce z prohlížeče.
i18n.use(initReactI18next).init({
  resources: {
    cs: { translation: cs },
    en: { translation: en },
    de: { translation: de },
    es: { translation: es },
    fr: { translation: fr },
    it: { translation: it },
    pl: { translation: pl },
  },
  lng: resolveLang(),
  fallbackLng: DEFAULT_LANG,
  supportedLngs: LANGS,
  interpolation: { escapeValue: false },
});

export default i18n;
