import { useTranslation } from "react-i18next";
import { StorePills } from "../../../../components/StorePills";
import { WaitlistForm } from "../../../../components/WaitlistForm";

export const DownloadSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section id="stahnout" className="scroll-mt-20 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="rounded-feature bg-navy px-7 py-12 text-center sm:px-14 sm:py-[72px]">
          <h2 className="mb-3.5 text-[30px] font-extrabold tracking-[-0.01em] text-fg-0 sm:text-[38px]">
            {t("download.title")}
          </h2>
          <p className="mb-8 text-base text-white/65">
            {t("download.desc")}
          </p>

          <div className="mb-6 flex justify-center">
            <StorePills dark />
          </div>

          <div className="mx-auto max-w-[460px] border-t border-white/10 pt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-lime">
              {t("download.waitlist_label")}
            </p>
            <WaitlistForm dark />
          </div>
        </div>
      </div>
    </section>
  );
};
