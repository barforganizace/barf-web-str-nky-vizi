import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/barfingapp/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/barfingapp/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

export const FooterPromoSection = (): JSX.Element => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const anchor = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);

  return (
    <footer className="px-5 pb-16 pt-12 sm:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-fg-1">
            <img src="/barflogo.png" alt="" className="h-6 w-6 rounded-md object-contain" />
            BarfApp
          </Link>

          <nav aria-label={t("footer.links_label")} className="flex flex-wrap gap-7">
            <a href={anchor("funkce")} className="text-sm font-semibold text-fg-5 transition-colors hover:text-navy">
              {t("nav.features")}
            </a>
            <a href={anchor("faq")} className="text-sm font-semibold text-fg-5 transition-colors hover:text-navy">
              {t("nav.faq")}
            </a>
            <Link to="/obchodni-podminky" className="text-sm font-semibold text-fg-5 transition-colors hover:text-navy">
              {t("footer.legal1")}
            </Link>
            <Link to="/zasady-ochrany-osobnich-udaju" className="text-sm font-semibold text-fg-5 transition-colors hover:text-navy">
              {t("footer.legal2")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                data-umami-event={`socialni-sit-${social.label.toLowerCase()}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-muted)] text-fg-4 transition-colors hover:bg-navy hover:text-fg-0"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[13px] text-fg-6">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
};
