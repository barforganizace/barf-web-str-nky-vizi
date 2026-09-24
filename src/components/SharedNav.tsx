import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn, Factory, FlaskConical, Globe } from "lucide-react";
import { useSession } from "../lib/session";

/** Přihlášení v navigaci: nepřihlášený vidí zřetelné tlačítko „Přihlásit se“,
 *  přihlášený zelenou pilulku se svým jménem (nebo psem, nebo e-mailem). */
const AccountPill = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();
  const { user, dogs } = useSession();
  if (!user) {
    return (
      <Link
        to="/ucet"
        data-umami-event="nav-prihlasit"
        className={`inline-flex h-10 items-center gap-2 rounded-full border-2 border-navy px-4 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-fg-0 ${className}`}
      >
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
      className={`inline-flex h-10 max-w-[200px] items-center gap-2 rounded-full bg-lime pl-1.5 pr-4 text-sm font-bold text-[#191c1d] transition-opacity hover:opacity-85 ${className}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-xs font-extrabold uppercase text-fg-0">
        {dogs[0]?.avatar_url ? <img src={dogs[0].avatar_url} alt="" className="h-full w-full object-cover" /> : name.slice(0, 1)}
      </span>
      <span className="truncate">{name}</span>
    </Link>
  );
};

/** Nástroje (ne obyčejné odkazy) — proto pilulka místo textu.
 *  Formulátor má stejnou váhu jako Pro výrobce, jen se zatím vyrábí — odtud tlumené barvy. */
const toolPill = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 font-bold transition-colors";
const toolReady = `${toolPill} border-lime-muted bg-lime-faint text-lime-ink hover:bg-lime-soft`;
const toolSoon = `${toolPill} cursor-default border-dashed border-strong bg-app-2 text-fg-5`;
const soonBadge = "rounded-full bg-fg-8 px-1.5 text-[10px] font-bold uppercase tracking-wide text-fg-5";

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.barfingapp.app";
const WEB_APP_URL = "https://barfing.net";

export const SharedNav = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const isCS = i18n.language.startsWith("cs");
  const switchLang = () => i18n.changeLanguage(isCS ? "en" : "cs");

  // Kotvy vedou na homepage — z podstránky je potřeba absolutní odkaz.
  const anchor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  const navLinks = [
    { labelKey: "nav.features", href: anchor("funkce"), event: "nav-funkce" },
    { labelKey: "nav.ingredients", href: "/suroviny", event: "nav-suroviny" },
    { labelKey: "nav.blog", href: anchor("blog"), event: "nav-blog" },
    { labelKey: "nav.faq", href: anchor("faq"), event: "nav-faq" },
  ];

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-hairline bg-[rgba(245,246,248,0.85)] backdrop-blur-[12px]">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-4 sm:px-8">

          {/* brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-70" aria-label="BarfingApp">
            <img src="/barfingapp-logo.svg" alt="BarfingApp logo" className="h-8 w-8 object-contain" />
            <span className="text-[20px] font-extrabold text-fg-1">BarfingApp</span>
          </Link>

          {/* desktop nav */}
          <nav aria-label={t("nav.main_navigation")} className="hidden xl:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    data-umami-event={link.event}
                    className="text-sm font-bold text-fg-4 transition-colors hover:text-navy"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/editor" data-umami-event="nav-editor" className={`${toolReady} h-9 text-[13px]`}>
                  <Factory className="h-3.5 w-3.5" />
                  {t("nav.producers")}
                </Link>
              </li>
              <li>
                <span title={t("nav.formulator_soon")} className={`${toolSoon} h-9 text-[13px]`}>
                  <FlaskConical className="h-3.5 w-3.5" />
                  {t("nav.formulator")}
                  <span className={soonBadge}>{t("nav.soon")}</span>
                </span>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* přihlášení / jméno uživatele */}
            <AccountPill />

            {/* přepínač jazyka */}
            <button
              onClick={switchLang}
              data-umami-event="prepnuti-jazyka"
              className="flex h-9 items-center gap-1 rounded-full px-3 text-xs font-bold transition hover:bg-black/5"
              title={isCS ? "Switch to English" : "Přepnout na češtinu"}
            >
              <span className={isCS ? "text-fg-1" : "text-fg-6"}>CZ</span>
              <span className="text-fg-7">/</span>
              <span className={!isCS ? "text-fg-1" : "text-fg-6"}>EN</span>
            </button>

            {/* webová verze appky — desktop */}
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cta-nav-webapp"
              className="hidden h-12 items-center justify-center gap-2 rounded-card border-2 border-navy px-4 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-fg-0 xl:inline-flex"
            >
              <Globe className="h-4 w-4" />
              {t("nav.webapp_btn")}
            </a>

            {/* CTA — desktop */}
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cta-nav-stahnout"
              className="hidden h-12 items-center justify-center rounded-card bg-navy px-5 text-sm font-bold text-fg-0 transition-colors hover:bg-navy-2 xl:inline-flex"
            >
              {t("nav.download_btn")}
            </a>

            {/* hamburger — mobil */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("nav.close_menu") : t("nav.open_menu")}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 xl:hidden"
            >
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* mobilní menu */}
      {open && (
        <div className="fixed inset-0 z-40 xl:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed left-0 right-0 top-[72px] z-40 xl:hidden transition-all duration-300 ease-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="mx-4 overflow-hidden rounded-panel border border-hairline bg-surface shadow-lifted">
          <ul className="flex flex-col divide-y divide-hairline">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  data-umami-event={`${link.event}-mobil`}
                  className="flex items-center px-5 py-4 text-[15px] font-bold text-fg-2 transition-colors hover:bg-app-2"
                >
                  {t(link.labelKey)}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t border-hairline p-4">
            <Link
              to="/editor"
              onClick={() => setOpen(false)}
              data-umami-event="nav-editor-mobil"
              className={`${toolReady} h-12 w-full justify-center text-[15px]`}
            >
              <Factory className="h-4 w-4" />
              {t("nav.producers")}
            </Link>
            <span className={`${toolSoon} h-12 w-full justify-center text-[15px]`}>
              <FlaskConical className="h-4 w-4" />
              {t("nav.formulator")}
              <span className={soonBadge}>{t("nav.soon")}</span>
            </span>
          </div>
          <div className="px-4" onClick={() => setOpen(false)}>
            <AccountPill className="w-full justify-center" />
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4">
            <button
              onClick={switchLang}
              data-umami-event="prepnuti-jazyka-mobil"
              className="flex h-12 flex-1 items-center justify-center gap-1 rounded-card border-2 border-strong text-sm font-bold transition hover:bg-app-2"
            >
              <span className={isCS ? "text-fg-1" : "text-fg-6"}>CZ</span>
              <span className="text-fg-7">/</span>
              <span className={!isCS ? "text-fg-1" : "text-fg-6"}>EN</span>
            </button>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              data-umami-event="cta-nav-stahnout-mobil"
              className="flex h-12 flex-1 items-center justify-center rounded-card bg-navy text-sm font-bold text-fg-0 transition-colors hover:bg-navy-2"
            >
              {t("nav.download_btn")}
            </a>
            <a
              href={WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              data-umami-event="cta-nav-webapp-mobil"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-card border-2 border-navy text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-fg-0"
            >
              <Globe className="h-4 w-4" />
              {t("nav.webapp_btn")}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
