import { useTranslation } from "react-i18next";
import {
  CoachScreen,
  FeedingScreen,
  FoodDetailScreen,
  PhoneFrame,
} from "../../../../components/AppScreens";

export const FeatureHighlightsSection = (): JSX.Element => {
  const { t } = useTranslation();

  const features = [
    {
      id: "coach",
      eyebrow: t("features.f1_eyebrow"),
      title: t("features.f1_title"),
      description: t("features.f1_desc"),
      Screen: CoachScreen,
    },
    {
      id: "nutrition",
      eyebrow: t("features.f2_eyebrow"),
      title: t("features.f2_title"),
      description: t("features.f2_desc"),
      Screen: FoodDetailScreen,
    },
    {
      id: "fridge",
      eyebrow: t("features.f3_eyebrow"),
      title: t("features.f3_title"),
      description: t("features.f3_desc"),
      Screen: FeedingScreen,
    },
  ];

  return (
    <section id="funkce" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px]">
        <header className="mb-14 max-w-[640px]">
          <span className="inline-block rounded-full bg-lime-soft px-3.5 py-1.5 [font-family:'Manrope',Helvetica] text-[13px] font-bold uppercase tracking-[0.12em] text-lime-ink">
            {t("features.eyebrow")}
          </span>
          <h2 className="mb-3 mt-4 text-[30px] font-extrabold tracking-[-0.01em] text-fg-1 lg:text-[36px]">
            {t("features.section_title")}
          </h2>
          <p className="text-[17px] leading-[1.6] text-fg-5">
            {t("features.section_subtitle")}
          </p>
        </header>

        <div className="flex flex-col">
          {features.map((feature, index) => (
            <article
              key={feature.id}
              className="grid items-center gap-12 py-10 lg:grid-cols-2 lg:gap-[72px] lg:py-16"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                <span className="mb-4 inline-block rounded-full bg-lime-soft px-3.5 py-1.5 [font-family:'Manrope',Helvetica] text-[13px] font-bold uppercase tracking-[0.12em] text-lime-ink">
                  {feature.eyebrow}
                </span>
                <h3 className="mb-4 text-[26px] font-extrabold tracking-[-0.01em] text-fg-1 lg:text-[30px]">
                  {feature.title}
                </h3>
                <p className="max-w-[440px] text-base leading-[1.65] text-fg-5">
                  {feature.description}
                </p>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
                <PhoneFrame width={272} label={feature.title}>
                  <feature.Screen />
                </PhoneFrame>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
