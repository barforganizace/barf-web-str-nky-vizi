import React from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const EMAIL = "barfingapp@gmail.com";
const EmailLink = () => (
  <a href={`mailto:${EMAIL}`} className="text-lime-ink underline hover:opacity-80">{EMAIL}</a>
);

export const faqItemsCs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Co je BARF dieta?",
    answer: (<>BARF (Biologically Appropriate Raw Food) je krmný přístup založený na syrové stravě odpovídající přirozenému jídelníčku psa — svalovina, kosti, vnitřnosti a doplňky.</>),
  },
  {
    id: "faq-2",
    question: "Musím ručně vážit každou surovinu?",
    answer: (<>Stačí zadat, co máte v lednici a v jakém množství. Aplikace pak sama hlídá poměry a denní limity podle váhy a aktivity psa.</>),
  },
  {
    id: "faq-3",
    question: "Je aplikace zdarma?",
    answer: (<>Základní sledování krmení, lednice a makroživin je zdarma. Rozšířené funkce plánujeme přidávat postupně.</>),
  },
  {
    id: "faq-4",
    question: "Jak přidám dalšího psa do aplikace?",
    answer: (<>V hlavním menu klepni na ikonku svého psa (vlevo nahoře) a vyber <strong>Přidat psa</strong>. Zadáš jméno, věk, hmotnost a úroveň aktivity. Aplikace si automaticky spočítá správné denní dávky pro každého psa zvlášť. Mezi psy přepínáš jedním klepnutím.</>),
  },
  {
    id: "faq-5",
    question: "Jak změním hmotnost nebo údaje psa?",
    answer: (<>Jdi do <strong>Nastavení → Můj pes → Upravit profil</strong>. Po uložení se denní limity okamžitě přepočítají. Doporučujeme aktualizovat hmotnost alespoň jednou za měsíc — zejména u štěňat nebo psů na dietě — aby makra byla stále přesná.</>),
  },
  {
    id: "faq-6",
    question: "Proč mi makra nesedí? Zdají se moc vysoká nebo nízká.",
    answer: (<>Denní limit vychází z váhy psa, velikosti a aktivity — obvykle <strong>2–3 % tělesné hmotnosti za den</strong>. Pokud máš pocit, že čísla nesedí, zkontroluj nejdříve profil psa: správnou hmotnost a úroveň aktivity (klidný, střední, aktivní). Štěňata a kojící feny mají vyšší nároky — v profilu to uprav. Pokud si pořád nejsi jistý, poraď se s veterinářem nebo BARF nutričním specialistou.</>),
  },
  {
    id: "faq-7",
    question: "Jak funguje evidence lednice a hlídání čerstvosti?",
    answer: (<>Při přidání suroviny zadáš datum nákupu nebo rozmrazení. Aplikace automaticky počítá zbývající dny čerstvosti a 2 dny předem ti pošle upozornění, ať surovinu spotřebuješ. Suroviny se třídí do kategorií: <strong>Svalovina · Kosti · Vnitřnosti · Ostatní</strong>. Vidíš celkový přehled v kg a kusech na jednom místě.</>),
  },
  {
    id: "faq-8",
    question: "Jak sdílím recept nebo mix v komunitě?",
    answer: (<>V sekci <strong>Komunita</strong> klepni na tlačítko <strong>Sdílet mix</strong>. Vyber mix ze své lednice nebo ho vytvoř ručně, přidej popis a volitelně i fotku. Po zveřejnění ho ostatní mohou hodnotit a uložit jedním klepnutím rovnou do své lednice. Sdílené recepty lze filtrovat podle velikosti psa nebo alergenů.</>),
  },
  {
    id: "faq-9",
    question: "Aplikace mi neposílá upozornění. Co s tím?",
    answer: (<>Zkontroluj nejdříve oprávnění:<br /><strong>iOS:</strong> Nastavení → BarfingApp → Notifikace → povol „Povolit oznámení"<br /><strong>Android:</strong> Nastavení → Aplikace → BarfingApp → Oznámení → zapni<br />Pokud máš oprávnění zapnutá a upozornění přesto nepřicházejí, zkus aplikaci odinstalovat a znovu nainstalovat. Pokud problém trvá, napiš nám na <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "Moje data zmizela nebo se nezobrazují správně. Co mám dělat?",
    answer: (<>Nejdříve zkontroluj připojení k internetu — data se synchronizují ze serveru při každém spuštění. Poté zkus aplikaci zavřít a znovu otevřít. Pokud problém trvá, jdi do <strong>Nastavení → Synchronizovat data</strong>. Jako poslední možnost zkus odhlásit se a přihlásit se znovu — data se stáhnou ze zálohy. Pokud ani to nepomůže, napiš nám na <EmailLink /> s popisem problému.</>),
  },
];

