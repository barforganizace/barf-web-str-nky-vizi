import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";

const featureItems = [
  {
    number: "01",
    title: "Moje Lednice",
    subtitle: "Vaše digitální spíž BARF surovin.",
    description: (
      <>
        Evidujte hovězí mix, vnitřnosti i kosti po balíčcích. Aplikace
        <br />
        hlídá čerstvost a včas upozorní, co je potřeba spotřebovat.
      </>
    ),
    bullets: [
      "Kategorie: Svalovina · Vnitřnosti · Kosti · Ostatní",
      "Sledování čerstvosti ve dnech",
      "Suma v kg a kusech",
    ],
    imageSrc: "/Mockup_3.svg",
    imageAlt: "Moje Lednice aplikace",
    imageOnLeft: true,
    align: "left",
  },
  {
    number: "02",
    title: "Denní makra",
    subtitle: "Svalovina, Kosti, Vnitřnonsti, Ledviny.",
    description: (
      <>
        Pro každý den vidíte, kolik váš pes snědl vs. jeho denní limit.
        <br />
        Žádné Excel tabulky — barevné progress bary, sentence-
        <br />
        case popisky a čísla, která dávají smysl.
      </>
    ),
    bullets: [
      "Automatický výpočet z velikosti a aktivity",
      "Týdenní strip s aktuálním dnem",
      "Detaily mikro živin v sekci dál",
    ],
    imageSrc: "/Mockup_2 copy.svg",
    imageAlt: "Denní makra aplikace",
    imageOnLeft: false,
    align: "right",
  },
  {
    number: "03",
    title: "Komunita",
    subtitle: "Sdílejte jídla svých psů s ostatními.",
    description:
      "Inspirujte se od ostatních majitelů nebo podělte se o oblíbené BARF recepty a denní porce. Stačí pár klepnutí a váš mix je venku — ostatní ho mohou uložit rovnou do své lednice.",
    bullets: [
      "Zveřejněte recept a nechte ostatní hodnotit",
      "Uložte cizí mix jedním klepnutím do svých zásob",
      "Filtrujte podle velikosti nebo alergenů",
    ],
    imageSrc: "/Mockup_mixy.svg",
    imageAlt: "Komunita — sdílení jídel",
    imageOnLeft: true,
    align: "left",
  },
] as const;

export const FeatureHighlightsSection = (): JSX.Element => {
  return (
    <section className="relative w-full bg-[#f2f4f7] px-6 py-20 md:px-10 lg:px-[120px] lg:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <header className="flex w-full max-w-[980px] flex-col items-center px-4 pb-14 text-center lg:pb-20">
          <h2 className="[font-family:'Inter',Helvetica] text-[48px] font-normal leading-[1.08] tracking-[-0.96px] text-textprimary md:text-[72px] lg:text-[110px] lg:leading-[140px]">
            Vše, co potřebujete pro
            <br />
            Barfování na jednom místě
          </h2>
        </header>
        <div className="flex w-full flex-col gap-20 lg:gap-24">
          {featureItems.map((item) => {
            const isRightAligned = item.align === "right";

            return (
              <article
                key={item.number}
                className="grid w-full items-center gap-10 lg:min-h-[700px] lg:grid-cols-2 lg:gap-20"
              >
                {item.imageOnLeft && (
                  <div className="order-1 flex justify-center lg:order-1 lg:justify-start">
                    <Card className="h-auto w-full border-0 bg-transparent shadow-none">
                      <CardContent className="flex items-center justify-center p-0">
                        <img
                          className="h-auto w-full max-w-[520px] object-contain lg:max-w-full"
                          alt={item.imageAlt}
                          src={item.imageSrc}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div
                  className={`order-2 flex w-full flex-col gap-5 self-center ${
                    isRightAligned
                      ? "items-center text-center lg:items-end lg:text-right"
                      : "items-center text-center lg:items-start lg:text-left"
                  }`}
                >
                  <Badge className="rounded-full bg-[#c3e3664c] px-[17px] py-[6.8px] [font-family:'Manrope',Helvetica] text-[20.4px] font-bold tracking-[2.45px] text-[#506600] hover:bg-[#c3e3664c]">
                    {item.number}
                  </Badge>
                  <div className="flex w-full flex-col gap-3">
                    <h3 className="[font-family:'Inter',Helvetica] text-[42px] font-normal leading-[1.1] tracking-[-1.36px] text-textprimary md:text-[56px] lg:text-[68px] lg:leading-[74.8px]">
                      {item.title}
                    </h3>
                    <p className="[font-family:'Inter',Helvetica] text-[22px] font-medium leading-normal text-textsecondary md:text-[26px] lg:text-[30.6px]">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="w-full max-w-[782px] pt-1">
                    <p className="[font-family:'Inter',Helvetica] text-[20px] font-normal leading-[1.6] text-gray-500 md:text-[23px] lg:text-[27.2px] lg:leading-[43.5px]">
                      {item.description}
                    </p>
                  </div>
                  <ul className="flex w-full flex-col gap-5 pt-2 lg:pt-[20.4px]">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className={`flex w-full items-center gap-4 lg:gap-[20.4px] ${
                          isRightAligned
                            ? "justify-center lg:justify-end"
                            : "justify-center lg:justify-start"
                        }`}
                      >
                        {!isRightAligned && (
                          <svg className="h-[24px] w-[24px] shrink-0 lg:h-[37.4px] lg:w-[37.4px]" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="18" cy="18" r="18" fill="#c3e3664c"/>
                            <path d="M11 18.5l5 5 9-10" stroke="#506600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}

                        <span className="[font-family:'Inter',Helvetica] text-[18px] font-medium leading-normal text-gray-800 md:text-[20px] lg:text-[23.8px]">
                          {bullet}
                        </span>
                        {isRightAligned && (
                          <svg className="h-[24px] w-[24px] shrink-0 lg:h-[37.4px] lg:w-[37.4px]" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="18" cy="18" r="18" fill="#c3e3664c"/>
                            <path d="M11 18.5l5 5 9-10" stroke="#506600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                {!item.imageOnLeft && (
                  <div className="order-1 flex justify-center lg:order-3 lg:justify-end">
                    <Card className="h-auto w-full border-0 bg-transparent shadow-none">
                      <CardContent className="flex items-center justify-center p-0">
                        <img
                          className="h-auto w-full max-w-[520px] object-contain lg:max-w-full"
                          alt={item.imageAlt}
                          src={item.imageSrc}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
