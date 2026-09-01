import { useTranslation } from "react-i18next";

export const HeroIntroductionSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section className="bg-navy px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <h1 className="mb-6 text-[40px] font-extrabold leading-[1.08] tracking-[-0.02em] text-fg-0 lg:text-[58px]">
            {t("hero.title_pre")}
            <span className="text-lime">{t("hero.title_highlight")}</span>
          </h1>
          <p className="mb-9 max-w-[600px] text-[15px] leading-[1.7] text-white/70">
            {t("hero.quote")}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.barfingapp.app"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cta-hero-stahnout"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-card bg-lime px-7 text-base font-bold text-navy transition-colors hover:bg-lime-muted"
            >
              {t("hero.cta_primary")}
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="#funkce"
              data-umami-event="cta-hero-funkce"
              className="inline-flex h-14 items-center justify-center rounded-card border border-white/15 bg-white/5 px-7 text-base font-bold text-fg-0 transition-colors hover:border-white/40"
            >
              {t("hero.cta_secondary")}
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/pes-barf-appka.png"
            alt={t("hero.dog_alt")}
            className="w-full max-w-[400px] lg:max-w-[470px]"
          />
        </div>
      </div>
    </section>
  );
};
