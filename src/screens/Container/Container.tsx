import { FaqAccordionSection } from "./sections/FaqAccordionSection";
import { FeatureHighlightsSection } from "./sections/FeatureHighlightsSection";
import { FooterPromoSection } from "./sections/FooterPromoSection";
import { HeroIntroductionSection } from "./sections/HeroIntroductionSection";
import { DownloadSection } from "./sections/DownloadSection";
import { BlogPreviewSection } from "./sections/BlogPreviewSection";
import { SharedNav } from "../../components/SharedNav";

export const Container = (): JSX.Element => {
  return (
    <main className="relative flex w-full flex-col items-stretch bg-app-2">
      <SharedNav />
      <HeroIntroductionSection />
      <FeatureHighlightsSection />
      <BlogPreviewSection />
      <FaqAccordionSection />
      <DownloadSection />
      <FooterPromoSection />
    </main>
  );
};
