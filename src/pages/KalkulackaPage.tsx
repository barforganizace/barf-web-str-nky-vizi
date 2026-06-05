import { useState } from "react";
import { SharedNav } from "../components/SharedNav";


const LiverIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
    <path d="M16 25C10 22 6 17 7 12C8 8 12 7 15 9.5C15.5 9.9 16 10.6 16 10.6C16 10.6 16.5 9.9 17 9.5C20 7 24 8 25 12C26 17 22 22 16 25Z" fill="#8B5CF6"/>
    <path d="M16 22C11.5 19.5 8.5 15.5 9.5 11.5C10 9 13 8.5 15.5 10.5L16 11.2L16.5 10.5C19 8.5 22 9 22.5 11.5C23.5 15.5 20.5 19.5 16 22Z" fill="#A78BFA"/>
    <ellipse cx="13" cy="13" rx="2" ry="1.2" fill="#C4B5FD" opacity="0.6" transform="rotate(-20 13 13)"/>
  </svg>
);

// ─── Výpočetní jádro (přesně podle barf-calc.js) ─────────────────────────────

type BreedSize = "small" | "medium" | "large" | "giant";
type Activity  = "gaucak" | "pohodar" | "sportovec";
type Condition = "underweight" | "ideal" | "overweight";
type Stage     = "puppy" | "adult" | "senior";

const STAGE_THRESHOLDS: Record<BreedSize, { puppyEnd: number; seniorStart: number }> = {
  small:  { puppyEnd: 10, seniorStart: 96 },
  medium: { puppyEnd: 12, seniorStart: 84 },
  large:  { puppyEnd: 15, seniorStart: 72 },
  giant:  { puppyEnd: 24, seniorStart: 60 },
};

const ADULT_RATES: Record<BreedSize, Record<Activity, { neutral: number; neutered: number }>> = {
  small:  { gaucak: { neutral: 2.5, neutered: 2.2 }, pohodar: { neutral: 3.0, neutered: 2.7 }, sportovec: { neutral: 3.5, neutered: 3.2 } },
  medium: { gaucak: { neutral: 2.0, neutered: 1.8 }, pohodar: { neutral: 2.5, neutered: 2.2 }, sportovec: { neutral: 3.0, neutered: 2.7 } },
  large:  { gaucak: { neutral: 1.8, neutered: 1.6 }, pohodar: { neutral: 2.2, neutered: 2.0 }, sportovec: { neutral: 2.7, neutered: 2.4 } },
  giant:  { gaucak: { neutral: 1.5, neutered: 1.3 }, pohodar: { neutral: 1.8, neutered: 1.6 }, sportovec: { neutral: 2.2, neutered: 2.0 } },
};

const PUPPY_RATES = [
  { maxMonths: 4,  percent: 9.0, label: "do 4 měsíců" },
  { maxMonths: 6,  percent: 7.0, label: "4–6 měsíců" },
  { maxMonths: 9,  percent: 5.5, label: "6–9 měsíců" },
  { maxMonths: 12, percent: 4.5, label: "9–12 měsíců" },
];

const CONDITION_ADJUST: Record<Condition, number> = { underweight: 0.5, ideal: 0.0, overweight: -0.5 };

const MICRO_PER_KG: Record<Stage, { calcium_mg: number; phosphorus_mg: number; magnesium_mg: number; iron_mg: number; zinc_mg: number; vitamin_a_ug: number; vitamin_d_ug: number }> = {
  puppy:  { calcium_mg: 320, phosphorus_mg: 250, magnesium_mg: 14,   iron_mg: 2.2,  zinc_mg: 2.25, vitamin_a_ug: 75,   vitamin_d_ug: 1.4 },
  adult:  { calcium_mg: 120, phosphorus_mg: 100, magnesium_mg: 8.75, iron_mg: 1.25, zinc_mg: 1.5,  vitamin_a_ug: 37.5, vitamin_d_ug: 0.688 },
  senior: { calcium_mg: 120, phosphorus_mg: 100, magnesium_mg: 8.75, iron_mg: 1.25, zinc_mg: 1.5,  vitamin_a_ug: 37.5, vitamin_d_ug: 0.688 },
};

