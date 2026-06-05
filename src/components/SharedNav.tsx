import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { useTranslation } from "react-i18next";

export const SharedNav = () => {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const isCS = i18n.language.startsWith("cs");
  const switchLang = () => i18n.changeLanguage(isCS ? "en" : "cs");

  const navLinks = [
    { labelKey: "nav.calculator", to: "/kalkulacka" },
    { labelKey: "nav.news",       to: "/novinky"    },
    { labelKey: "nav.entertainment", to: "/zabava"  },
    { labelKey: "nav.download",   to: "/stazeni"    },
    { labelKey: "nav.faq",        to: "/faq"        },
  ];

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-20 w-full border-b border-[#1f29370f] bg-[#f2f4f7ee] backdrop-blur-[8px]">
        <div className="mx-auto flex h-[64px] w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* logo */}
          <Link to="/" className="inline-flex shrink-0 items-center transition-opacity hover:opacity-70" aria-label="Domů">
            <img src="/Vector.svg" alt="BarfingApp" className="h-8 w-auto object-contain" />
          </Link>

          {/* desktop nav */}
          <nav aria-label={t("nav.main_navigation", "Hlavní navigace")} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`inline-flex items-center rounded-full px-4 py-2 [font-family:'Inter',Helvetica] text-sm font-medium transition-all ${
                        isActive ? "bg-textdark text-white" : "text-textsecondary hover:bg-black/5 hover:text-textprimary"
                      }`}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            {/* language switcher */}
            <button
              onClick={switchLang}
              className="flex h-9 items-center gap-1 rounded-full px-3 text-xs font-bold transition hover:bg-black/5 dark:hover:bg-white/10"
              title={isCS ? "Switch to English" : "Přepnout na češtinu"}
            >
              <span className={isCS ? "text-textprimary" : "text-gray-400"}>CZ</span>
              <span className="text-gray-300">/</span>
              <span className={!isCS ? "text-textprimary" : "text-gray-400"}>EN</span>
            </button>

            {/* dark mode toggle */}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? t("nav.light_mode") : t("nav.dark_mode")}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              )}
            </button>

            {/* CTA — desktop */}
            <Link
              to="/stazeni"
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-full bg-textdark px-[18px] [font-family:'Inter',Helvetica] text-sm font-bold text-white transition-opacity hover:opacity-80 dark:bg-[#8fad38] dark:text-[#111827]"
            >
              {t("nav.download_btn")}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v8M2.5 6l3.5 3.5L9.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* hamburger — mobile */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("nav.close_menu") : t("nav.open_menu")}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
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

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-10 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed left-0 right-0 top-[64px] z-10 lg:hidden transition-all duration-300 ease-out ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="mx-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <ul className="flex flex-col divide-y divide-gray-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center justify-between px-5 py-4 [font-family:'Inter',Helvetica] text-[15px] font-medium transition-colors ${
                      isActive ? "bg-[#f7fde8] text-[#506600]" : "text-textprimary hover:bg-gray-50"
                    }`}
                  >
                    {t(link.labelKey)}
                    {isActive && <span className="h-2 w-2 rounded-full bg-[#c3e96b]" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* language + download row in mobile menu */}
          <div className="flex items-center gap-2 p-4 pt-3">
            <button
              onClick={switchLang}
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 text-sm font-bold transition hover:bg-gray-50"
            >
              <span className={isCS ? "text-textprimary" : "text-gray-400"}>CZ</span>
              <span className="text-gray-300">/</span>
              <span className={!isCS ? "text-textprimary" : "text-gray-400"}>EN</span>
            </button>
            <Link
              to="/stazeni"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-textdark py-2.5 [font-family:'Inter',Helvetica] text-sm font-bold text-white transition-opacity hover:opacity-80"
            >
              {t("nav.download_btn")}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};
