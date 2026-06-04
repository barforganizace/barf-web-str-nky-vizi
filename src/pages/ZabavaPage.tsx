import { SharedNav } from "../components/SharedNav";

const games = [
  {
    id: "mistr",
    title: "BARF Mistr",
    tag: "Kvíz",
    description: "Otestuj znalosti o BARF dietě — poměry surovin, výživa, pravidla krmení.",
    emoji: "🧠",
    colorLight: "#f7fde8",
    colorBorder: "#d4ed85",
    tagBg: "#f7fde8",
    tagColor: "#506600",
    src: "/barf-game%20(3)%20(1).html",
  },
  {
    id: "lovec",
    title: "BARF Lovec",
    tag: "Arkáda",
    description: "Chytej správné suroviny a vyhýbej se špatným. Prověří reflexy i znalost BARF složek.",
    emoji: "🎯",
    colorLight: "#f5f3ff",
    colorBorder: "#ddd6fe",
    tagBg: "#f5f3ff",
    tagColor: "#7C3AED",
    src: "/barf-lovec%20(1).html",
  },
];

export const ZabavaPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      {/* Hero */}
      <div className="relative overflow-hidden bg-textdark px-6 py-12 text-center">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#c3e96b]/10 blur-[80px]" />
        <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px]" />
        <p className="mb-3 [font-family:'Manrope',Helvetica] text-sm font-bold tracking-[2.5px] text-[#c3e96b]">
          MINI HRY
        </p>
        <h1 className="mb-3 [font-family:'Inter',Helvetica] text-[38px] font-normal leading-tight tracking-[-1.2px] text-white sm:text-[50px]">
          Zábava se světem BARF
        </h1>
        <p className="text-base text-[#ffffffb8]">
          Dvě mini hry přímo v prohlížeči — žádná instalace, hraj hned.
        </p>
      </div>

      {/* Games */}
      <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-10">
          {games.map((game) => (
            <div
              key={game.id}
              className="overflow-hidden rounded-3xl border-2 bg-white shadow-sm"
              style={{ borderColor: game.colorBorder }}
            >
              {/* header strip */}
              <div
                className="flex items-center gap-4 border-b px-6 py-4"
                style={{ borderColor: game.colorBorder, backgroundColor: game.colorLight }}
              >
                <span className="text-3xl">{game.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="[font-family:'Inter',Helvetica] text-[18px] font-semibold text-[#191c1d]">
                      {game.title}
                    </h2>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: game.tagBg, color: game.tagColor, border: `1px solid ${game.colorBorder}` }}
                    >
                      {game.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{game.description}</p>
                </div>
              </div>

              {/* iframe — hra přímo na stránce */}
              <iframe
                src={game.src}
                title={game.title}
                className="h-[600px] w-full border-0 sm:h-[700px]"
                allow="fullscreen"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-textdark px-8 py-10 text-center">
          <p className="mb-1 text-sm font-semibold tracking-widest text-[#c3e96b]">APLIKACE</p>
          <h2 className="mt-2 [font-family:'Inter',Helvetica] text-[26px] font-normal text-white sm:text-[32px]">
            Chceš sledovat skutečné krmení?
          </h2>
          <p className="mt-3 text-[#ffffffb8]">
            Stáhni BarfingApp a hlídej lednici, makra i zásoby.
          </p>
          <a
            href="/stazeni"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#c3e96b] px-7 py-3.5 text-base font-bold text-[#191c1d] transition-opacity hover:opacity-90"
          >
            Stáhnout zdarma
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </a>
        </div>
      </main>
    </div>
  );
};