function getStage(ageMonths: number, breedSize: BreedSize): Stage {
  const { puppyEnd, seniorStart } = STAGE_THRESHOLDS[breedSize];
  if (ageMonths < puppyEnd) return "puppy";
  if (ageMonths >= seniorStart) return "senior";
  return "adult";
}

function calcDaily(weightKg: number, ageMonths: number, breedSize: BreedSize, activity: Activity, neutered: boolean, condition: Condition) {
  const stage = getStage(ageMonths, breedSize);
  let percent: number;

  if (stage === "puppy") {
    const bracket = PUPPY_RATES.find((r) => ageMonths <= r.maxMonths) ?? PUPPY_RATES[PUPPY_RATES.length - 1];
    percent = bracket.percent;
  } else if (stage === "senior") {
    const rates = ADULT_RATES[breedSize].gaucak;
    percent = neutered ? rates.neutered : rates.neutral;
  } else {
    const rates = ADULT_RATES[breedSize][activity];
    percent = neutered ? rates.neutered : rates.neutral;
  }

  percent += CONDITION_ADJUST[condition];
  const ration_g = Math.round((weightKg * percent / 100) * 1000);
  const micro = MICRO_PER_KG[stage];

  return {
    stage, percent,
    ration_g,
    muscle_g:       Math.round(ration_g * 0.70),
    rmb_g:          Math.round(ration_g * 0.10),
    organs_g:       Math.round(ration_g * 0.05),
    kidneys_g:      Math.round(ration_g * 0.05),
    other_g:        Math.round(ration_g * 0.10),
    kcal:           Math.round(ration_g * 1.6),
    calcium_mg:     Math.round(weightKg * micro.calcium_mg),
    phosphorus_mg:  Math.round(weightKg * micro.phosphorus_mg),
    magnesium_mg:   Math.round(weightKg * micro.magnesium_mg),
    iron_mg:        Math.round(weightKg * micro.iron_mg * 10) / 10,
    zinc_mg:        Math.round(weightKg * micro.zinc_mg * 10) / 10,
    vitamin_a_ug:   Math.round(weightKg * micro.vitamin_a_ug),
    vitamin_d_ug:   Math.round(weightKg * micro.vitamin_d_ug * 10) / 10,
  };
}

// ─── UI data ──────────────────────────────────────────────────────────────────

const SIZES = [
  { key: "small"  as BreedSize, label: "Malý pes",   sub: "do 10 kg",   example: "Čivava, Krysařík, Yorkie",       img: "/dog small.svg",  color: "#FEF3C7", cardH: 72  },
  { key: "medium" as BreedSize, label: "Střední pes", sub: "10–25 kg",   example: "Border Kolie, Kokršpaněl",       img: "/dog medium.svg", color: "#EDE9FE", cardH: 88  },
  { key: "large"  as BreedSize, label: "Velký pes",   sub: "25–45 kg",   example: "Labrador, Zlatý retrívr",        img: "/dog big.svg",    color: "#FEF9C3", cardH: 104 },
  { key: "giant"  as BreedSize, label: "Obří pes",    sub: "nad 45 kg",  example: "Doga, Bernardýn, Newfoundland",  img: "/dog huge.svg",   color: "#FCE7F3", cardH: 120 },
];

const WEIGHT_RANGE: Record<BreedSize, [number, number]> = {
  small: [1, 10], medium: [10, 25], large: [25, 45], giant: [45, 80],
};

const ACTIVITIES: { key: Activity; label: string; sub: string; emoji: string }[] = [
  { key: "gaucak",    label: "Gaučák",    sub: "Málo pohybu, převážně doma",       emoji: "🛋️" },
  { key: "pohodar",   label: "Pohodář",   sub: "Běžné procházky 30–60 min denně",  emoji: "🚶" },
  { key: "sportovec", label: "Sportovec", sub: "Sport, agility, pracovní pes",     emoji: "🏆" },
];

const CONDITIONS: { key: Condition; label: string; sub: string; adjust: string }[] = [
  { key: "underweight", label: "Podváha",  sub: "Viditelné kosti, žebra hmatatelná", adjust: "+0,5 %" },
  { key: "ideal",       label: "Ideální",  sub: "Žebra hmatatelná, pas viditelný",   adjust: "±0 %"   },
  { key: "overweight",  label: "Nadváha",  sub: "Žebra hůře hmatatelná, kulatý tvar", adjust: "−0,5 %" },
];

