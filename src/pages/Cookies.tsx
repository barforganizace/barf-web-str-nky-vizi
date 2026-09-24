import { SharedNav } from "../components/SharedNav";

export const Cookies = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      <main className="mx-auto max-w-[860px] px-6 py-12 lg:py-16">
        <article>
          <h1 className="mb-2 [font-family:'Inter',Helvetica] text-[36px] font-normal leading-tight tracking-[-1px] text-[#191c1d] lg:text-[48px]">
            Cookies
          </h1>
          <p className="mb-10 text-sm text-gray-500">Účinnost od 24. 9. 2026</p>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Krátká verze</p>
            <p className="mt-1 leading-relaxed">
              Tento web <strong>neukládá do tvého prohlížeče žádné cookies</strong> — ani
              vlastní, ani reklamní, ani analytické. Proto tu nenajdeš žádnou lištu se
              souhlasem, kterou bys musel odklikávat.
            </p>
          </div>

          <Section title="1. Co jsou cookies">
            <p>
              Cookies jsou malé soubory, které si web odloží v prohlížeči a které se pak
              automaticky posílají zpět serveru s každým dalším požadavkem. Typicky slouží
              k rozpoznání návštěvníka mezi jednotlivými návštěvami — a právě proto je na
              ně potřeba souhlas, pokud nejsou nezbytné pro provoz.
            </p>
          </Section>

          <Section title="2. Cookies na tomto webu">
            <p>
              Žádné nepoužíváme. Nemáme reklamní ani remarketingové skripty, nepoužíváme
              Google Analytics, Facebook Pixel ani nic podobného.
            </p>
          </Section>

          <Section title="3. Co si web ukládá do prohlížeče">
            <p>
              Místo cookies používáme <strong>localStorage</strong> — úložiště, které
              zůstává v tvém prohlížeči a samo se nikam neposílá. Ukládáme do něj jen tyhle
              tři věci:
            </p>
            <ul className="mt-3 space-y-3 pl-5">
              <li>
                <strong>i18nextLng</strong> — jazyk, který sis přepnul (CZ / EN), aby web
                při dalším příchodu nezačal znovu v češtině.
              </li>
              <li>
                <strong>barf-bowl</strong> — suroviny a gramáže, které sis naskládal do
                misky v katalogu surovin, aby ti miska nezmizela po obnovení stránky.
                Ukládá se jen ID surovin a počet gramů.
              </li>
              <li>
                <strong>sb-…-auth-token</strong> — přihlášení k účtu, aby ses nemusel
                přihlašovat po každém načtení stránky. Vytvoří se až ve chvíli, kdy se
                přihlásíš, a při odhlášení zmizí.
              </li>
            </ul>
            <p className="mt-4">
              Všechny tři jsou nezbytné pro funkci, kterou si sám vyžádáš, takže podle §
              89 zákona č. 127/2005 Sb., o elektronických komunikacích, nepotřebují tvůj
              souhlas.
            </p>
          </Section>

          <Section title="4. Měření návštěvnosti">
            <p>
              Ke statistikám návštěvnosti používáme <strong>Umami</strong>, které funguje
              bez cookies a bez identifikátorů. Vidíme z něj jen agregovaná čísla — kolik
              lidí přišlo, na které stránky a odkud — a nedokážeme podle nich rozpoznat
              konkrétního člověka ani ho spojit s účtem.
            </p>
          </Section>

          <Section title="5. Odkazy mimo tento web">
            <p>
              Z webu vedou odkazy na Google Play, na webovou verzi aplikace
              (barfing.net) a na sociální sítě. Jakmile na ně klikneš, platí pravidla
              těch služeb, ne tato stránka — a ty už cookies používat mohou.
            </p>
          </Section>

          <Section title="6. Jak se uložených údajů zbavíš">
            <p>
              Stačí v prohlížeči vymazat data webu (v Chrome i Firefoxu pod
              <em> Nastavení → Soukromí → Data stránek</em>) nebo web otevřít v anonymním
              okně. Samotné přihlášení zmizí i běžným odhlášením z účtu.
            </p>
          </Section>

          <Section title="7. Změny">
            <p>
              Kdybychom někdy cookies začali používat, doplníme sem jejich seznam a
              přidáme lištu, kde jejich použití potvrdíš nebo odmítneš. Do té doby tady
              není co odklikávat.
            </p>
          </Section>

          <Section title="8. Kontakt">
            <p>
              Na dotazy k cookies a soukromí odpovídáme na{" "}
              <a
                href="mailto:barfingapp@gmail.com"
                className="text-[#506600] hover:underline"
              >
                barfingapp@gmail.com
              </a>
              .
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
