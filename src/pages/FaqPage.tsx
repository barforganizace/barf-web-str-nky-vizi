import { useState } from "react";
import { SharedNav } from "../components/SharedNav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const allFaqItems = [
  {
    id: "faq-1",
    number: "01",
    category: "Účet",
    question: "Jak zrušit účet?",
    answer: (
      <>
        Účet zrušíš přímo v aplikaci: jdi do{" "}
        <strong>Nastavení → Účet → Smazat účet</strong>. Po potvrzení budou
        trvale smazána všechna tvoje data včetně profilu psa, lednice a
        záznamů. Tato akce je nevratná. Pokud ti to v aplikaci nejde, napiš nám
        na{" "}
        <a
          href="mailto:barfingapp@gmail.com"
          className="text-[#506600] underline hover:opacity-80"
        >
          barfingapp@gmail.com
        </a>{" "}
        a účet smažeme ručně do 48 hodin.
      </>
    ),
  },
  {
    id: "faq-2",
    number: "02",
    category: "Účet",
    question: "Zapomněl jsem heslo. Jak ho obnovím?",
    answer: (
      <>
        Na přihlašovací obrazovce klepni na <strong>Zapomenuté heslo</strong>.
        Zadej e-mail, se kterým ses registroval, a my ti pošleme odkaz na
        obnovení hesla. Odkaz je platný 24 hodin. Pokud e-mail nedorazí, zkontroluj
        složku spam — nebo nám napiš a pomůžeme ti.
      </>
    ),
  },
  {
    id: "faq-3",
    number: "03",
    category: "Pes",
    question: "Jak přidám dalšího psa do aplikace?",
    answer: (
      <>
        V hlavním menu klepni na ikonku svého psa (vlevo nahoře) a vyber{" "}
        <strong>Přidat psa</strong>. Zadáš jméno, věk, hmotnost a
        úroveň aktivity. Aplikace si automaticky spočítá správné denní dávky
        pro každého psa zvlášť. Mezi psy přepínáš jedním klepnutím.
      </>
    ),
  },
  {
    id: "faq-4",
    number: "04",
    category: "Pes",
    question: "Jak změním hmotnost nebo údaje psa?",
    answer: (
      <>
        Jdi do <strong>Nastavení → Můj pes → Upravit profil</strong>. Po
        uložení se denní limity okamžitě přepočítají. Doporučujeme aktualizovat
        hmotnost alespoň jednou za měsíc — zejména u štěňat nebo psů na dietě —
        aby makra byla stále přesná.
      </>
    ),
  },
  {
    id: "faq-5",
    number: "05",
    category: "Makra & výpočty",
    question: "Proč mi makra nesedí? Zdají se moc vysoká nebo nízká.",
    answer: (
      <>
        Denní limit vychází z váhy psa, velikosti a aktivity — obvykle{" "}
        <strong>2–3 % tělesné hmotnosti za den</strong>. Pokud máš pocit, že
        čísla nesedí, zkontroluj nejdříve profil psa: správnou hmotnost a
        úroveň aktivity (klidný, střední, aktivní). Štěňata a kojící feny mají
        vyšší nároky — v profilu to uprav. Pokud si pořád nejsi jistý, poraď se
        s veterinářem nebo BARF nutričním specialistou.
      </>
    ),
  },
  {
    id: "faq-6",
    number: "06",
    category: "Makra & výpočty",
    question: "Jak funguje evidence lednice a hlídání čerstvosti?",
    answer: (
      <>
        Při přidání suroviny zadáš datum nákupu nebo rozmrazení. Aplikace
        automaticky počítá zbývající dny čerstvosti a 2 dny předem ti pošle
        upozornění, ať surovinu spotřebuješ. Suroviny se třídí do kategorií:{" "}
        <strong>Svalovina · Kosti · Vnitřnosti · Ostatní</strong>. Vidíš celkový
        přehled v kg a kusech na jednom místě.
      </>
    ),
  },
  {
    id: "faq-7",
    number: "07",
    category: "Komunita",
    question: "Jak sdílím recept nebo mix v komunitě?",
    answer: (
      <>
        V sekci <strong>Komunita</strong> klepni na tlačítko{" "}
        <strong>Sdílet mix</strong>. Vyber mix ze své lednice nebo ho vytvoř
        ručně, přidej popis a volitelně i fotku. Po zveřejnění ho ostatní mohou
        hodnotit a uložit jedním klepnutím rovnou do své lednice. Sdílené recepty
        lze filtrovat podle velikosti psa nebo alergenů.
      </>
    ),
  },
  {
    id: "faq-8",
    number: "08",
    category: "Komunita",
    question: "Mohu smazat nebo upravit recept, který jsem sdílel?",
    answer: (
      <>
        Ano. V sekci Komunita přejdi na svůj profil a najdi sdílený recept.
        Klepni na tři tečky (⋯) a vyber <strong>Upravit</strong> nebo{" "}
        <strong>Smazat</strong>. Pokud recept uložili jiní uživatelé do své
        lednice, jejich kopie zůstane — smažeš jen veřejnou verzi.
      </>
    ),
  },
  {
    id: "faq-9",
    number: "09",
    category: "Technické",
    question: "Aplikace mi neposílá upozornění. Co s tím?",
    answer: (
      <>
        Zkontroluj nejdříve oprávnění: <br />
        <strong>iOS:</strong> Nastavení → BarfingApp → Notifikace → povol
        „Povolit oznámení" <br />
        <strong>Android:</strong> Nastavení → Aplikace → BarfingApp →
        Oznámení → zapni <br />
        Pokud máš oprávnění zapnutá a upozornění přesto nepřicházejí, zkus
        aplikaci odinstalovat a znovu nainstalovat. Pokud problém trvá, napiš
        nám na support.
      </>
    ),
  },
  {
    id: "faq-10",
    number: "10",
    category: "Technické",
    question: "Moje data zmizela nebo se nezobrazují správně. Co mám dělat?",
    answer: (
      <>
        Nejdříve zkontroluj připojení k internetu — data se synchronizují ze
        serveru při každém spuštění. Poté zkus aplikaci zavřít a znovu otevřít.
        Pokud problém trvá, jdi do <strong>Nastavení → Synchronizovat data</strong>
        . Jako poslední možnost zkus odhlásit se a přihlásit se znovu — data se
        stáhnou ze zálohy. Pokud ani to nepomůže, napiš nám na{" "}
        <a
          href="mailto:barfingapp@gmail.com"
          className="text-[#506600] underline hover:opacity-80"
        >
          barfingapp@gmail.com
        </a>{" "}
        s popisem problému.
      </>
    ),
  },
];