const CATS = [
  { key: "muscle",  label: "Svalovina",  pct: 70, icon: "🥩",          color: "#EF4444", light: "#FEF2F2", border: "#FECACA", detail: "Hovězí, kuřecí, krůtí, jehněčí. Střídejte alespoň 3 druhy masa týdně." },
  { key: "rmb",     label: "Masité kosti", pct: 10, icon: "🦴",          color: "#D97706", light: "#FFFBEB", border: "#FDE68A", detail: "Kuřecí krky, křídla, hovězí žebra. Vždy syrové — vařené kosti jsou nebezpečné." },
  { key: "organs",  label: "Vnitřnosti",   pct: 10, icon: <LiverIcon />, color: "#7C3AED", light: "#F5F3FF", border: "#DDD6FE", detail: "Vnitřnosti 10 % denní dávky, včetně 5 % ledvin." },
  { key: "other",   label: "Ostatní",      pct: 10, icon: "🌿",          color: "#16A34A", light: "#F0FDF4", border: "#BBF7D0", detail: "Zelenina 7 %, oříšky 2 %, ovoce 1 % z denní dávky." },
];

const STAGE_LABEL: Record<Stage, string> = { puppy: "🐾 Štěně", adult: "🐕 Dospělý", senior: "🦮 Senior" };
const STAGE_NOTE: Record<Stage, string> = {
  puppy: "Procento se počítá z aktuální hmotnosti a klesá s věkem. Vážte štěně každý týden.",
  adult: "Procento vychází z matice velikost × aktivita × kastrace.",
  senior: "Senior dostává sazbu 'Gaučák' bez ohledu na aktivitu.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Steps = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-8 flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
          i < current ? "bg-[#c3e96b] text-[#191c1d]" : i === current ? "bg-[#191c1d] text-white" : "bg-gray-200 text-gray-400"
        }`}>
          {i < current ? "✓" : i + 1}
        </div>
        {i < total - 1 && <div className={`h-0.5 w-8 rounded-full transition-all ${i < current ? "bg-[#c3e96b]" : "bg-gray-200"}`} />}
      </div>
    ))}
  </div>
);

const Radio = ({ active }: { active: boolean }) => (
  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
    active ? "border-[#191c1d] bg-[#191c1d]" : "border-gray-300"
  }`}>
    {active && <div className="h-2 w-2 rounded-full bg-white" />}
  </div>
);

