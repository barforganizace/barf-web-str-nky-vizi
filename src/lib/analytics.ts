const SCRIPT_SRC = "https://cloud.umami.is/script.js";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Načte Umami tracker (bez cookies, GDPR — nepotřebuje souhlas).
 * Bez VITE_UMAMI_WEBSITE_ID se nic nenačte, takže lokální vývoj statistiky nezkresluje.
 */
export const initAnalytics = () => {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
  if (!websiteId || document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.defer = true;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
};

/** Ruční událost. Bez načteného trackeru je to no-op. */
export const track = (event: string, data?: Record<string, unknown>) => {
  window.umami?.track(event, data);
};