export const faqItemsEn: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is the BARF diet?",
    answer: (<>BARF (Biologically Appropriate Raw Food) is a feeding approach based on raw food matching a dog's natural diet — muscle meat, bones, organs and supplements.</>),
  },
  {
    id: "faq-2",
    question: "Do I have to weigh every ingredient by hand?",
    answer: (<>Just enter what you have in the fridge and how much. The app then tracks the ratios and daily limits based on your dog's weight and activity.</>),
  },
  {
    id: "faq-3",
    question: "Is the app free?",
    answer: (<>Basic feeding tracking, the fridge and macronutrients are free. We plan to add extended features gradually.</>),
  },
  {
    id: "faq-4",
    question: "How do I add another dog to the app?",
    answer: (<>In the main menu, tap your dog's icon (top left) and choose <strong>Add dog</strong>. Enter the name, age, weight and activity level. The app will automatically calculate the correct daily portions for each dog separately. Switch between dogs with a single tap.</>),
  },
  {
    id: "faq-5",
    question: "How do I update my dog's weight or details?",
    answer: (<>Go to <strong>Settings → My dog → Edit profile</strong>. After saving, the daily limits are recalculated immediately. We recommend updating the weight at least once a month — especially for puppies or dogs on a diet — to keep the macros accurate.</>),
  },
  {
    id: "faq-6",
    question: "Why don't my macros look right? They seem too high or too low.",
    answer: (<>The daily limit is based on the dog's weight, size and activity — usually <strong>2–3% of body weight per day</strong>. If the numbers don't seem right, first check your dog's profile: correct weight and activity level (calm, moderate, active). Puppies and nursing females have higher needs — update this in the profile. If you're still unsure, consult a vet or a BARF nutrition specialist.</>),
  },
  {
    id: "faq-7",
    question: "How does the fridge tracker and freshness monitoring work?",
    answer: (<>When adding an ingredient, enter the purchase or thaw date. The app automatically counts the remaining freshness days and sends you a reminder 2 days in advance so you use it in time. Ingredients are sorted into categories: <strong>Muscle · Bones · Organs · Other</strong>. You see the full overview in kg and units in one place.</>),
  },
  {
    id: "faq-8",
    question: "How do I share a recipe or mix in the community?",
    answer: (<>In the <strong>Community</strong> section, tap the <strong>Share mix</strong> button. Choose a mix from your fridge or create one manually, add a description and optionally a photo. Once published, others can rate it and save it to their own fridge with one tap. Shared recipes can be filtered by dog size or allergens.</>),
  },
  {
    id: "faq-9",
    question: "The app isn't sending me notifications. What should I do?",
    answer: (<>First check your permissions:<br /><strong>iOS:</strong> Settings → BarfingApp → Notifications → enable "Allow Notifications"<br /><strong>Android:</strong> Settings → Apps → BarfingApp → Notifications → turn on<br />If permissions are enabled and notifications still don't arrive, try uninstalling and reinstalling the app. If the problem persists, email us at <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "My data disappeared or isn't displaying correctly. What should I do?",
    answer: (<>First check your internet connection — data syncs from the server every time the app launches. Then try closing and reopening the app. If the problem persists, go to <strong>Settings → Sync data</strong>. As a last resort, try signing out and back in — your data will be downloaded from backup. If nothing works, email us at <EmailLink /> with a description of the problem.</>),
  },
];
