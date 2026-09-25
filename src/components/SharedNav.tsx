import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn, Factory, FlaskConical, Globe, Languages, ChevronDown, Menu, X } from "lucide-react";
import { useSession } from "../lib/session";
import { LANGS, LANG_LABELS, LANG_NAMES, asLang, basenameOf, rememberLang, type Lang } from "../lib/lang";

/* Jednotná pravidla lišty: každý prvek má výšku 40 px, tvar pilulky a jednořádkový text.
 * V liště je jen jedno plné (navy) tlačítko — „Stáhnout appku“. Všechno ostatní je lehčí. */
const control = "inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-colors";
const ghost = `${control} px-3 text-fg-2 hover:bg-black/5`;
const outline = `${control} border border-strong bg-surface px-4 text-fg-1 hover:border-navy`;
const solid = `${control} bg-navy px-5 text-fg-0 hover:bg-navy-2`;

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.barfingapp.app";
const WEB_APP_URL = "https://barfing.net";

/** Nepřihlášený vidí „Přihlásit“, přihlášený zelenou pilulku se jménem (nebo psem, nebo e-mailem). */
const AccountPill = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();
  const { user, dogs } = useSession();
  if (!user) {
    return (
      <Link to="/ucet" data-umami-event="nav-prihlasit" className={`${ghost} ${className}`}>
        <LogIn className="h-4 w-4" />
        {t("nav.login")}
      </Link>
    );
  }
  const name = (user.user_metadata?.display_name as string | undefined) || dogs[0]?.name || user.email?.split("@")[0] || "";
  return (
    <Link
      to="/ucet"
      data-umami-event="nav-ucet"
      title={t("nav.my_account")}
      className={`${control} max-w-[200px] bg-lime pl-1.5 pr-4 text-[#191c1d] hover:opacity-85 ${className}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-xs font-extrabold uppercase text-fg-0">
        {dogs[0]?.avatar_url ? <img src={dogs[0].avatar_url} alt="" className="h-full w-full object-cover" /> : name.slice(0, 1)}
      </span>
      <span className="truncate">{name}</span>
    </Link>
  );
};

/** Přepínač jazyka: v liště štítek s rozbalovací nabídkou, v mobilním menu řada štítků.
 * Položky jsou obyčejné odkazy na tutéž stránku pod jiným prefixem — stránka se načte znovu
 * v novém jazyce a Google odkazy na ostatní verze vidí. */
const LangMenu = ({ mobile = false }: { mobile?: boolean }) => {
  const { i18n } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const current = asLang(i18n.language);
  const href = (lang: Lang) => `${basenameOf(lang)}${pathname}${search}${hash}`;

  if (mobile) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {LANGS.map((lang) => (
          <a
            key={lang}
            href={href(lang)}
            hrefLang={lang}
            lang={lang}
            title={LANG_NAMES[lang]}
            onClick={() => rememberLang(lang)}
            data-umami-event="prepnuti-jazyka-mobil"
            className={`${control} h-9 px-3 text-xs ${lang === current ? "bg-navy text-fg-0" : "border border-strong bg-surface text-fg-2"}`}
          >
            {LANG_LABELS[lang]}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative hidden lg:block">
      <button type="button" aria-haspopup="true" data-umami-event="prepnuti-jazyka" className={`${ghost} gap-1 text-xs`}>
        <Languages className="h-4 w-4" />
        {LANG_LABELS[current]}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>
      <div className="invisible absolute right-0 top-full z-50 w-44 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-card border border-hairline bg-surface p-1.5 shadow-lifted">
          {LANGS.map((lang) => (
            <a
              key={lang}
              href={href(lang)}
              hrefLang={lang}
              lang={lang}
              onClick={() => rememberLang(lang)}
              aria-current={lang === current ? "true" : undefined}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold hover:bg-app-2 ${lang === current ? "text-fg-1" : "text-fg-4"}`}
            >
              {LANG_NAMES[lang]}
              <span className="text-xs text-fg-6">{LANG_LABELS[lang]}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SharedNav = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Kotvy vedou na homepage — z podstránky je potřeba absolutní odkaz.
  const anchor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  const navLinks = [
    { labelKey: "nav.features", href: anchor("funkce"), event: "nav-funkce" },
    { labelKey: "nav.ingredients", href: "/suroviny", event: "nav-suroviny" },
    { labelKey: "nav.blog", href: "/blog", event: "nav-blog" },
  ];
  const isActive = (href: string) => href.startsWith("/") && !href.includes("#") && pathname.startsWith(href);
  const link = (href: string) =>
    `whitespace-nowrap text-sm font-bold transition-colors hover:text-fg-1 ${isActive(href) ? "text-fg-1" : "text-fg-4"}`;

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-hairline bg-[rgba(245,246,248,0.85)] backdrop-blur-[12px]">
        <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center gap-6 px-5 sm:px-8">

          {/* brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-70" aria-label="BarfingApp">
            <img src="/barfingapp-logo.svg" alt="BarfingApp logo" className="h-8 w-8 object-contain" />
            <span className="text-[20px] font-extrabold text-fg-1">BarfingApp</span>
          </Link>

          {/* desktop nav — uprostřed, jen text; nástroje pro výrobce jsou schované pod jednou položkou */}
          <nav aria-label={t("nav.main_navigation")} className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-7">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} data-umami-event={l.event} aria-current={isActive(l.href) ? "page" : undefined} className={link(l.href)}>
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
              <li className="group relative">
                <Link to="/editor" data-umami-event="nav-editor" className={`${link("/editor")} inline-flex items-center gap-1 py-5`}>
                  {t("nav.producers")}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-card border border-hairline bg-surface p-1.5 shadow-lifted">
                    <Link to="/editor" data-umami-event="nav-editor" className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold text-fg-1 hover:bg-app-2">
                      <Factory className="h-4 w-4 text-lime-ink" />
                      {t("nav.editor")}
                    </Link>
                    <span title={t("nav.formulator_soon")} className="flex cursor-default items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold text-fg-5">
                      <FlaskConical className="h-4 w-4" />
                      {t("nav.formulator")}
                      <span className="ml-auto rounded-full bg-fg-8 px-1.5 text-[10px] uppercase tracking-wide">{t("nav.soon")}</span>
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </nav>

          {/* vpravo: od nejlehčího k nejtěžšímu — jazyk, účet, webová verze, stáhnout */}
          <div className="ml-auto flex items-center gap-1.5 lg:gap-2">
            <LangMenu />
            <AccountPill />
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cta-nav-webapp"
              title={t("nav.webapp_btn")}
              className={`${outline} hidden lg:inline-flex lg:w-10 lg:px-0 xl:w-auto xl:px-4`}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden xl:inline">{t("nav.webapp_btn")}</span>
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cta-nav-stahnout"
              className={`${solid} hidden lg:inline-flex`}
            >
              {t("nav.download_btn")}
            </a>

            {/* hamburger — mobil a tablet */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("nav.close_menu") : t("nav.open_menu")}
              aria-expanded={open}
              className={`${ghost} w-10 px-0 lg:hidden`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* mobilní menu */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed left-0 right-0 top-16 z-40 lg:hidden transition-all duration-300 ease-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="mx-4 max-h-[calc(100vh-80px)] overflow-y-auto rounded-panel border border-hairline bg-surface shadow-lifted">
          <ul className="flex flex-col divide-y divide-hairline">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={() => setOpen(false)}
                  data-umami-event={`${l.event}-mobil`}
                  className="flex items-center px-5 py-4 text-[15px] font-bold text-fg-1 hover:bg-app-2"
                >
                  {t(l.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-hairline px-5 pb-2 pt-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-fg-5">{t("nav.producers")}</p>
            <Link to="/editor" onClick={() => setOpen(false)} data-umami-event="nav-editor-mobil" className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 text-[15px] font-bold text-fg-1 hover:bg-app-2">
              <Factory className="h-4 w-4 text-lime-ink" />
              {t("nav.editor")}
            </Link>
            <span className="-mx-2 flex items-center gap-3 px-2 py-3 text-[15px] font-bold text-fg-5">
              <FlaskConical className="h-4 w-4" />
              {t("nav.formulator")}
              <span className="ml-auto rounded-full bg-fg-8 px-1.5 text-[10px] uppercase tracking-wide">{t("nav.soon")}</span>
            </span>
          </div>

          <div className="flex flex-col gap-2 border-t border-hairline p-4">
            <a href={GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} data-umami-event="cta-nav-stahnout-mobil" className={`${solid} h-12 w-full`}>
              {t("nav.download_btn")}
            </a>
            <a href={WEB_APP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} data-umami-event="cta-nav-webapp-mobil" className={`${outline} h-12 w-full`}>
              <Globe className="h-4 w-4" />
              {t("nav.webapp_btn")}
            </a>
            <div onClick={() => setOpen(false)}>
              <AccountPill className="h-12 w-full" />
            </div>
            <LangMenu mobile />
          </div>
        </nav>
      </div>
    </>
  );
};