const categories = ["Vše", "Účet", "Pes", "Makra & výpočty", "Komunita", "Technické"];

export const FaqPage = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Vše");

  const filtered = allFaqItems.filter((item) => {
    const matchesCategory =
      activeCategory === "Vše" || item.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery =
      q === "" ||
      item.question.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      {/* hero + search */}
      <div className="bg-textdark px-6 py-16 text-center">
        <p className="mb-3 [font-family:'Manrope',Helvetica] text-sm font-bold tracking-[2.5px] text-[#c3e96b]">
          NÁPOVĚDA
        </p>
        <h1 className="mb-4 [font-family:'Inter',Helvetica] text-[40px] font-normal leading-tight tracking-[-1.2px] text-white sm:text-[56px]">
          Jak ti můžeme pomoct?
        </h1>
        <p className="mb-10 text-base text-[#ffffffb8]">
          Najdi odpověď mezi nejčastějšími dotazy nebo nám napiš přímo.
        </p>

        {/* search bar */}
        <div className="relative mx-auto w-full max-w-[600px]">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat v nápovědě…"
            className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-5 text-base text-gray-800 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#c3e96b]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Vymazat hledání"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* category chips */}
      <div className="sticky top-14 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[900px] gap-2 overflow-x-auto px-6 py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-textdark text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      <main className="mx-auto max-w-[900px] px-6 py-12">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-2xl">🔍</p>
            <p className="mt-3 text-lg font-medium text-gray-700">
              Nic jsme nenašli
            </p>
            <p className="mt-1 text-gray-500">
              Zkus jiné slovo nebo nám napiš přímo.
            </p>
            <a
              href="mailto:barfingapp@gmail.com"
              className="mt-5 inline-block rounded-xl bg-textdark px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              Napsat podporu
            </a>
          </div>
        ) : (
          <Accordion type="single" collapsible className="flex flex-col gap-5">
            {filtered.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-none">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-[#c3e366] hover:shadow-md">
                  <AccordionTrigger className="w-full px-7 py-6 text-left hover:no-underline [&>svg]:h-9 [&>svg]:w-9 [&>svg]:shrink-0 [&>svg]:rounded-full [&>svg]:bg-[#f4f5f7] [&>svg]:p-2 [&>svg]:text-textprimary">
                    <div className="flex items-center gap-5 pr-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c3e3664c] [font-family:'Manrope',Helvetica] text-[13px] font-bold tracking-[1px] text-[#506600]">
                        {item.number}
                      </span>
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          {item.category}
                        </span>
                        <span className="[font-family:'Inter',Helvetica] text-[17px] font-semibold leading-snug text-textprimary sm:text-[19px]">
                          {item.question}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-7 pb-7 pt-0">
                    <div className="ml-[3.25rem] border-t border-gray-100 pt-5 [font-family:'Inter',Helvetica] text-base leading-relaxed text-gray-500 sm:text-[17px] sm:leading-[1.7]">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* contact CTA */}
        <div className="mt-16 rounded-3xl bg-textdark p-10 text-center">
          <p className="mb-1 text-sm font-semibold tracking-widest text-[#c3e96b]">STÁLE NENAŠEL?</p>
          <h2 className="mt-2 [font-family:'Inter',Helvetica] text-[28px] font-normal leading-tight text-white sm:text-[36px]">
            Napiš nám přímo
          </h2>
          <p className="mt-3 text-[#ffffffb8]">
            Odpovídáme do 48 hodin, obvykle rychleji.
          </p>
          <a
            href="mailto:barfingapp@gmail.com"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#c3e96b] px-7 py-3.5 text-base font-bold text-[#191c1d] transition-opacity hover:opacity-90"
          >
            barfingapp@gmail.com
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
};
