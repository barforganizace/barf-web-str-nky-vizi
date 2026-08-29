import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StorePills } from "../../../../components/StorePills";
import { DashboardScreen, PhoneFrame } from "../../../../components/AppScreens";

export const HeroIntroductionSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section className="px-5 pb-16 pt-16 sm:px-8 lg:pt-[88px]">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <span className="inline-block rounded-full bg-lime-soft px-3.5 py-1.5 [font-family:'Manrope',Helvetica] text-[13px] font-bold uppercase tracking-[0.12em] text-lime-ink">
            {t("hero.eyebrow")}
          </span>
          <h1 className="my-5 text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] text-fg-1 lg:text-[56px]">
            {t("hero.title")}
          </h1>
          <p className="mb-8 max-w-[480px] text-[18px] leading-[1.6] text-fg-5">
            {t("hero.subtitle")}
          </p>

          <div className="mb-7 flex flex-wrap gap-4">
            <a
              href="#stahnout"
              data-umami-event="cta-hero-stahnout"
              className="inline-flex h-14 items-center justify-center rounded-card bg-navy px-7 text-base font-bold text-fg-0 transition-colors hover:bg-navy-2"
            >
              {t("hero.cta_primary")}
            </a>
            <Link
              to="/kalkulacka"
              data-umami-event="cta-hero-kalkulacka"
              className="inline-flex h-14 items-center justify-center rounded-card border-2 border-strong px-7 text-base font-bold text-navy transition-colors hover:border-navy"
            >
              {t("hero.cta_secondary")}
            </Link>
          </div>

          <StorePills />
        </div>

        <div className="flex justify-center">
          <PhoneFrame width={300} label={t("hero.image_alt")}>
            <DashboardScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
};