function fmtAge(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} měs.`;
  if (m === 0) return `${y} ${y === 1 ? "rok" : y < 5 ? "roky" : "let"}`;
  return `${y} ${y === 1 ? "rok" : y < 5 ? "roky" : "let"} ${m} měs.`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export const KalkulackaPage = () => {
  const [step, setStep] = useState(0);
  const [breedSize, setBreedSize] = useState<BreedSize | null>(null);
  const [weight, setWeight]       = useState(15);
  const [ageMonths, setAgeMonths] = useState(36);
  const [activity, setActivity]   = useState<Activity | null>(null);
  const [neutered, setNeutered]   = useState<boolean | null>(null);
  const [condition, setCondition] = useState<Condition>("ideal");

  const sizeData = SIZES.find((s) => s.key === breedSize);

  const result = breedSize && activity !== null && neutered !== null
    ? calcDaily(weight, ageMonths, breedSize, activity, neutered, condition)
    : null;

  const detectedStage = breedSize ? getStage(ageMonths, breedSize) : null;

  const canNext = [!!breedSize, true, activity !== null && neutered !== null][step] ?? false;

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  const reset = () => { setStep(0); setBreedSize(null); setActivity(null); setNeutered(null); setCondition("ideal"); };

  const [wr0, wr1] = breedSize ? WEIGHT_RANGE[breedSize] : [1, 80];
  const sliderPct = ((weight - wr0) / (wr1 - wr0)) * 100;
  const agePct    = (ageMonths / 180) * 100;

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />
      <div className="bg-textdark px-6 py-10 text-center">
        <p className="mb-2 text-sm font-bold tracking-[2.5px] text-[#c3e96b] [font-family:'Manrope',Helvetica]">BARF KALKULAČKA</p>
        <h1 className="[font-family:'Inter',Helvetica] text-[34px] font-normal leading-tight tracking-[-1px] text-white sm:text-[46px]">Kolik sežere váš pes?</h1>
        <p className="mt-2 text-sm text-white/50">Výpočet podle FEDIAF · korekce kondice · mikroživiny</p>
      </div>

      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">

        {/* ── KROK 0: velikost ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div>
            <Steps current={0} total={3} />
            <h2 className="mb-1 text-[22px] font-semibold text-[#191c1d] [font-family:'Inter',Helvetica]">Velikost psa</h2>
            <p className="mb-6 text-sm text-gray-500">Životní fáze (štěně/dospělý/senior) se určí automaticky z věku.</p>
            <div className="flex flex-col gap-3">
              {SIZES.map((s) => {
                const active = breedSize === s.key;
                return (
                  <button key={s.key} onClick={() => { setBreedSize(s.key); setWeight(Math.round((WEIGHT_RANGE[s.key][0] + WEIGHT_RANGE[s.key][1]) / 2)); }}
                    className={`flex items-center overflow-hidden rounded-2xl border-2 bg-white text-left transition-all hover:shadow-md ${active ? "border-[#c3e96b] shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex shrink-0 items-end justify-center overflow-hidden" style={{ backgroundColor: active ? "#c3e96b" : s.color, width: 108, height: s.cardH }}>
                      <img src={s.img} alt={s.label} className="h-full w-full object-contain object-bottom" />
                    </div>
                    <div className="flex-1 px-4">
                      <p className="font-bold text-[#191c1d]">{s.label}</p>
                      <p className="text-sm text-gray-500">{s.sub}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{s.example}</p>
                    </div>
                    <div className="pr-5"><Radio active={active} /></div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── KROK 1: váha + věk ────────────────────────────────────────────── */}
        {step === 1 && sizeData && (
          <div>
            <Steps current={1} total={3} />
            <h2 className="mb-6 text-[22px] font-semibold text-[#191c1d] [font-family:'Inter',Helvetica]">Váha a věk</h2>
            <div className="flex flex-col gap-5">

              {/* váha */}
              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#191c1d]">Váha psa</p>
                    <p className="text-xs text-gray-400">Zadejte cílovou váhu (ne aktuální, pokud má pes nad/podváhu)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[44px] font-bold leading-none text-[#191c1d]">{weight}</span>
                    <span className="ml-1 text-base text-gray-400">kg</span>
                  </div>
                </div>
                <input type="range" min={wr0} max={wr1} value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-full"
                  style={{ height: 8, background: `linear-gradient(to right,#191c1d ${sliderPct}%,#e5e7eb ${sliderPct}%)` }} />
                <div className="mt-1.5 flex justify-between text-xs text-gray-400"><span>{wr0} kg</span><span>{wr1} kg</span></div>
              </div>

              {/* věk */}
              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#191c1d]">Věk psa</p>
                    <p className="text-xs text-gray-400">Věk určuje životní fázi a procento dávky</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[28px] font-bold leading-none text-[#191c1d]">{fmtAge(ageMonths)}</span>
                  </div>
                </div>
                <input type="range" min={1} max={180} value={ageMonths} onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none rounded-full"
                  style={{ height: 8, background: `linear-gradient(to right,#191c1d ${agePct}%,#e5e7eb ${agePct}%)` }} />
                <div className="mt-1.5 flex justify-between text-xs text-gray-400"><span>1 měs.</span><span>15 let</span></div>

                {detectedStage && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f7fde8] px-4 py-3">
                    <span className="text-xl">{STAGE_LABEL[detectedStage].split(" ")[0]}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#506600]">{STAGE_LABEL[detectedStage].split(" ").slice(1).join(" ")}</p>
                      <p className="text-xs text-[#506600]/70">{STAGE_NOTE[detectedStage]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── KROK 2: aktivita + kastrace + kondice ────────────────────────── */}
        {step === 2 && (
          <div>
            <Steps current={2} total={3} />
            <h2 className="mb-6 text-[22px] font-semibold text-[#191c1d] [font-family:'Inter',Helvetica]">Životní styl</h2>

            {/* aktivita — skryta pro seniory */}
            {detectedStage !== "senior" && detectedStage !== "puppy" && (
              <div className="mb-5">
                <p className="mb-3 text-sm font-semibold text-gray-700">Úroveň aktivity</p>
                <div className="flex flex-col gap-2">
                  {ACTIVITIES.map((a) => (
                    <button key={a.key} onClick={() => setActivity(a.key)}
                      className={`flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all hover:shadow-sm ${activity === a.key ? "border-[#c3e96b] bg-[#f7fde8]" : "border-gray-200"}`}>
                      <span className="text-2xl">{a.emoji}</span>
                      <div className="flex-1"><p className="font-semibold text-[#191c1d]">{a.label}</p><p className="text-xs text-gray-400">{a.sub}</p></div>
                      <Radio active={activity === a.key} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* auto-set activity for puppy/senior */}
            {(detectedStage === "puppy" || detectedStage === "senior") && activity === null && (() => { setActivity("pohodar"); return null; })()}

            {/* kastrace */}
            <div className="mb-5">
              <p className="mb-3 text-sm font-semibold text-gray-700">Kastrace / sterilizace</p>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: false, label: "Nekastrovaný/á", emoji: "🐕" }, { val: true, label: "Kastrovaný/á", emoji: "✂️" }].map((opt) => (
                  <button key={String(opt.val)} onClick={() => setNeutered(opt.val)}
                    className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-all hover:shadow-sm ${neutered === opt.val ? "border-[#c3e96b] bg-[#f7fde8]" : "border-gray-200"}`}>
                    <span className="text-2xl">{opt.emoji}</span>
                    <div className="flex-1 text-sm font-medium text-[#191c1d]">{opt.label}</div>
                    <Radio active={neutered === opt.val} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">Kastrace snižuje energetické nároky o ~10 %.</p>
            </div>

            {/* kondice */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Tělesná kondice <span className="font-normal text-gray-400">(korekce dávky)</span></p>
              <div className="flex flex-col gap-2">
                {CONDITIONS.map((c) => (
                  <button key={c.key} onClick={() => setCondition(c.key)}
                    className={`flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all hover:shadow-sm ${condition === c.key ? "border-[#c3e96b] bg-[#f7fde8]" : "border-gray-200"}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#191c1d]">{c.label}</p>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-mono text-gray-500">{c.adjust}</span>
                      </div>
                      <p className="text-xs text-gray-400">{c.sub}</p>
                    </div>
                    <Radio active={condition === c.key} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VÝSLEDKY ─────────────────────────────────────────────────────── */}
        {step === 3 && result && sizeData && (
          <div>
            {/* banner */}
            <div className="mb-6 overflow-hidden rounded-3xl bg-[#191c1d] px-7 py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c3e96b]">Celková denní dávka</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[56px] font-bold leading-none text-white">{result.ration_g}</span>
                    <span className="text-xl text-white/40">g / den</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{STAGE_LABEL[result.stage]}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{result.percent} % hmotnosti</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">≈ {result.kcal} kcal</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{Math.round(result.ration_g / 2)} g na porci (2×)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl">
                    <img src={sizeData.img} alt={sizeData.label} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-xs text-white/50">
                    <p className="font-semibold text-white">{weight} kg · {fmtAge(ageMonths)}</p>
                    <p>{sizeData.label}</p>
                    <p>{neutered ? "Kastr." : "Nekastr."} · {CONDITIONS.find(c => c.key === condition)?.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* složky */}
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              {CATS.map((cat) => {
                const keyMap: Record<string, keyof typeof result> = { muscle: "muscle_g", rmb: "rmb_g", organs: "organs_g", kidneys: "kidneys_g", other: "other_g" };
                const g = result[keyMap[cat.key]] as number;
                const pct = cat.pct;
                return (
                  <div key={cat.key} className="overflow-hidden rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: cat.border }}>
                    <div className="flex items-start gap-4 p-5 pb-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl" style={{ backgroundColor: cat.light }}>
                        {typeof cat.icon === "string" ? cat.icon : cat.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#191c1d]">{cat.label}</h3>
                          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: cat.color }}>{pct} %</span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-[26px] font-bold leading-none" style={{ color: cat.color }}>{g}</span>
                          <span className="text-sm text-gray-400">g / den</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* týdenní přehled */}
            <div className="mb-5 overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b border-gray-100 px-7 py-4">
                <h3 className="font-semibold text-[#191c1d]">Týdenní nákupní přehled</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-7 py-3 font-semibold text-gray-500">Složka</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Den</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Týden</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Měsíc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(() => {
                    const muscle_g = result.muscle_g;
                    const rmb_g = result.rmb_g;
                    const organs_g = result.organs_g + result.kidneys_g;
                    const kidneys_g = result.kidneys_g;
                    const other_g = result.other_g;
                    const veg_g = Math.round(result.ration_g * 0.07);
                    const nuts_g = Math.round(result.ration_g * 0.02);
                    const fruit_g = Math.round(result.ration_g * 0.01);

                    const renderRow = (label: string, grams: number, color?: string, indent = false) => (
                      <tr key={label} className={indent ? "hover:bg-gray-50/50" : "hover:bg-gray-50/50"}>
                        <td className={`px-7 py-3 font-medium text-gray-700 ${indent ? "pl-12" : ""}`}>
                          <div className="flex items-center gap-2">
                            {color && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />}
                            {label}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{grams} g</td>
                        <td className="px-4 py-3 text-gray-600">{(grams * 7 / 1000).toFixed(2)} kg</td>
                        <td className="px-4 py-3 text-gray-600">{(grams * 30 / 1000).toFixed(1)} kg</td>
                      </tr>
                    );

                    return [
                      renderRow("Svalovina", muscle_g, "#EF4444"),
                      renderRow("Masité kosti", rmb_g, "#D97706"),
                      renderRow("Vnitřnosti", organs_g, "#7C3AED"),
                      renderRow("  – Ledviny", kidneys_g, "#A855F7", true),
                      renderRow("Ostatní", other_g, "#16A34A"),
                      renderRow("  – Zelenina", veg_g, undefined, true),
                      renderRow("  – Oříšky", nuts_g, undefined, true),
                      renderRow("  – Ovoce", fruit_g, undefined, true),
                    ];
                  })()}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-7 py-3 text-gray-700">Celkem</td>
                    <td className="px-4 py-3 text-gray-700">{result.ration_g} g</td>
                    <td className="px-4 py-3 text-gray-700">{(result.ration_g * 7 / 1000).toFixed(2)} kg</td>
                    <td className="px-4 py-3 text-gray-700">{(result.ration_g * 30 / 1000).toFixed(1)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* mikroživiny */}
            <div className="mb-5 overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b border-gray-100 px-7 py-4">
                <h3 className="font-semibold text-[#191c1d]">Doporučená minima mikroživin <span className="text-xs font-normal text-gray-400">(FEDIAF / den)</span></h3>
              </div>
              <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
                {[
                  { label: "Vápník", value: `${result.calcium_mg} mg`, note: "Ca" },
                  { label: "Fosfor", value: `${result.phosphorus_mg} mg`, note: "P" },
                  { label: "Hořčík", value: `${result.magnesium_mg} mg`, note: "Mg" },
                  { label: "Železo", value: `${result.iron_mg} mg`, note: "Fe" },
                  { label: "Zinek", value: `${result.zinc_mg} mg`, note: "Zn" },
                  { label: "Vit. A", value: `${result.vitamin_a_ug} μg`, note: "A" },
                  { label: "Vit. D", value: `${result.vitamin_d_ug} μg`, note: "D" },
                  { label: "Kalorie", value: `${result.kcal} kcal`, note: "≈" },
                ].map((m) => (
                  <div key={m.label} className="flex flex-col items-start bg-white px-5 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{m.label}</span>
                    <span className="mt-1 text-[20px] font-bold text-[#191c1d]">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">
              <strong>Upozornění:</strong> Výsledky jsou orientační dle FEDIAF metodik. Skutečné potřeby závisí na zdravotním stavu a rase. U štěňat vážte každý týden a přepočítávejte. Poraďte se s veterinárním nutričním specialistou.
            </div>

            <button onClick={reset} className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900">
              ↺ Spočítat znovu
            </button>
          </div>
        )}

        {/* navigační tlačítka */}
        {step < 3 && (
          <div className="mt-8 flex items-center justify-between">
            {step > 0
              ? <button onClick={back} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>Zpět
                </button>
              : <div />
            }
            <button onClick={next} disabled={!canNext}
              className="flex items-center gap-2 rounded-full bg-[#191c1d] px-7 py-3 text-sm font-bold text-white transition disabled:opacity-30 hover:enabled:opacity-80">
              {step === 2 ? "Zobrazit výsledek" : "Pokračovat"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
