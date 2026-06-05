import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";

export const HeroIntroductionSection = (): JSX.Element => {
  const { t } = useTranslation();

  const featureStats = [
    { title: t("hero.stat1_title"), description: t("hero.stat1_desc") },
    { title: t("hero.stat2_title"), description: t("hero.stat2_desc") },
    { title: t("hero.stat3_title"), description: t("hero.stat3_desc") },
  ];

  return (
    <section className="relative w-full self-stretch bg-textdark px-6 py-[72px] sm:px-8 lg:px-12 xl:px-[72px] 2xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_520px] xl:gap-16">
        <header className="order-2 flex w-full max-w-[620px] flex-col items-start lg:order-1 lg:max-w-none">
          <div className="flex w-full flex-col items-start">
            <h2 className="[font-family:'Inter',Helvetica] text-[40px] font-normal leading-[0.95] tracking-[-1.3px] text-textwhite sm:text-[52px] lg:text-[60px] lg:tracking-[-1.8px] xl:text-7xl xl:leading-[74.9px]">
              <span className="text-white">{t("hero.title_main")} </span>
              <span className="text-[#c3e366]">{t("hero.title_highlight")}</span>
            </h2>
          </div>
          <div className="mt-5 flex w-full max-w-[520px] flex-col items-start">
            <p className="font-body-large-medium text-[length:var(--body-large-medium-font-size)] font-[number:var(--body-large-medium-font-weight)] leading-[var(--body-large-medium-line-height)] tracking-[var(--body-large-medium-letter-spacing)] text-[#ffffffb8] [font-style:var(--body-large-medium-font-style)]">
              {t("hero.quote")}
            </p>
          </div>
          <nav
            aria-label="Hero actions"
            className="flex flex-wrap items-start gap-x-[14px] gap-y-3 pb-[33.2px] pt-[13.2px]"
          >
            <Button
              asChild
              className="h-14 rounded-2xl bg-[#c3e96b] px-[26px] py-0 [font-family:'Inter',Helvetica] text-base font-bold text-[#191c1d] shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a] hover:bg-[#c3e96b]/90"
            >
              <a href="#stazeni" className="inline-flex items-center gap-2">
                <span>{t("hero.cta_download")}</span>
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M7 1v9M3 7l4 4 4-4" stroke="#191c1d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-14 rounded-2xl border-[#ffffff24] bg-[#ffffff14] px-[26px] py-0 [font-family:'Inter',Helvetica] text-base font-bold text-textwhite hover:bg-[#ffffff1f] hover:text-textwhite"
            >
              {t("hero.cta_how")}
            </Button>
          </nav>
          <div className="grid w-full max-w-[620px] grid-cols-1 gap-6 border-t border-[#ffffff1a] pt-8 sm:grid-cols-3">
            {featureStats.map((item) => (
              <article
                key={item.title}
                className="flex w-full flex-col items-start gap-[2.89px]"
              >
                <h3 className="[font-family:'Manrope',Helvetica] text-[22px] font-bold leading-none tracking-[-0.22px] text-textwhite">
                  {item.title}
                </h3>
                <p className="[font-family:'Inter',Helvetica] text-xs font-normal leading-[16.8px] tracking-[0] text-[#ffffff8c]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </header>
        <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-end">
          <img
            className="h-auto w-full max-w-[420px] object-contain sm:max-w-[470px] lg:max-w-[520px] xl:max-w-[575px]"
            alt="Dog"
            src="/Orez.png"
          />
        </div>
      </div>
    </section>
  );
};
