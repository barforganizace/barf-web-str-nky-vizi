import { Link } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/card";

export const FaqAccordionSection = (): JSX.Element => {
  return (
    <section className="relative w-full self-stretch bg-[#f2f4f7] px-8 pt-20 pb-[120px]">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center px-4 sm:px-6 md:px-10 lg:px-12">
        <header className="flex w-full flex-col items-center gap-[22.5px] pb-[84px]">
          <div className="inline-flex items-start justify-center">
            <p className="flex w-fit items-center justify-center [font-family:'Manrope',Helvetica] text-center text-lg font-bold leading-[30px] tracking-[2.52px] text-[#1f29378c]">
              FAQ
            </p>
          </div>
          <div className="flex w-full flex-col items-center pb-[1.2px]">
            <h2 className="[font-family:'Inter',Helvetica] text-center text-[42px] font-bold leading-tight tracking-[-1.44px] text-textprimary sm:text-6xl lg:text-7xl lg:leading-[79.2px]">
              Máte dotazy? Vše najdete v FAQ.
            </h2>
          </div>
        </header>
        <div className="w-full max-w-[1140px]">
          <Card className="overflow-hidden rounded-[30px] border-0 bg-textwhite shadow-[0px_18px_48px_-18px_#1f29372e]">
            <CardContent className="p-10 sm:p-14">
              <div className="flex flex-col items-center gap-8 text-center">
                <p className="max-w-[820px] text-base font-semibold leading-[28px] tracking-[0] text-textprimary sm:text-xl sm:leading-[32px]">
                  Pokud máte otázky k aplikaci nebo chcete rychle najít odpověď,
                  klikněte na FAQ. Najdete tam všechny běžné dotazy přehledně
                  seřazené.
                </p>
                <Link
                  to="/faq"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-textdark px-8 text-base font-bold text-white transition hover:bg-textdark/90"
                >
                  Přejít na FAQ
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
