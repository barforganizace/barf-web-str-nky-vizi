export type Post = {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  perex: string;
  date: string;
  readTime: string;
  source: string;
  sourceUrl: string;
  image: string;
  featured?: boolean;
  content: React.ReactNode;
};

// Keep React import available for JSX in content
import React from "react";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 mt-10 [font-family:'Inter',Helvetica] text-[22px] font-semibold leading-snug text-[#191c1d] sm:text-[26px]">
    {children}
  </h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-5 leading-[1.75] text-gray-600">{children}</p>
);
const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="mb-5 flex flex-col gap-2 pl-1">{children}</ul>
);
const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 leading-relaxed text-gray-600">
    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#506600]" />
    <span>{children}</span>
  </li>
);
const Callout = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warn" }) => (
  <div className={`mb-5 rounded-xl border p-5 text-sm leading-relaxed ${
    type === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-[#c3e366]/40 bg-[#c3e96b]/10 text-[#3d4f00]"
  }`}>
    {children}
  </div>
);

export const posts: Post[] = [
  {
    id: "barf-rizika-co-hlidat",
    category: "Výzkum",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "BARF: co musíte hlídat, než pustíte do lednice syrové maso",
    perex:
      "Veterináři z MetropoleVet upozorňují: nejčastějšími problémy BARF diety jsou výživová nerovnováha a skrytí parazité. Zjistěte, jak se jim vyhnout a co opravdu kontrolovat.",
    date: "2. června 2026",
    readTime: "5 min čtení",
    source: "MetropoleVet Praha",
    sourceUrl: "https://www.metropolevet.cz/barf/",
    image: "/news-1.jpg",
    featured: true,
    content: (
      <>
        <P>
          BARF (Biologically Appropriate Raw Food) je způsob krmení, který v posledních letech zažívá obrovský boom. Jenže popularita s sebou nese i rizika — zejména pro majitele, kteří začínají bez odborného vedení. Veterinární klinika MetropoleVet Praha shrnuje, na co si dát pozor od prvního dne.
        </P>

        <H2>Nutriční nerovnováha je největší past</H2>
        <P>
          Výzkumy opakovaně ukazují, že domácí BARF recepty nejčastěji postrádají vápník, mangan, jód, vitamín A a vitamín D. Přebytek fosforu bez dostatečného vápníku způsobuje v dlouhodobém horizontu odvápnění kostí — paradoxně u diety, která má být přirozenější než granule.
        </P>
        <Callout>
          Poměr vápníku a fosforu by měl být přibližně <strong>1,2 : 1</strong>. Při krmení samotnou svalovinou bez kostí nebo kostní moučky bývá tento poměr obrácený.
        </Callout>

        <H2>Parazité a bakterie: psi jako tiché přenašeče</H2>
        <P>
          Psi a kočky na syrové stravě nemusejí onemocnět, ale mohou být latentně infikováni a infekci šířit dál — na ostatní zvířata v domácnosti i na lidi. Rizikové jsou především <em>Salmonella</em>, <em>Listeria</em>, toxigenní <em>E. coli</em> a při nedostatečném zmrazování také parazité jako <em>Toxoplasma gondii</em> nebo <em>Sarcocystis</em>.
        </P>
        <Ul>
          <Li>Maso před zkrmením hluboce zmrazte: minimálně 1 týden při –17 °C až –20 °C.</Li>
          <Li>Každých 6 týdnů nechejte vyšetřit trus na infekční původce.</Li>
          <Li>Při manipulaci se syrým masem dodržujte kuchyňskou hygienu stejně přísně jako pro lidskou stravu.</Li>
          <Li>Nekrmte surovou vepřovinou — riziko Aujeszkyho choroby je u psů smrtelné.</Li>
        </Ul>

        <H2>Krevní BARF profil: základ, na který se zapomíná</H2>
        <P>
          Před zahájením BARF diety doporučují veterináři udělat základní krevní odběr. Zjistíte výchozí hodnoty minerálů a vitamínů a po 3–6 měsících krmení srovnáte, jak se strava projevila. Bez tohoto srovnání krmíte naslepo.
        </P>

        <H2>Pro koho BARF není vhodný</H2>
        <Ul>
          <Li>Štěňata do 6 měsíců — rostoucí kostra vyžaduje přesnou nutriční bilanci, kterou domácí recept jen těžko zaručí.</Li>
          <Li>Psi s pankreatitidou nebo onemocněním trávicí soustavy.</Li>
          <Li>Psi na imunosupresivní léčbě nebo chemoterapii.</Li>
          <Li>Domácnosti s těhotnými ženami, malými dětmi nebo imunokompromitovanými osobami.</Li>
        </Ul>

        <Callout type="warn">
          <strong>Důležité:</strong> BARF není zakázaný ani nebezpečný per se — ale vyžaduje znalosti a pravidelnou kontrolu. Pokud začínáte, poraďte se nejprve s veterinárním nutričním specialistou.
        </Callout>
      </>
    ),
  },
  {
    id: "barf-jidelnicek-pomery",
    category: "Tipy",
    categoryColor: "bg-[#c3e3664c] text-[#506600]",
    title: "Jak sestavit BARF jídelníček: správné poměry a suroviny podle váhy psa",
    perex:
      "70 % maso, 15 % kosti, 10 % vnitřnosti, 5 % zelenina — to je základ. Jenže praxe je složitější. Přinášíme konkrétní čísla a příklady pro psy od 5 do 40 kg.",
    date: "28. května 2026",
    readTime: "6 min čtení",
    source: "Rufruf.cz",
    sourceUrl: "https://www.rufruf.cz/blog/barf-jidelnicek-jak-spravne-krmit-psa-syrovou-stravou",
    image: "/news-2.jpg",
    content: (
      <>
        <P>
          Sestavení vyváženého BARF jídelníčku je věda i umění zároveň. Zlaté pravidlo říká, že pes by měl sníst <strong>2–3 % své tělesné hmotnosti denně</strong> v syrovém krmení. Ale co přesně do té dávky dát?
        </P>

        <H2>Základní poměry složek</H2>
        <Ul>
          <Li><strong>Svalovina (maso bez kosti):</strong> 65–70 % celkové dávky — hovězí, kuřecí, krůtí, jehněčí, zvěřina</Li>
          <Li><strong>Masité kosti:</strong> 10–15 % — kuřecí krky, křídla, hovězí žebra obalená masem (poměr kost/maso cca 50/50)</Li>
          <Li><strong>Vnitřnosti:</strong> 5–10 % — játra max. 5 %, zbytek srdce, ledviny, dršťky, plíce</Li>
          <Li><strong>Zelenina a ovoce:</strong> 5–10 % — mrkev, dýně, brokolice, špenát, borůvky</Li>
          <Li><strong>Doplňky:</strong> vejce (2–3× týdně), ryby (1–2× týdně), kelp, psyllium</Li>
        </Ul>

        <H2>Kolik gramů denně?</H2>
        <P>
          Orientační denní dávky při aktivitě střední úrovně:
        </P>
        <div className="mb-5 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Váha psa</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Denní dávka (2,5 %)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Z toho maso</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Z toho kosti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["5 kg", "125 g", "~85 g", "~18 g"],
                ["10 kg", "250 g", "~170 g", "~35 g"],
                ["20 kg", "500 g", "~340 g", "~70 g"],
                ["30 kg", "750 g", "~510 g", "~105 g"],
                ["40 kg", "1 000 g", "~680 g", "~140 g"],
              ].map(([vaha, davka, maso, kosti]) => (
                <tr key={vaha} className="text-gray-600">
                  <td className="px-4 py-3 font-medium">{vaha}</td>
                  <td className="px-4 py-3">{davka}</td>
                  <td className="px-4 py-3">{maso}</td>
                  <td className="px-4 py-3">{kosti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout>
          Dávky jsou orientační. Štěňata a kojící feny potřebují až dvojnásobek. Seniorní psi s nižší aktivitou naopak méně — sledujte kondici a upravujte.
        </Callout>

        <H2>Rotace bílkovin: proč nekrmit pořád totéž</H2>
        <P>
          Každý druh masa má trochu jiný aminokyselinový a minerální profil. Ideál je střídat alespoň 3–4 zdroje bílkovin v průběhu týdne. Kuřecí je levné a stravitelné, hovězí má nejvíc zinku a železa, jehněčí je skvělé pro psy s intolerancí kuřete, ryby dodají omega-3 mastné kyseliny.
        </P>

        <H2>Zelenina: syrová nebo vařená?</H2>
        <P>
          Podávejte ji nejlépe rozmixovanou nebo nastrouhanou — pes nedokáže trávit celulózu stejně jako člověk. Lehké spaření je v pořádku. Vyhněte se cibuli, česneku ve větším množství, hroznům a rozinkám — jsou pro psy toxické.
        </P>
      </>
    ),
  },
  {
    id: "barf-terminologie-2025-studie",
    category: "Výzkum",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Vědecká studie 2025: chaos v terminologii syrových diet komplikuje výzkum i praxi",
    perex:
      "Recenzovaná studie z časopisu Frontiers in Veterinary Science z roku 2025 odhaluje, že pojmy BARF, RMBD a RAP nemají jednotnou definici — a to brzdí výzkum i regulaci.",
    date: "20. května 2026",
    readTime: "5 min čtení",
    source: "Frontiers in Veterinary Science, 2025",
    sourceUrl: "https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2025.1547953/full",
    image: "/news-3.jpg",
    content: (
      <>
        <P>
          Vědecký článek publikovaný v prestižním časopise <em>Frontiers in Veterinary Science</em> v roce 2025 přináší znepokojivé zjištění: výzkumníci, výrobci krmiv, regulátoři i majitelé psů mluví o „syrové stravě" — ale každý si pod tím představuje něco jiného.
        </P>

        <H2>Tři pojmy, tři různé světy</H2>
        <P>
          Autoři identifikují tři hlavní termíny, které se v praxi prolínají:
        </P>
        <Ul>
          <Li><strong>RMBD (Raw Meat-Based Diets)</strong> — akademický termín, nejširší definice: vše, co obsahuje tepelně neupravené maso</Li>
          <Li><strong>BARF (Biologically Appropriate Raw Food)</strong> — populární název s filozofickým podtextem: napodobení přirozené stravy předků</Li>
          <Li><strong>RAP (Raw Animal Products)</strong> — regulatorní termín, zaměřený na bezpečnost a legislativu</Li>
        </Ul>
        <P>
          Problém nastává, když výrobce označí produkt jako „BARF", ale výzkumná studie testuje „RMBD" — výsledky jsou pak nesrovnatelné.
        </P>

        <H2>Navrhované řešení: RAMP</H2>
        <P>
          Autoři navrhují sjednotit terminologii pod zastřešující zkratku <strong>RAMP (Raw and Minimally Processed)</strong>. Ta by zahrnovala i produkty ošetřené alternativními metodami sterilizace — vysokotlakovou pasteurizací (HPP), fermentací nebo okyselenou krmnou vodou — aniž by přestaly být „přirozené" v očích spotřebitele.
        </P>

        <Callout>
          Vysokotlaková pasteurizace (HPP) dokáže eliminovat patogeny jako <em>Salmonella</em> a <em>Listeria</em> bez tepelné úpravy. Produkty ošetřené HPP se stále řadí mezi „raw" v USA i v EU.
        </Callout>

        <H2>Proč to má praktický dopad pro vás</H2>
        <P>
          Pokud čtete studii, která říká „BARF zvyšuje/snižuje riziko XY", zkontrolujte, co přesně autoři testovali. Výsledky ze studií na komerčním frozen-raw krmivu ošetřeném HPP nelze přímočaře aplikovat na domácí syrové recepty — a naopak.
        </P>
        <Ul>
          <Li>Komerční frozen-raw produkty s HPP mají nižší mikrobiologické riziko než domácí příprava.</Li>
          <Li>Domácí recepty mají větší riziko nutriční nerovnováhy než komerční kompletní krmiva.</Li>
          <Li>„Přirozený" nebo „raw" na obale neznamená totéž jako veterinárně doporučená dieta.</Li>
        </Ul>
      </>
    ),
  },
  {
    id: "prechod-z-granuli-na-barf",
    category: "Začátky",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Přechod z granulí na BARF: týden po týdnu bez průjmu a stresu",
    perex:
      "Příliš rychlý přechod způsobuje zažívací problémy u většiny psů. Podrobný plán na 3 týdny — co dávat, jak sledovat reakce a kdy zpomalit.",
    date: "14. května 2026",
    readTime: "5 min čtení",
    source: "Krmeni.cz",
    sourceUrl: "https://krmeni.cz/barf",
    image: "/news-4.jpg",
    content: (
      <>
        <P>
          Trávicí systém psa přizpůsobeného na granule potřebuje čas, aby si vybudoval správnou mikroflóru pro syrové maso. Náhlý přechod ze dne na den je nejčastější příčina průjmů, zvracení a odmítání nového krmiva.
        </P>

        <H2>Týden 1: pomalé seznámení (80 % granule / 20 % BARF)</H2>
        <P>
          Začněte přidávat jen malé množství syrového masa — ideálně kuřecí nebo krůtí, která jsou nejstravitelnější. Podávejte BARF část odděleně od granulí (ne smíchané v jedné misce) — žaludek tráví oboje jinak rychle.
        </P>
        <Callout>
          Sledujte konzistenci trusu. Mírné změny jsou normální. Vodnatý průjem déle než 2 dny = zpomalte nebo přidejte probiotika.
        </Callout>

        <H2>Týden 2: půl na půl (50 % / 50 %)</H2>
        <P>
          Pokud první týden proběhl bez problémů, zvyšte podíl BARF na polovinu. Přidejte první vnitřnosti — játra maximálně 1× týdně a v malém množství (játra jsou bohatá na vitamín A, přebytek způsobuje hypervitaminózu).
        </P>
        <Ul>
          <Li>Kuřecí játra: max. 50 g na 10 kg váhy psa týdně</Li>
          <Li>Přidejte malé množství rozmixované zeleniny (mrkev, dýně)</Li>
          <Li>Pokud pes zeleninu odmítá, zkuste ji lehce spařit horkou vodou</Li>
        </Ul>

        <H2>Týden 3: plný přechod (100 % BARF)</H2>
        <P>
          Pokud prošly oba týdny bez komplikací, přejděte na plný BARF. Granule úplně vynechte — jejich kombinace s čerstvým masem v jedné porci zpomaluje trávení (rozdílná rychlost průchodu trávicím traktem).
        </P>

        <H2>Co sledovat po přechodu</H2>
        <Ul>
          <Li><strong>Srst:</strong> za 4–8 týdnů by měla být lesklejší a hutnější</Li>
          <Li><strong>Trus:</strong> menší objem, pevnější konzistence, méně zápachu — to je normální a žádoucí</Li>
          <Li><strong>Energetická úroveň:</strong> vyšší čilost u většiny psů po stabilizaci</Li>
          <Li><strong>Hmotnost:</strong> vážte každé 2 týdny a podle toho upravujte dávky</Li>
        </Ul>

        <Callout type="warn">
          Pokud pes po 3 týdnech stále odmítá jíst nebo má přetrvávající zažívací problémy, poraďte se s veterinářem. Ne každý pes musí na BARF přejít — a to je v pořádku.
        </Callout>
      </>
    ),
  },
  {
    id: "letni-barf-horke-mesiuce",
    category: "Sezóna",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "Letní BARF: jak upravit krmení v horkých měsících a čeho se vyvarovat",
    perex:
      "Léto přináší dvě výzvy: rychlé kažení masa a přehřívání psa. Ukážeme, jak bezpečně krmit v létě, které suroviny přidat a jak BARF využít k přirozené hydrataci.",
    date: "5. května 2026",
    readTime: "4 min čtení",
    source: "Yoggies.cz",
    sourceUrl: "https://yoggies.cz/b-a-r-f-maso-pro-psy/",
    image: "/news-5.jpg",
    content: (
      <>
        <P>
          Syrové maso a horko jsou nebezpečná kombinace. Bakterie se množí nejrychleji v teplotním rozmezí 4–60 °C — a letní kuchyňská linka nebo zahradní miska jsou v tomto pásmu po celý den. Několik úprav však umí letní BARF bezpečným udělat.
        </P>

        <H2>Bezpečnost na prvním místě: chladný řetězec</H2>
        <Ul>
          <Li>Rozmrazujte vždy v lednici (nikdy na lince nebo v teplé vodě).</Li>
          <Li>Rozmrazené maso spotřebujte do 24 hodin — v létě ideálně do 12 hodin.</Li>
          <Li>Misku s nedojedeným jídlem odstraňte do 20 minut, v létě do 10 minut.</Li>
          <Li>Nikdy nerozmrazujte a znovu nezamrazujte.</Li>
        </Ul>

        <H2>Letní suroviny: přirozená hydratace</H2>
        <P>
          Léto je ideální čas zařadit do BARFu suroviny s vysokým obsahem vody, které psa přirozeně hydratují:
        </P>
        <Ul>
          <Li><strong>Vodní meloun (bez semínek a slupky):</strong> 92 % vody, přírodní cukry pro okamžitou energii</Li>
          <Li><strong>Okurka:</strong> 96 % vody, nízkokalorická, skvělá pro psy s nadváhou</Li>
          <Li><strong>Borůvky:</strong> antioxidanty a vitamín C, max. hrstka denně</Li>
          <Li><strong>Celer:</strong> hydratace + přirozené vitamíny skupiny B</Li>
        </Ul>

        <Callout>
          Zmrazené BARF kuličky nebo kostky z rozmixované zeleniny a masa jsou výborná letní pochoutka. Psi je milují — a vy máte klid, že se jídlo nezkazí.
        </Callout>

        <H2>Snižte podíl tuku</H2>
        <P>
          V létě snižte tučnější části (bůček, tučné hovězí) a nahraďte je libovějšími zdroji — kuřecím prsním masem, králíkem nebo rybami. Tuk zvyšuje metabolické teplo a může u přehřátého psa způsobit pankreatitidu.
        </P>

        <H2>Kdy krmit?</H2>
        <P>
          V létě přesuňte hlavní krmení do ranních nebo večerních hodin, kdy je teplotně příjemněji. Vyhněte se krmení v poledne nebo hned po pohybu na přímém slunci — přehřátý pás trávicí trubice tráví hůře a riziko problémů roste.
        </P>
      </>
    ),
  },
  {
    id: "vnitřnosti-v-barf-proc-jsou-dulezite",
    category: "Věda",
    categoryColor: "bg-teal-100 text-teal-700",
    title: "Vnitřnosti v BARF: proč jsou nenahraditelné a jak je správně zařadit",
    perex:
      "Játra, ledviny, srdce — vnitřnosti jsou nutričně nejbohatší část BARF diety. Ale jejich přebytek škodí stejně jako nedostatek. Jak na správné dávkování?",
    date: "22. dubna 2026",
    readTime: "5 min čtení",
    source: "ForBarf.cz",
    sourceUrl: "https://www.forbarf.cz/barf-vyziva-psa",
    image: "/news-6.jpg",
    content: (
      <>
        <P>
          Vnitřnosti jsou v BARF komunitě někdy podceňované, jindy přeceňované. Pravda leží uprostřed: jde o nutričně nejhustší složku celé diety, která zároveň při přebytek způsobuje vážné zdravotní problémy.
        </P>

        <H2>Proč vnitřnosti nesmí chybět</H2>
        <P>
          Svalovina sama o sobě nestačí. Vnitřnosti obsahují živiny, které maso nenabídne v dostatečném množství:
        </P>
        <Ul>
          <Li><strong>Játra:</strong> největší zásobárna vitamínu A, B12, železa, mědi a folátu v přírodě</Li>
          <Li><strong>Ledviny:</strong> vitamín B-komplex, selen, omega-3 mastné kyseliny</Li>
          <Li><strong>Srdce:</strong> technicky svaly, ale bohaté na koenzym Q10 a taurin — klíčový pro srdeční funkci</Li>
          <Li><strong>Dršťky (bachor):</strong> přirozené probiotikum, pomáhají střevní mikroflóře</Li>
          <Li><strong>Plíce:</strong> nízkokalorické, bohaté na elastin a kolagen</Li>
        </Ul>

        <H2>Játra: mocná, ale nebezpečná v přebytku</H2>
        <P>
          Vitamín A je v játrech vázán v retinolové formě — tedy přímo využitelné (na rozdíl od betakarotenu z mrkve). To znamená, že při přebytku se hromadí v organismu. Hypervitaminóza A způsobuje deformace kostí, nechutenství a neurologické příznaky.
        </P>
        <Callout type="warn">
          Maximální doporučené množství jater: <strong>5 % celkové krmné dávky týdně</strong>. Pro psa o 10 kg (250 g/den = 1 750 g/týden) to je přibližně 85–90 g jater za celý týden.
        </Callout>

        <H2>Doporučené zastoupení vnitřností v týdenním jídelníčku</H2>
        <Ul>
          <Li>Játra: 1–2× týdně, max. 5 % týdenní dávky</Li>
          <Li>Ledviny: 1–2× týdně, 2–3 % týdenní dávky</Li>
          <Li>Srdce: 2–3× týdně (počítá se do svaloviny, ne do limitu vnitřností)</Li>
          <Li>Dršťky nebo bachor: 1–2× týdně, 2–3 % týdenní dávky</Li>
          <Li>Plíce, vemeno: dle dostupnosti, 2–3 % týdenní dávky</Li>
        </Ul>

        <H2>Kde vnitřnosti sehnat?</H2>
        <P>
          Nejlevněji u místních řezníků nebo přímo od zemědělců. Velkoobchodní dodavatelé BARF surovin (jako Beez nebo ForBarf) nabízejí balíčky mražených vnitřností za výrazně nižší ceny než supermarkety. Mražené vnitřnosti mají navíc výhodu: zmrazení eliminuje část parazitárních rizik.
        </P>
      </>
    ),
  },
];
