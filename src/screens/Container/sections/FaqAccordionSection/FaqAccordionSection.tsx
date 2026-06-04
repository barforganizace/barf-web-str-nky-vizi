import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { Card, CardContent } from "../../../../components/ui/card";

const faqItems = [
  {
    id: "item-1",
    question: "Co je BARF dieta?",
    answer: (
      <>
        BARF (Biologically Appropriate Raw Food) je způsob krmení psů založený
        na syrových surovinách — hovězím mixu, vnitřnostech, kostech a
        doplňcích. Vychází z toho, čím se psi živili před domestikací.
      </>
    ),
    defaultOpen: true,
    shadow: "shadow-[0px_18px_48px_-18px_#1f29372e]",
  },
  {
    id: "item-2",
    question: "Pro jaká plemena je aplikace?",
    answer: (
      <>
        Aplikace funguje pro všechna plemena — od čivav po bernardýny. Stačí
        zadat plemeno, věk a aktivitu psa a aplikace si sama spočítá správné
        denní dávky. Podporujeme malá, střední, velká i obří plemena.
      </>
    ),
    shadow: "shadow-[0px_6px_30px_-3px_#0000000d]",
  },
  {
    id: "item-3",
    question: "Jak se počítá denní limit?",
    answer: (
      <>
        Denní limit vychází z hmotnosti psa a jeho aktivity — obvykle 2–3 %
        tělesné hmotnosti za den. Aplikace tohle automaticky rozpočítá na čtyři
        BARF složky: svalovinu, kosti, vnitřnosti a ledviny, takže nemusíte
        řešit žádnou matematiku.
      </>
    ),
    shadow: "shadow-[0px_6px_30px_-3px_#0000000d]",
  },
  {
    id: "item-4",
    question: "Funguje aplikace offline?",
    answer: (
      <>
        Ano, základní funkce — lednice, denní záznamy a krmné mixy — fungují
        i bez připojení k internetu. Komunita a sdílení receptů vyžadují
        připojení, ale vaše data jsou vždy uložena lokálně v telefonu.
      </>
    ),
    shadow: "shadow-[0px_6px_30px_-3px_#0000000d]",
  },
  {
    id: "item-5",
    question: "Je BarfApp opravdu zdarma?",
    answer: (
      <>
        Ano, stažení i základní používání je zcela zdarma bez skrytých poplatků.
        V budoucnu plánujeme prémiové funkce pro pokročilé uživatele, ale
        všechny hlavní nástroje — lednice, makra, mixy i komunita — zůstanou
        zdarma navždy.
      </>
    ),
    shadow: "shadow-[0px_6px_30px_-3px_#0000000d]",
  },
];

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
              Časté dotazy.
            </h2>
          </div>
        </header>
        <div className="w-full max-w-[1140px]">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="flex w-full flex-col gap-[18px]"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-none"
              >
                <Card
                  className={`overflow-hidden rounded-[30px] border-0 bg-textwhite ${item.shadow}`}
                >
                  <CardContent className="p-0">
                    <AccordionTrigger className="w-full px-[39px] py-[33px] text-left hover:no-underline [&>svg]:h-12 [&>svg]:w-12 [&>svg]:shrink-0 [&>svg]:rounded-full [&>svg]:bg-[#f4f5f7] [&>svg]:p-3 [&>svg]:text-textprimary">
                      <span className="[font-family:'Inter',Helvetica] text-[18px] font-bold leading-[1.2] tracking-[0] text-textprimary sm:text-[22px] lg:text-[25.5px]">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    {item.answer && (
                      <AccordionContent className="px-[39px] pb-[33px] pt-0">
                        <div className="max-w-[930px] [font-family:'Inter',Helvetica] text-base font-normal leading-[28px] tracking-[0] text-gray-500 sm:text-xl sm:leading-[34px] lg:text-2xl lg:leading-[38.4px]">
                          {item.answer}
                        </div>
                      </AccordionContent>
                    )}
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
