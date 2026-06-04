import { SharedNav } from "../components/SharedNav";

export const ZasadyOchrany = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      <main className="mx-auto max-w-[860px] px-6 py-12 lg:py-16">
        <article>
          <h1 className="mb-2 [font-family:'Inter',Helvetica] text-[36px] font-normal leading-tight tracking-[-1px] text-[#191c1d] lg:text-[48px]">
            Zásady ochrany osobních údajů
          </h1>
          <p className="mb-10 text-sm text-gray-500">Účinnost od 13. 5. 2026</p>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Správce osobních údajů</p>
            <p>Jakub Just</p>
            <p>Essenská 462, 252 09 Hradištko</p>
            <p>IČO: 235 31 053</p>
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
            Tyto zásady popisují, jaké osobní údaje shromažďujeme při používání
            aplikace <strong>BarfingApp</strong>, proč je zpracováváme, komu je
            předáváme a jaká máš jako uživatel práva. Zpracování probíhá v
            souladu s nařízením EU 2016/679 (<strong>GDPR</strong>) a zákonem č.
            110/2019 Sb., o zpracování osobních údajů.
          </p>

          <Section title="1. Jaké údaje zpracováváme">
            <SubSection title="1.1 Údaje o účtu">
              <ul className="space-y-1 pl-5">
                <li>E-mailová adresa</li>
                <li>Heslo (uloženo v zašifrované, nevratné podobě – hash)</li>
                <li>Jméno nebo přezdívka (pokud je zadáš)</li>
                <li>Datum vytvoření účtu a poslední přihlášení</li>
              </ul>
            </SubSection>

            <SubSection title="1.2 Údaje o psovi a krmení">
              <p>
                Údaje, které do aplikace zadáš a které slouží k sestavení krmných
                plánů:
              </p>
              <ul className="mt-2 space-y-1 pl-5">
                <li>Jméno, plemeno, věk, váha, pohlaví, kondice psa</li>
                <li>Zdravotní omezení, alergie, dietní specifika</li>
                <li>
                  Krmné plány, deníkové záznamy, fotografie (pokud je nahraješ)
                </li>
              </ul>
              <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                Tyto údaje se nepovažují za osobní údaje v užším smyslu, ale jsou
                propojeny s tvým účtem, a proto jsou chráněny stejným způsobem.
              </p>
            </SubSection>

            <SubSection title="1.3 Technické a provozní údaje">
              <ul className="space-y-1 pl-5">
                <li>IP adresa</li>
                <li>Typ zařízení, operační systém, verze aplikace</li>
                <li>Datum a čas přístupu</li>
                <li>Identifikátor zařízení (pokud je nutný k provozu aplikace)</li>
                <li>Logy chyb a provozu</li>
              </ul>
            </SubSection>

            <SubSection title="1.4 Platební údaje">
              <p>
                Aplikace je v současné době v{" "}
                <strong>testovacím provozu a zdarma</strong>, žádné platební
                údaje nezpracováváme. Po spuštění placené verze budou platby
                zpracovávány přes externí platební bránu (předpokládaně Stripe).
                Tyto zásady budou v té době aktualizovány.
              </p>
            </SubSection>
          </Section>

          <Section title="2. Proč údaje zpracováváme">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Účel
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Zpracovávané údaje
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Právní základ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">
                      Poskytování služby BarfingApp
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Účet, údaje o psovi, krmení
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Plnění smlouvy – čl. 6 odst. 1 písm. b)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">
                      Bezpečnost, prevence zneužití
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Technické údaje, logy
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Oprávněný zájem – čl. 6 odst. 1 písm. f)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">
                      Vyřizování dotazů a podpora
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Kontaktní údaje, komunikace
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Oprávněný zájem – čl. 6 odst. 1 písm. f)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">
                      Marketing (pokud spustíme)
                    </td>
                    <td className="px-4 py-3 text-gray-600">E-mail</td>
                    <td className="px-4 py-3 text-gray-600">
                      Souhlas – čl. 6 odst. 1 písm. a)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="3. Komu údaje předáváme">
            <p>
              Tvé údaje nikomu <strong>neprodáváme</strong>. Pro zajištění
              provozu aplikace využíváme tyto zpracovatele:
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Služba
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Účel
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Umístění dat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Supabase, Inc.
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Hostování databáze a backend
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      EU – Frankfurt, Německo
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Google LLC
                    </td>
                    <td className="px-4 py-3 text-gray-600">Google Play</td>
                    <td className="px-4 py-3 text-gray-600">EU / USA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      Apple Distribution Intl.
                    </td>
                    <td className="px-4 py-3 text-gray-600">App Store</td>
                    <td className="px-4 py-3 text-gray-600">Irsko (EU)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Předávání do třetích zemí">
            <p>
              Databáze a všechna data uživatelů aplikace BarfingApp jsou
              hostována v <strong>Evropské unii</strong> (Supabase, region
              Frankfurt – Německo). Tvé osobní údaje{" "}
              <strong>nejsou předávány mimo Evropský hospodářský prostor (EHP)</strong>
              .
            </p>
          </Section>

          <Section title="5. Jak dlouho údaje uchováváme">
            <ul className="space-y-2 pl-5">
              <li>
                <strong>Údaje o účtu a psovi:</strong> po celou dobu trvání
                účtu. Po smazání účtu do <strong>30 dnů</strong>.
              </li>
              <li>
                <strong>Logy a technické údaje:</strong> zpravidla{" "}
                <strong>6 měsíců</strong>.
              </li>
              <li>
                <strong>E-mailová komunikace (podpora):</strong>{" "}
                <strong>3 roky</strong> od posledního kontaktu.
              </li>
            </ul>
          </Section>

          <Section title="6. Tvá práva">
            <p>Jako subjekt údajů máš podle GDPR tato práva:</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  right: "Právo na přístup",
                  desc: "Zjistit, jaké údaje o tobě zpracováváme (čl. 15)",
                },
                {
                  right: "Právo na opravu",
                  desc: "Nechat si opravit nepřesné nebo neúplné údaje (čl. 16)",
                },
                {
                  right: "Právo na výmaz",
                  desc: "Nechat si údaje smazat, pokud k nim není zákonný důvod (čl. 17)",
                },
                {
                  right: "Právo na omezení",
                  desc: "Omezit zpracování tvých údajů (čl. 18)",
                },
                {
                  right: "Právo na přenositelnost",
                  desc: "Získat data ve strojově čitelném formátu (čl. 20)",
                },
                {
                  right: "Právo vznést námitku",
                  desc: "Proti zpracování na základě oprávněného zájmu (čl. 21)",
                },
              ].map((item) => (
                <div
                  key={item.right}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <p className="font-semibold text-gray-800">{item.right}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-gray-600">
              Tato práva uplatníš e-mailem na{" "}
              <a
                href="mailto:barfingapp@gmail.com"
                className="text-[#506600] hover:underline"
              >
                barfingapp@gmail.com
              </a>
              . Odpovíme nejpozději do <strong>30 dnů</strong>.
            </p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">Stížnost u dozorového úřadu</p>
              <p className="mt-1">
                Úřad pro ochranu osobních údajů (ÚOOÚ)
                <br />
                Pplk. Sochora 27, 170 00 Praha 7
                <br />
                <a
                  href="https://www.uoou.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#506600] hover:underline"
                >
                  www.uoou.cz
                </a>
              </p>
            </div>
          </Section>

          <Section title="7. Bezpečnost údajů">
            <ul className="space-y-1 pl-5">
              <li>
                veškerá komunikace mezi aplikací a serverem je šifrována (HTTPS /
                TLS)
              </li>
              <li>hesla jsou uložena v nevratné hashované podobě</li>
              <li>
                přístup k údajům mají pouze osoby, které je nutně potřebují k
                provozu služby
              </li>
              <li>
                pravidelně aktualizujeme bezpečnostní nastavení a sledujeme
                bezpečnostní incidenty
              </li>
            </ul>
          </Section>

          <Section title="8. Děti">
            <p>
              Aplikace BarfingApp <strong>není určena dětem mladším 15 let</strong>
              . Vědomě neshromažďujeme údaje od dětí pod 15 let. Pokud zjistíš,
              že dítě mladší 15 let aplikaci používá bez souhlasu rodiče,
              kontaktuj nás a údaje neprodleně smažeme.
            </p>
          </Section>

          <Section title="9. Cookies a sledovací technologie">
            <p>
              Mobilní aplikace BarfingApp <strong>nepoužívá cookies</strong>. K
              provozu využívá pouze technické identifikátory zařízení nezbytné
              pro fungování aplikace.
            </p>
          </Section>

          <Section title="10. Změny zásad">
            <p>
              Tyto zásady můžeme čas od času aktualizovat. O podstatných
              změnách tě budeme informovat{" "}
              <strong>
                prostřednictvím aplikace nebo e-mailem nejméně 14 dní předem
              </strong>
              .
            </p>
          </Section>

          <Section title="11. Kontakt">
            <p>
              S jakýmkoliv dotazem ohledně zpracování osobních údajů nebo
              uplatněním svých práv se obrať na:{" "}
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

const SubSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element => (
  <div className="mb-5">
    <h3 className="mb-2 text-[16px] font-semibold text-gray-800">{title}</h3>
    {children}
  </div>
);
