import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    { labelKey: "nav.calculator", href: "/kalkulacka", event: "nav-kalkulacka" },
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
          <nav aria-label={t("nav.main_navigation")} className="hidden lg:block">
            <ul className="flex items-center gap-8">
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
            </ul>
          </nav>

          <div className="flex items-center gap-2">
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

            {/* CTA — desktop */}
            <a
              href={anchor("stahnout")}
              data-umami-event="cta-nav-stahnout"
              className="hidden h-12 items-center justify-center rounded-card bg-navy px-5 text-sm font-bold text-fg-0 transition-colors hover:bg-navy-2 lg:inline-flex"
            >
              {t("nav.download_btn")}
            </a>

            {/* hamburger — mobil */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("nav.close_menu") : t("nav.open_menu")}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 lg:hidden"
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
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed left-0 right-0 top-[72px] z-40 lg:hidden transition-all duration-300 ease-out ${
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
          <div className="flex items-center gap-2 p-4">
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
              href={anchor("stahnout")}
              onClick={() => setOpen(false)}
              data-umami-event="cta-nav-stahnout-mobil"
              className="flex h-12 flex-1 items-center justify-center rounded-card bg-navy text-sm font-bold text-fg-0 transition-colors hover:bg-navy-2"
            >
              {t("nav.download_btn")}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
