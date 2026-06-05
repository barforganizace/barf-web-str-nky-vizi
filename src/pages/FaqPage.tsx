import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const EMAIL = "barfingapp@gmail.com";
const EmailLink = () => (
  <a href={`mailto:${EMAIL}`} className="text-[#506600] underline hover:opacity-80">{EMAIL}</a>
);

const faqItemsCs = [
  {
    id: "faq-1", number: "01", category: "Účet",
    question: "Jak zrušit účet?",
    answer: (<>Účet zrušíš přímo v aplikaci: jdi do <strong>Nastavení → Účet → Smazat účet</strong>. Po potvrzení budou trvale smazána všechna tvoje data včetně profilu psa, lednice a záznamů. Tato akce je nevratná. Pokud ti to v aplikaci nejde, napiš nám na <EmailLink /> a účet smažeme ručně do 48 hodin.</>),
  },
  {
    id: "faq-2", number: "02", category: "Účet",
    question: "Zapomněl jsem heslo. Jak ho obnovím?",
    answer: (<>Na přihlašovací obrazovce klepni na <strong>Zapomenuté heslo</strong>. Zadej e-mail, se kterým ses registroval, a my ti pošleme odkaz na obnovení hesla. Odkaz je platný 24 hodin. Pokud e-mail nedorazí, zkontroluj složku spam — nebo nám napiš a pomůžeme ti.</>),
  },
  {
    id: "faq-3", number: "03", category: "Pes",
    question: "Jak přidám dalšího psa do aplikace?",
    answer: (<>V hlavním menu klepni na ikonku svého psa (vlevo nahoře) a vyber <strong>Přidat psa</strong>. Zadáš jméno, věk, hmotnost a úroveň aktivity. Aplikace si automaticky spočítá správné denní dávky pro každého psa zvlášť. Mezi psy přepínáš jedním klepnutím.</>),
  },
  {
    id: "faq-4", number: "04", category: "Pes",
    question: "Jak změním hmotnost nebo údaje psa?",
    answer: (<>Jdi do <strong>Nastavení → Můj pes → Upravit profil</strong>. Po uložení se denní limity okamžitě přepočítají. Doporučujeme aktualizovat hmotnost alespoň jednou za měsíc — zejména u štěňat nebo psů na dietě — aby makra byla stále přesná.</>),
  },
  {
    id: "faq-5", number: "05", category: "Makra & výpočty",
    question: "Proč mi makra nesedí? Zdají se moc vysoká nebo nízká.",
    answer: (<>Denní limit vychází z váhy psa, velikosti a aktivity — obvykle <strong>2–3 % tělesné hmotnosti za den</strong>. Pokud máš pocit, že čísla nesedí, zkontroluj nejdříve profil psa: správnou hmotnost a úroveň aktivity (klidný, střední, aktivní). Štěňata a kojící feny mají vyšší nároky — v profilu to uprav. Pokud si pořád nejsi jistý, poraď se s veterinářem nebo BARF nutričním specialistou.</>),
  },
  {
    id: "faq-6", number: "06", category: "Makra & výpočty",
    question: "Jak funguje evidence lednice a hlídání čerstvosti?",
    answer: (<>Při přidání suroviny zadáš datum nákupu nebo rozmrazení. Aplikace automaticky počítá zbývající dny čerstvosti a 2 dny předem ti pošle upozornění, ať surovinu spotřebuješ. Suroviny se třídí do kategorií: <strong>Svalovina · Kosti · Vnitřnosti · Ostatní</strong>. Vidíš celkový přehled v kg a kusech na jednom místě.</>),
  },
  {
    id: "faq-7", number: "07", category: "Komunita",
    question: "Jak sdílím recept nebo mix v komunitě?",
    answer: (<>V sekci <strong>Komunita</strong> klepni na tlačítko <strong>Sdílet mix</strong>. Vyber mix ze své lednice nebo ho vytvoř ručně, přidej popis a volitelně i fotku. Po zveřejnění ho ostatní mohou hodnotit a uložit jedním klepnutím rovnou do své lednice. Sdílené recepty lze filtrovat podle velikosti psa nebo alergenů.</>),
  },
  {
    id: "faq-8", number: "08", category: "Komunita",
    question: "Mohu smazat nebo upravit recept, který jsem sdílel?",
    answer: (<>Ano. V sekci Komunita přejdi na svůj profil a najdi sdílený recept. Klepni na tři tečky (⋯) a vyber <strong>Upravit</strong> nebo <strong>Smazat</strong>. Pokud recept uložili jiní uživatelé do své lednice, jejich kopie zůstane — smažeš jen veřejnou verzi.</>),
  },
  {
    id: "faq-9", number: "09", category: "Technické",
    question: "Aplikace mi neposílá upozornění. Co s tím?",
    answer: (<>Zkontroluj nejdříve oprávnění:<br /><strong>iOS:</strong> Nastavení → BarfingApp → Notifikace → povol „Povolit oznámení"<br /><strong>Android:</strong> Nastavení → Aplikace → BarfingApp → Oznámení → zapni<br />Pokud máš oprávnění zapnutá a upozornění přesto nepřicházejí, zkus aplikaci odinstalovat a znovu nainstalovat. Pokud problém trvá, napiš nám na support.</>),
  },
  {
    id: "faq-10", number: "10", category: "Technické",
    question: "Moje data zmizela nebo se nezobrazují správně. Co mám dělat?",
    answer: (<>Nejdříve zkontroluj připojení k internetu — data se synchronizují ze serveru při každém spuštění. Poté zkus aplikaci zavřít a znovu otevřít. Pokud problém trvá, jdi do <strong>Nastavení → Synchronizovat data</strong>. Jako poslední možnost zkus odhlásit se a přihlásit se znovu — data se stáhnou ze zálohy. Pokud ani to nepomůže, napiš nám na <EmailLink /> s popisem problému.</>),
  },
];

const faqItemsEn = [
  {
    id: "faq-1", number: "01", category: "Účet",
    question: "How do I delete my account?",
    answer: (<>Delete your account directly in the app: go to <strong>Settings → Account → Delete account</strong>. All your data including your dog's profile, fridge and logs will be permanently deleted. This action is irreversible. If you can't find it in the app, email us at <EmailLink /> and we'll delete it manually within 48 hours.</>),
  },
  {
    id: "faq-2", number: "02", category: "Účet",
    question: "I forgot my password. How do I reset it?",
    answer: (<>On the login screen, tap <strong>Forgot password</strong>. Enter the email you registered with and we'll send you a reset link. The link is valid for 24 hours. If the email doesn't arrive, check your spam folder — or contact us and we'll help you.</>),
  },
  {
    id: "faq-3", number: "03", category: "Pes",
    question: "How do I add another dog to the app?",
    answer: (<>In the main menu, tap your dog's icon (top left) and choose <strong>Add dog</strong>. Enter the name, age, weight and activity level. The app will automatically calculate the correct daily portions for each dog separately. Switch between dogs with a single tap.</>),
  },
  {
    id: "faq-4", number: "04", category: "Pes",
    question: "How do I update my dog's weight or details?",
    answer: (<>Go to <strong>Settings → My dog → Edit profile</strong>. After saving, the daily limits are recalculated immediately. We recommend updating the weight at least once a month — especially for puppies or dogs on a diet — to keep the macros accurate.</>),
  },
  {
    id: "faq-5", number: "05", category: "Makra & výpočty",
    question: "Why don't my macros look right? They seem too high or too low.",
    answer: (<>The daily limit is based on the dog's weight, size and activity — usually <strong>2–3% of body weight per day</strong>. If the numbers don't seem right, first check your dog's profile: correct weight and activity level (calm, moderate, active). Puppies and nursing females have higher needs — update this in the profile. If you're still unsure, consult a vet or a BARF nutrition specialist.</>),
  },
  {
    id: "faq-6", number: "06", category: "Makra & výpočty",
    question: "How does the fridge tracker and freshness monitoring work?",
    answer: (<>When adding an ingredient, enter the purchase or thaw date. The app automatically counts the remaining freshness days and sends you a reminder 2 days in advance so you use it in time. Ingredients are sorted into categories: <strong>Muscle · Bones · Organs · Other</strong>. You see the full overview in kg and units in one place.</>),
  },
  {
    id: "faq-7", number: "07", category: "Komunita",
    question: "How do I share a recipe or mix in the community?",
    answer: (<>In the <strong>Community</strong> section, tap the <strong>Share mix</strong> button. Choose a mix from your fridge or create one manually, add a description and optionally a photo. Once published, others can rate it and save it to their own fridge with one tap. Shared recipes can be filtered by dog size or allergens.</>),
  },
  {
    id: "faq-8", number: "08", category: "Komunita",
    question: "Can I delete or edit a recipe I've shared?",
    answer: (<>Yes. In the Community section, go to your profile and find the shared recipe. Tap the three dots (⋯) and choose <strong>Edit</strong> or <strong>Delete</strong>. If other users have already saved it to their fridge, their copy remains — you only delete the public version.</>),
  },
  {
    id: "faq-9", number: "09", category: "Technické",
    question: "The app isn't sending me notifications. What should I do?",
    answer: (<>First check your permissions:<br /><strong>iOS:</strong> Settings → BarfingApp → Notifications → enable "Allow Notifications"<br /><strong>Android:</strong> Settings → Apps → BarfingApp → Notifications → turn on<br />If permissions are enabled and notifications still don't arrive, try uninstalling and reinstalling the app. If the problem persists, contact our support.</>),
  },
  {
    id: "faq-10", number: "10", category: "Technické",
    question: "My data disappeared or isn't displaying correctly. What should I do?",
    answer: (<>First check your internet connection — data syncs from the server every time the app launches. Then try closing and reopening the app. If the problem persists, go to <strong>Settings → Sync data</strong>. As a last resort, try signing out and back in — your data will be downloaded from backup. If nothing works, email us at <EmailLink /> with a description of the problem.</>),
  },
];

const CATEGORY_KEYS = ["Vše", "Účet", "Pes", "Makra & výpočty", "Komunita", "Technické"] as const;

export const FaqPage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Vše");

  const allFaqItems = i18n.language === "en" ? faqItemsEn : faqItemsCs;

  const CATEGORY_LABELS: Record<string, string> = {
    "Vše":             t("faq_page.cat_all"),
    "Účet":            t("faq_page.cat_account"),
    "Pes":             t("faq_page.cat_dog"),
    "Makra & výpočty": t("faq_page.cat_macros"),
    "Komunita":        t("faq_page.cat_community"),
    "Technické":       t("faq_page.cat_technical"),
  };

  const filtered = allFaqItems.filter((item) => {
    const matchesCategory = activeCategory === "Vše" || item.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery = q === "" || item.question.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      {/* hero + search */}
      <div className="bg-textdark px-6 py-16 text-center">
        <p className="mb-3 [font-family:'Manrope',Helvetica] text-sm font-bold tracking-[2.5px] text-[#c3e96b]">
          {t("faq_page.label")}
        </p>
        <h1 className="mb-4 [font-family:'Inter',Helvetica] text-[40px] font-normal leading-tight tracking-[-1.2px] text-white sm:text-[56px]">
          {t("faq_page.title")}
        </h1>
        <p className="mb-10 text-base text-[#ffffffb8]">
          {t("faq_page.subtitle")}
        </p>

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
            placeholder={t("faq_page.search_placeholder")}
            className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-5 text-base text-gray-800 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#c3e96b]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
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
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-textdark text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
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
              {t("faq_page.no_results")}
            </p>
            <p className="mt-1 text-gray-500">
              {t("faq_page.no_results_hint")}
            </p>
            <a
              href="mailto:barfingapp@gmail.com"
              className="mt-5 inline-block rounded-xl bg-textdark px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
              {t("faq_page.write_support")}
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
                          {CATEGORY_LABELS[item.category] ?? item.category}
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
          <p className="mb-1 text-sm font-semibold tracking-widest text-[#c3e96b]">{t("faq_page.cta_label")}</p>
          <h2 className="mt-2 [font-family:'Inter',Helvetica] text-[28px] font-normal leading-tight text-white sm:text-[36px]">
            {t("faq_page.cta_title")}
          </h2>
          <p className="mt-3 text-[#ffffffb8]">
            {t("faq_page.cta_desc")}
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
