import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LANGS, DEFAULT_LANG, asLang, basenameOf, type Lang } from "../lib/lang";

const ORIGIN = "https://www.barfingapp.com";

const setLink = (selector: string, href: string, hreflang?: string) => {
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement("link");
    link.rel = hreflang ? "alternate" : "canonical";
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
};

/**
 * <html lang>, canonical a hreflang pro aktuální stránku. Statický index.html
 * je zná jen pro českou homepage, tak se doplňují za běhu při každé změně cesty.
 */
export const LangHead = () => {
  const { pathname } = useLocation(); // bez basename — z něj se složí adresa v každém jazyce
  const { i18n } = useTranslation();

  useEffect(() => {
    const url = (lang: Lang) => `${ORIGIN}${basenameOf(lang)}${pathname}`;
    document.documentElement.lang = i18n.language;
    setLink('link[rel="canonical"]', url(asLang(i18n.language)));
    for (const lang of LANGS) setLink(`link[rel="alternate"][hreflang="${lang}"]`, url(lang), lang);
    setLink('link[rel="alternate"][hreflang="x-default"]', url(DEFAULT_LANG), "x-default");
  }, [pathname, i18n.language]);

  return null;
};
