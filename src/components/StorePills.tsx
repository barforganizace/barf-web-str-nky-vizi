import { useTranslation } from "react-i18next";

const AppleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
    <path d="M17.5 12.5c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2.1-1.1 2.8-2.3.6-.9.9-1.7 1.1-2.2-2.8-1.1-2.7-3-2.7-3.0z" fill="currentColor"/>
    <path d="M14.8 5.7c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" fill="currentColor"/>
  </svg>
);

const GooglePlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
    <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 4 3.5z" fill="currentColor"/>
  </svg>
);

/** Odznaky obchodů. `dark` variantu používá CTA band na tmavém pozadí. */
export const StorePills = ({ dark = false }: { dark?: boolean }) => {
  const { t } = useTranslation();

  const pill = dark
    ? "bg-white/10 text-white/75"
    : "bg-[var(--bg-muted)] text-fg-4";

  return (
    <div className={`flex flex-wrap gap-3 ${dark ? "justify-center" : ""}`}>
      <span className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold ${pill}`}>
        <AppleIcon />
        {t("download.app_store")}
      </span>
      <a
        href="https://play.google.com/store/apps/details?id=com.barfingapp.app"
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="cta-storepills-google-play"
        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition-opacity hover:opacity-80 ${pill}`}
      >
        <GooglePlayIcon />
        {t("download.google_play")}
      </a>
    </div>
  );
};
