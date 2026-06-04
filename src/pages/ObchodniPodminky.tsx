import { Link } from "react-router-dom";
import { SharedNav } from "../components/SharedNav";

export const ObchodniPodminky = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      <main className="mx-auto max-w-[860px] px-6 py-12 lg:py-16">
        <article className="prose prose-gray max-w-none">
          <h1 className="mb-2 [font-family:'Inter',Helvetica] text-[36px] font-normal leading-tight tracking-[-1px] text-[#191c1d] lg:text-[48px]">
            Obchodní podmínky
          </h1>
          <p className="mb-10 text-sm text-gray-500">Účinnost od 13. 5. 2026</p>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Provozovatel</p>
            <p>NinjaPrint s.r.o.</p>
            <p>Korunní 2569/108, Vinohrady, 101 00 Praha 10</p>
            <p>IČO: 217 43 436</p>
            <p>Zapsáno: Městský soud v Praze, sp. zn. C 404545/MSPH</p>
            <p>Jednatel: Jakub Just</p>
            <p>
              E-mail:{" "}
              <a
                href="mailto:barfingapp@gmail.com"
                className="text-[#506600] hover:underline"
              >
                barfingapp@gmail.com
              </a>
            </p>
          </div>

          <p className="mb-10 leading-relaxed text-gray-600">
            Tyto obchodní podmínky upravují vztah mezi provozovatelem a
            uživatelem aplikace BarfingApp (dále jen „aplikace"). Stažením nebo
            používáním aplikace s těmito podmínkami souhlasíš. Pokud
            nesouhlasíš, aplikaci nepoužívej.
          </p>

          <Section title="1. O aplikaci">
            <p>
              Aplikace BarfingApp je nutriční nástroj pro psy. Pomáhá sestavit
              krmný plán a vést deník krmení.
            </p>
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <strong>Aplikace je pomůckou, nikoliv náhradou veterinární péče.</strong>{" "}
              Doporučení v aplikaci mají informativní charakter. Před zásadní
              změnou krmné dávky, při zdravotních problémech psa nebo při
              speciálních dietních potřebách se vždy poraď s veterinářem nebo
              nutričním specialistou. Za zdraví svého psa odpovídáš ty.
            </p>
          </Section>

          <Section title="2. Duševní vlastnictví">
            <p>
              Aplikace, její zdrojový kód, design, grafika, texty, databáze,
              ochranné známky a veškerý další obsah jsou majetkem provozovatele
              a jsou chráněny autorským právem a dalšími předpisy o duševním
              vlastnictví.
            </p>
            <p className="mt-3">Nesmíš:</p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>kopírovat, upravovat ani distribuovat aplikaci nebo její části</li>
              <li>
                pokoušet se získat zdrojový kód, dekompilovat nebo zpětně
                analyzovat aplikaci
              </li>
              <li>překládat aplikaci nebo vytvářet odvozená díla</li>
              <li>
                používat ochranné známky nebo jiné označení provozovatele bez
                výslovného souhlasu
              </li>
            </ul>
          </Section>

          <Section title="3. Tvůj účet a data">
            <p>
              Aplikace ukládá a zpracovává údaje, které do ní zadáš (údaje o
              tobě a tvém psovi), aby ti mohla službu poskytovat. Detaily o
              zpracování osobních údajů najdeš v samostatném dokumentu{" "}
              <Link
                to="/zasady-ochrany-osobnich-udaju"
                className="text-[#506600] hover:underline"
              >
                Zásady ochrany osobních údajů
              </Link>
              .
            </p>
            <p className="mt-3">
              Data jsou ukládána na serverech poskytovatele Supabase. Platby jsou
              zpracovávány prostřednictvím služby Stripe.
            </p>
            <p className="mt-3">
              Za bezpečnost svého zařízení, přihlašovacích údajů a přístupu k
              aplikaci odpovídáš ty. Doporučujeme nepoužívat aplikaci na
              rootnutém nebo jailbreaknutém zařízení – snižuje to bezpečnost
              zařízení a aplikace nemusí fungovat správně.
            </p>
          </Section>

          <Section title="4. Služby třetích stran">
            <p>
              Aplikace využívá služby třetích stran, které mají vlastní obchodní
              podmínky a zásady ochrany osobních údajů:
            </p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>
                <strong>Google Play / Apple App Store</strong> – distribuce
                aplikace
              </li>
              <li>
                <strong>Stripe</strong> – zpracování plateb
              </li>
              <li>
                <strong>Supabase</strong> – hostování a ukládání dat
              </li>
            </ul>
            <p className="mt-3">
              Provozovatel nezodpovídá za fungování ani podmínky služeb třetích
              stran.
            </p>
          </Section>

          <Section title="5. Omezení odpovědnosti">
            <p>
              Aplikace ke svému plnému fungování vyžaduje aktivní připojení k
              internetu. Provozovatel neručí za:
            </p>
            <ul className="mt-2 space-y-1 pl-5">
              <li>
                nefunkčnost aplikace způsobenou výpadkem připojení, vyčerpáním
                datového limitu nebo problémy mobilního operátora
              </li>
              <li>
                náklady na mobilní data, včetně roamingu, vzniklé při používání
                aplikace
              </li>
              <li>
                nefunkčnost způsobenou vybitou baterií, závadou nebo poškozením
                tvého zařízení
              </li>
              <li>
                škody vzniklé spoléháním se výhradně na informace poskytnuté
                aplikací
              </li>
              <li>nepřímé škody, ušlý zisk ani jiné následné škody</li>
            </ul>
            <p className="mt-3">
              Pokud nejsi plátcem účtu za zařízení, na kterém aplikaci
              používáš, předpokládáme, že máš souhlas plátce s jejím
              používáním.
            </p>
            <p className="mt-3">
              Některé informace v aplikaci pocházejí z podkladů třetích stran.
              Přestože usilujeme o to, aby byly správné a aktuální, provozovatel
              neodpovídá za případné nepřesnosti.
            </p>
          </Section>

          <Section title="6. Aktualizace a ukončení služby">
            <p>
              Aplikace je v současné době dostupná pro Android, plánujeme
              rozšíření na iOS. Požadavky na operační systém se mohou v čase
              měnit a pro další používání může být nutná instalace aktualizací.
            </p>
            <p className="mt-3">
              Souhlasíš s tím, že nabídnuté aktualizace aplikace budeš
              přijímat. Provozovatel negarantuje, že bude aplikaci nadále
              vyvíjet nebo udržovat kompatibilní se všemi verzemi operačních
              systémů.
            </p>
            <p className="mt-3">
              Provozovatel si vyhrazuje právo aplikaci kdykoliv změnit, omezit
              její funkce nebo službu zcela ukončit, a to i bez předchozího
              upozornění. Při ukončení placené služby ze strany provozovatele
              bude uživateli vrácena poměrná část poplatku za již uhrazené,
              avšak nevyužité období.
            </p>
            <p className="mt-3">
              Po ukončení používání aplikace musíš aplikaci ze svého zařízení
              odinstalovat.
            </p>
          </Section>

          <Section title="7. Zkušební období a poplatky">
            <h3 className="mb-2 mt-5 text-lg font-semibold text-gray-800">
              7.1 Současný stav – testovací provoz
            </h3>
            <p>
              Aplikace BarfingApp je v současné době v{" "}
              <strong>testovacím provozu</strong> a je všem uživatelům
              poskytována <strong>bezplatně</strong>, v plném rozsahu funkcí.
              Pro používání aplikace není vyžadováno zadání platebních údajů.
            </p>
            <p className="mt-3">
              Provozovatel si vyhrazuje právo testovací provoz kdykoliv ukončit
              nebo přejít na placený model.
            </p>

            <h3 className="mb-2 mt-5 text-lg font-semibold text-gray-800">
              7.2 Plánovaný přechod na placený model
            </h3>
            <p>
              Provozovatel plánuje v budoucnu zavést placené předplatné. O
              přechodu na placenou verzi, výši poplatků, délce zkušebního
              období a všech souvisejících podmínkách budou stávající uživatelé{" "}
              <strong>informováni v dostatečném předstihu</strong>{" "}
              prostřednictvím aplikace nebo e-mailem.
            </p>
            <p className="mt-3">
              Pokud s placeným modelem nebudeš souhlasit, budeš mít možnost
              přestat aplikaci používat. Ustanovení článku 8 (Platby a
              předplatné) nabudou účinnosti spolu se spuštěním placené verze.
            </p>

            <h3 className="mb-2 mt-5 text-lg font-semibold text-gray-800">
              7.3 Podmínky placené verze
            </h3>
            <p>
              Po spuštění placené verze bude pro nové uživatele zavedeno
              zkušební období, po jehož skončení bude přístup k některým
              funkcím aplikace omezen. Uživatel bude mít nadále přístup ke svým
              již uloženým plánům a deníku, ale nebude moct přidávat ani
              upravovat nové záznamy. Plný přístup ke všem funkcím získá
              zakoupením předplatného.
            </p>
          </Section>

          <Section title="8. Platby a předplatné">
            <p>
              Platby jsou zpracovávány prostřednictvím služby{" "}
              <strong>Stripe</strong>. Zadáním platebních údajů a aktivací
              předplatného uzavíráš s provozovatelem smlouvu na poskytnutí
              placené digitální služby.
            </p>
            <ul className="mt-3 space-y-1 pl-5">
              <li>
                Předplatné se <strong>automaticky obnovuje</strong> na začátku
                každého nového fakturačního období.
              </li>
              <li>
                Předplatné můžeš <strong>kdykoliv zrušit</strong> v nastavení
                svého účtu. Po zrušení ti přístup k placeným funkcím zůstane do
                konce již uhrazeného období.
              </li>
              <li>
                Pokud chceš zabránit stržení platby za další období, zruš
                předplatné <strong>před</strong> koncem aktuálního období.
              </li>
            </ul>
            <p className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <strong>Souhlas se zahájením plnění:</strong> Aktivací předplatného
              výslovně souhlasíš s okamžitým zahájením poskytování digitální
              služby před uplynutím 14denní lhůty pro odstoupení od smlouvy a
              bereš na vědomí, že tím podle § 1837 písm. l) občanského zákoníku
              zaniká tvé právo od smlouvy odstoupit.
            </p>
          </Section>

          <Section title="9. Změny obchodních podmínek">
            <p>
              Tyto podmínky můžeme čas od času aktualizovat. Aktuální verzi
              vždy najdeš v aplikaci a na webu provozovatele. O změnách, které
              významně mění tvá práva a povinnosti, budeš informován
              prostřednictvím aplikace nebo e-mailem.
            </p>
            <p className="mt-3">
              Změny nabývají účinnosti okamžikem zveřejnění. Pokud s novou verzí
              podmínek nesouhlasíš, máš právo přestat aplikaci používat a
              případně předplatné zrušit.
            </p>
          </Section>

          <Section title="10. Rozhodné právo a řešení sporů">
            <p>
              Tyto obchodní podmínky a vztah mezi uživatelem a provozovatelem se
              řídí právem <strong>České republiky</strong>, zejména zákonem č.
              89/2012 Sb., občanský zákoník, a zákonem č. 634/1992 Sb., o
              ochraně spotřebitele.
            </p>
            <p className="mt-3">
              Případné spory budou řešeny příslušnými soudy České republiky.
            </p>
            <p className="mt-3">
              Jako spotřebitel máš právo na mimosoudní řešení spotřebitelského
              sporu. Subjektem příslušným k mimosoudnímu řešení
              spotřebitelských sporů je{" "}
              <strong>Česká obchodní inspekce</strong> (
              <a
                href="https://www.coi.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#506600] hover:underline"
              >
                www.coi.cz
              </a>
              ).
            </p>
          </Section>

          <Section title="11. Kontakt">
            <p>
              Otázky, podněty, stížnosti nebo žádosti směřuj na:{" "}
              <a
                href="mailto:barfingapp@gmail.com"
                className="text-[#506600] hover:underline"
              >
                barfingapp@gmail.com
              </a>
            </p>
          </Section>
        </article>
      </main>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element => (
  <section className="mb-8">
    <h2 className="mb-4 border-b border-gray-200 pb-2 [font-family:'Inter',Helvetica] text-[22px] font-semibold text-[#191c1d]">
      {title}
    </h2>
    <div className="text-[15px] leading-relaxed text-gray-600">{children}</div>
  </section>
);
