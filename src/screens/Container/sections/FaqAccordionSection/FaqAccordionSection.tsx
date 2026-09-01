import { useTranslation } from "react-i18next";
import { faqItemsCs, faqItemsEn } from "../../../../data/faq";

export const FaqAccordionSection = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const items = i18n.language.startsWith("en") ? faqItemsEn : faqItemsCs;

  return (
    <section id="faq" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px]">
        <header className="mb-14 max-w-[640px]">
          <h2 className="text-[30px] font-extrabold tracking-[-0.01em] text-fg-1 lg:text-[36px]">
            {t("faq_section.title")}
          </h2>
        </header>

        <div className="rounded-feature bg-surface p-6 shadow-soft sm:p-14">
          {items.map((item, index) => (
            <details
              key={item.id}
              open={index === 0}
              className="group border-b border-hairline py-6 last:border-b-0 last:pb-0"
            >
              <summary
                data-umami-event={`faq-otevreno-${item.id}`}
                className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold text-fg-1 [&::-webkit-details-marker]:hidden"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-fg-6 transition-transform duration-200 ease-out group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3.5 max-w-[640px] text-[15px] leading-[1.6] text-fg-5">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
