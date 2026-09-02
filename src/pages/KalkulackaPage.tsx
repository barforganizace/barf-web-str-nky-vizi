import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";

const LiverIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
    <path d="M16 25C10 22 6 17 7 12C8 8 12 7 15 9.5C15.5 9.9 16 10.6 16 10.6C16 10.6 16.5 9.9 17 9.5C20 7 24 8 25 12C26 17 22 22 16 25Z" fill="#8B5CF6"/>
    <path d="M16 22C11.5 19.5 8.5 15.5 9.5 11.5C10 9 13 8.5 15.5 10.5L16 11.2L16.5 10.5C19 8.5 22 9 22.5 11.5C23.5 15.5 20.5 19.5 16 22Z" fill="#A78BFA"/>
    <ellipse cx="13" cy="13" rx="2" ry="1.2" fill="#C4B5FD" opacity="0.6" transform="rotate(-20 13 13)"/>
  </svg>
);

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
  { maxMonths: 4,  percent: 9.0 },
  { maxMonths: 6,  percent: 7.0 },
  { maxMonths: 9,  percent: 5.5 },
  { maxMonths: 12, percent: 4.5 },
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

const WEIGHT_RANGE: Record<BreedSize, [number, number]> = {
  small: [1, 10], medium: [10, 25], large: [25, 45], giant: [45, 80],
};

const Steps = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-8 flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
          i < current
            ? "bg-lime text-navy"
            : i === current
            ? "bg-navy text-white"
            : "bg-fg-8 text-fg-5"
        }`}>
          {i < current ? "✓" : i + 1}
        </div>
        {i < total - 1 && <div className={`h-0.5 w-8 rounded-full transition-all ${i < current ? "bg-lime" : "bg-fg-8"}`} />}
      </div>
    ))}
  </div>
);

const Radio = ({ active }: { active: boolean }) => (
  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
    active ? "border-lime bg-lime" : "border-strong"
  }`}>
    {active && <div className="h-2 w-2 rounded-full bg-navy" />}
  </div>
);

export const KalkulackaPage = () => {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [breedSize, setBreedSize] = useState<BreedSize | null>(null);
  const [weight, setWeight]       = useState(15);
  const [ageMonths, setAgeMonths] = useState(36);
  const [activity, setActivity]   = useState<Activity | null>(null);
  const [neutered, setNeutered]   = useState<boolean | null>(null);
  const [condition, setCondition] = useState<Condition>("ideal");

  const SIZES = [
    { key: "small"  as BreedSize, label: t("calc.size_small_label"),  sub: t("calc.size_small_sub"),  example: t("calc.size_small_ex"),  img: "/plemeno-maly-pes.svg",    cardH: 72  },
    { key: "medium" as BreedSize, label: t("calc.size_medium_label"), sub: t("calc.size_medium_sub"), example: t("calc.size_medium_ex"), img: "/plemeno-stredni-pes.svg", cardH: 88  },
    { key: "large"  as BreedSize, label: t("calc.size_large_label"),  sub: t("calc.size_large_sub"),  example: t("calc.size_large_ex"),  img: "/plemeno-velky-pes.svg",   cardH: 104 },
    { key: "giant"  as BreedSize, label: t("calc.size_giant_label"),  sub: t("calc.size_giant_sub"),  example: t("calc.size_giant_ex"),  img: "/plemeno-obri-pes.svg",    cardH: 120 },
  ];

  const ACTIVITIES = [
    { key: "gaucak"    as Activity, label: t("calc.act_gaucak"),    sub: t("calc.act_gaucak_sub"),    emoji: "🛋️" },
    { key: "pohodar"   as Activity, label: t("calc.act_pohodar"),   sub: t("calc.act_pohodar_sub"),   emoji: "🚶" },
    { key: "sportovec" as Activity, label: t("calc.act_sportovec"), sub: t("calc.act_sportovec_sub"), emoji: "🏆" },
  ];

  const CONDITIONS: { key: Condition; label: string; sub: string; adjust: string }[] = [
    { key: "underweight", label: t("calc.cond_under"),  sub: t("calc.cond_under_sub"),  adjust: "+0,5 %" },
    { key: "ideal",       label: t("calc.cond_ideal"),  sub: t("calc.cond_ideal_sub"),  adjust: "±0 %"   },
    { key: "overweight",  label: t("calc.cond_over"),   sub: t("calc.cond_over_sub"),   adjust: "−0,5 %" },
  ];

  const CATS = [
    { key: "muscle",  label: t("calc.cat_muscle"),  pct: 70, icon: "🥩",          color: "#EF4444", light: "#FEF2F2" },
    { key: "rmb",     label: t("calc.cat_rmb"),     pct: 10, icon: "🦴",          color: "#D97706", light: "#FFFBEB" },
    { key: "organs",  label: t("calc.cat_organs"),  pct: 10, icon: <LiverIcon />, color: "#7C3AED", light: "#F5F3FF" },
    { key: "other",   label: t("calc.cat_other"),   pct: 10, icon: "🌿",          color: "#16A34A", light: "#F0FDF4" },
  ];

  const STAGE_LABEL: Record<Stage, string> = {
    puppy:  t("calc.stage_label_puppy"),
    adult:  t("calc.stage_label_adult"),
    senior: t("calc.stage_label_senior"),
  };

  const STAGE_NOTE: Record<Stage, string> = {
    puppy:  t("calc.stage_note_puppy"),
    adult:  t("calc.stage_note_adult"),
    senior: t("calc.stage_note_senior"),
  };

  const fmtAge = (months: number) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    const yearWord = y === 1 ? t("calc.age_year") : y < 5 ? t("calc.age_years_2_4") : t("calc.age_years_5_plus");
    if (y === 0) return `${m} ${t("calc.age_months_abbr")}`;
    if (m === 0) return `${y} ${yearWord}`;
    return `${y} ${yearWord} ${m} ${t("calc.age_months_abbr")}`;
  };

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

  const sliderBg = (pct: number) => ({
    background: `linear-gradient(to right, var(--brand-navy) ${pct}%, var(--fg-8) ${pct}%)`,
  });

  return (
    <div className="min-h-screen bg-app">
      <SharedNav />
      <div className="bg-navy px-6 py-12 text-center">
        <p className="mb-2 text-sm font-bold tracking-[2.5px] text-lime [font-family:'Manrope',Helvetica]">{t("calc.label")}</p>
        <h1 className="[font-family:'Inter',Helvetica] text-[34px] font-normal leading-tight tracking-[-1px] text-white sm:text-[46px]">{t("calc.title")}</h1>
        <p className="mt-3 text-base text-white/60">{t("calc.subtitle")}</p>
      </div>

      <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6">

        {/* Step 0: size */}
        {step === 0 && (
          <div>
            <Steps current={0} total={3} />
            <h2 className="mb-1 text-2xl font-bold tracking-[-0.5px] text-fg-1 [font-family:'Inter',Helvetica]">{t("calc.step_size_title")}</h2>
            <p className="mb-6 text-base text-fg-5">{t("calc.step_size_sub")}</p>
            <div className="flex flex-col gap-3">
              {SIZES.map((s) => {
                const active = breedSize === s.key;
                return (
                  <button key={s.key} onClick={() => { setBreedSize(s.key); setWeight(Math.round((WEIGHT_RANGE[s.key][0] + WEIGHT_RANGE[s.key][1]) / 2)); }}
                    className={`flex items-center overflow-hidden rounded-card border-2 bg-surface text-left shadow-soft transition-all ${active ? "border-lime shadow-lifted" : "border-transparent hover:shadow-lifted"}`}>
                    <div className={`flex shrink-0 items-end justify-center overflow-hidden ${active ? "bg-lime" : "bg-lime-faint"}`} style={{ width: 108, height: s.cardH }}>
                      <img src={s.img} alt={s.label} className="h-full w-full object-contain object-bottom" />
                    </div>
                    <div className="flex-1 px-4 py-3">
                      <p className="text-base font-bold text-fg-1">{s.label}</p>
                      <p className="text-[15px] text-fg-4">{s.sub}</p>
                      <p className="mt-0.5 text-sm text-fg-5">{s.example}</p>
                    </div>
                    <div className="pr-5"><Radio active={active} /></div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: weight + age */}
        {step === 1 && sizeData && (
          <div>
            <Steps current={1} total={3} />
            <h2 className="mb-6 text-2xl font-bold tracking-[-0.5px] text-fg-1 [font-family:'Inter',Helvetica]">{t("calc.step_weight_title")}</h2>
            <div className="flex flex-col gap-5">

              <div className="rounded-panel bg-surface p-7 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-fg-1">{t("calc.weight_label")}</p>
                    <p className="text-sm text-fg-5">{t("calc.weight_note")}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[44px] font-bold leading-none text-fg-1">{weight}</span>
                    <span className="ml-1 text-lg text-fg-5">kg</span>
                  </div>
                </div>
                <input type="range" min={wr0} max={wr1} value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                  className="calc-slider w-full cursor-pointer" style={sliderBg(sliderPct)} />
                <div className="mt-2 flex justify-between text-sm text-fg-5"><span>{wr0} kg</span><span>{wr1} kg</span></div>
              </div>

              <div className="rounded-panel bg-surface p-7 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-fg-1">{t("calc.age_label")}</p>
                    <p className="text-sm text-fg-5">{t("calc.age_note")}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[28px] font-bold leading-none text-fg-1">{fmtAge(ageMonths)}</span>
                  </div>
                </div>
                <input type="range" min={1} max={180} value={ageMonths} onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="calc-slider w-full cursor-pointer" style={sliderBg(agePct)} />
                <div className="mt-2 flex justify-between text-sm text-fg-5">
                  <span>1 {t("calc.age_months_abbr")}</span>
                  <span>15 {t("calc.age_years_5_plus")}</span>
                </div>

                {detectedStage && (
                  <div className="mt-5 flex items-center gap-3 rounded-card bg-lime-faint px-4 py-3">
                    <span className="text-2xl">{STAGE_LABEL[detectedStage].split(" ")[0]}</span>
                    <div>
                      <p className="text-[15px] font-semibold text-lime-ink">{STAGE_LABEL[detectedStage].split(" ").slice(1).join(" ")}</p>
                      <p className="text-sm text-lime-ink/70">{STAGE_NOTE[detectedStage]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: activity + neuter + condition */}
        {step === 2 && (
          <div>
            <Steps current={2} total={3} />
            <h2 className="mb-6 text-2xl font-bold tracking-[-0.5px] text-fg-1 [font-family:'Inter',Helvetica]">{t("calc.step_lifestyle_title")}</h2>

            {detectedStage !== "senior" && detectedStage !== "puppy" && (
              <div className="mb-6">
                <p className="mb-3 text-base font-semibold text-fg-2">{t("calc.activity_label")}</p>
                <div className="flex flex-col gap-2">
                  {ACTIVITIES.map((a) => (
                    <button key={a.key} onClick={() => setActivity(a.key)}
                      className={`flex items-center gap-4 rounded-card border-2 p-4 text-left shadow-soft transition-all ${activity === a.key ? "border-lime bg-lime-faint" : "border-transparent bg-surface hover:shadow-lifted"}`}>
                      <span className="text-2xl">{a.emoji}</span>
                      <div className="flex-1"><p className="text-base font-semibold text-fg-1">{a.label}</p><p className="text-sm text-fg-5">{a.sub}</p></div>
                      <Radio active={activity === a.key} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(detectedStage === "puppy" || detectedStage === "senior") && activity === null && (() => { setActivity("pohodar"); return null; })()}

            <div className="mb-6">
              <p className="mb-3 text-base font-semibold text-fg-2">{t("calc.neuter_label")}</p>
              <div className="grid grid-cols-2 gap-3">
                {[{ val: false, label: t("calc.neutered_no"), emoji: "🐕" }, { val: true, label: t("calc.neutered_yes"), emoji: "✂️" }].map((opt) => (
                  <button key={String(opt.val)} onClick={() => setNeutered(opt.val)}
                    className={`flex items-center gap-3 rounded-card border-2 p-4 text-left shadow-soft transition-all ${neutered === opt.val ? "border-lime bg-lime-faint" : "border-transparent bg-surface hover:shadow-lifted"}`}>
                    <span className="text-2xl">{opt.emoji}</span>
                    <div className="flex-1 text-[15px] font-medium text-fg-1">{opt.label}</div>
                    <Radio active={neutered === opt.val} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-fg-5">{t("calc.neuter_note")}</p>
            </div>

            <div>
              <p className="mb-3 text-base font-semibold text-fg-2">{t("calc.condition_label")} <span className="font-normal text-fg-5">({t("calc.condition_note")})</span></p>
              <div className="flex flex-col gap-2">
                {CONDITIONS.map((c) => (
                  <button key={c.key} onClick={() => setCondition(c.key)}
                    className={`flex items-center gap-4 rounded-card border-2 p-4 text-left shadow-soft transition-all ${condition === c.key ? "border-lime bg-lime-faint" : "border-transparent bg-surface hover:shadow-lifted"}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-fg-1">{c.label}</p>
                        <span className="rounded-full bg-app px-2 py-0.5 text-xs font-mono text-fg-5">{c.adjust}</span>
                      </div>
                      <p className="text-sm text-fg-5">{c.sub}</p>
                    </div>
                    <Radio active={condition === c.key} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 3 && result && sizeData && (
          <div>
            <div className="mb-6 overflow-hidden rounded-panel bg-navy px-7 py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-lime [font-family:'Manrope',Helvetica]">{t("calc.result_label")}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[56px] font-bold leading-none text-white">{result.ration_g}</span>
                    <span className="text-xl text-white/40">{t("calc.per_day")}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{STAGE_LABEL[result.stage]}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{result.percent} {t("calc.percent_weight")}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">≈ {result.kcal} kcal</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{Math.round(result.ration_g / 2)} g {t("calc.result_per_serving")} (2×)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-card border border-white/10 bg-white/5 px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-lime-faint">
                    <img src={sizeData.img} alt={sizeData.label} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-sm text-white/50">
                    <p className="font-semibold text-white">{weight} kg · {fmtAge(ageMonths)}</p>
                    <p>{sizeData.label}</p>
                    <p>{neutered ? t("calc.neutered_abbr") : t("calc.intact_abbr")} · {CONDITIONS.find(c => c.key === condition)?.label}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              {CATS.map((cat) => {
                const keyMap: Record<string, keyof typeof result> = { muscle: "muscle_g", rmb: "rmb_g", organs: "organs_g", kidneys: "kidneys_g", other: "other_g" };
                const g = result[keyMap[cat.key]] as number;
                return (
                  <div key={cat.key} className="overflow-hidden rounded-card border border-hairline bg-surface shadow-soft">
                    <div className="flex items-start gap-4 p-5 pb-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl" style={{ backgroundColor: cat.light }}>
                        {typeof cat.icon === "string" ? cat.icon : cat.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-fg-1">{cat.label}</h3>
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cat.color }}>{cat.pct} %</span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-[26px] font-bold leading-none text-fg-1">{g}</span>
                          <span className="text-sm text-fg-5">{t("calc.per_day")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-fg-8">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-5 overflow-hidden rounded-panel bg-surface shadow-soft">
              <div className="border-b border-hairline px-7 py-4">
                <h3 className="text-base font-semibold text-fg-1">{t("calc.weekly_title")}</h3>
              </div>
              <table className="w-full text-[15px]">
                <thead className="bg-app-2 text-left">
                  <tr>
                    <th className="px-7 py-3 text-sm font-semibold text-fg-5">{t("calc.col_part")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-fg-5">{t("calc.col_day")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-fg-5">{t("calc.col_week")}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-fg-5">{t("calc.col_month")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
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
                      <tr key={label} className="hover:bg-app-2">
                        <td className={`px-7 py-3 font-medium text-fg-2 ${indent ? "pl-12" : ""}`}>
                          <div className="flex items-center gap-2">
                            {color && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />}
                            {label}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-fg-4">{grams} g</td>
                        <td className="px-4 py-3 text-fg-4">{(grams * 7 / 1000).toFixed(2)} kg</td>
                        <td className="px-4 py-3 text-fg-4">{(grams * 30 / 1000).toFixed(1)} kg</td>
                      </tr>
                    );

                    return [
                      renderRow(t("calc.cat_muscle"),                    muscle_g,  "#EF4444"),
                      renderRow(t("calc.cat_rmb"),                       rmb_g,     "#D97706"),
                      renderRow(t("calc.cat_organs"),                    organs_g,  "#7C3AED"),
                      renderRow(`  – ${t("calc.cat_kidneys")}`,          kidneys_g, "#A855F7", true),
                      renderRow(t("calc.cat_other"),                     other_g,   "#16A34A"),
                      renderRow(`  – ${t("calc.cat_veggie")}`,           veg_g,     undefined, true),
                      renderRow(`  – ${t("calc.cat_nuts")}`,             nuts_g,    undefined, true),
                      renderRow(`  – ${t("calc.cat_fruit")}`,            fruit_g,   undefined, true),
                    ];
                  })()}
                  <tr className="bg-app-2 font-semibold">
                    <td className="px-7 py-3 text-fg-1">{t("calc.total")}</td>
                    <td className="px-4 py-3 text-fg-1">{result.ration_g} g</td>
                    <td className="px-4 py-3 text-fg-1">{(result.ration_g * 7 / 1000).toFixed(2)} kg</td>
                    <td className="px-4 py-3 text-fg-1">{(result.ration_g * 30 / 1000).toFixed(1)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-5 overflow-hidden rounded-panel bg-surface shadow-soft">
              <div className="border-b border-hairline px-7 py-4">
                <h3 className="text-base font-semibold text-fg-1">{t("calc.micro_title")} <span className="text-sm font-normal text-fg-5">({t("calc.micro_note")})</span></h3>
              </div>
              <div className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
                {[
                  { label: t("calc.micro_calcium"),    value: `${result.calcium_mg} mg` },
                  { label: t("calc.micro_phosphorus"), value: `${result.phosphorus_mg} mg` },
                  { label: t("calc.micro_magnesium"),  value: `${result.magnesium_mg} mg` },
                  { label: t("calc.micro_iron"),       value: `${result.iron_mg} mg` },
                  { label: t("calc.micro_zinc"),       value: `${result.zinc_mg} mg` },
                  { label: t("calc.micro_vita"),       value: `${result.vitamin_a_ug} μg` },
                  { label: t("calc.micro_vitd"),       value: `${result.vitamin_d_ug} μg` },
                  { label: t("calc.micro_kcal"),       value: `${result.kcal} kcal` },
                ].map((m) => (
                  <div key={m.label} className="flex flex-col items-start bg-surface px-5 py-4">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-fg-5">{m.label}</span>
                    <span className="mt-1 text-xl font-bold text-fg-1">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded-card border border-amber-200 bg-amber-50 px-6 py-4 text-[15px] text-amber-800">
              <strong>{t("calc.warning")}:</strong> {t("calc.disclaimer")}
            </div>

            <button onClick={reset} className="w-full rounded-card border border-strong bg-surface py-4 text-base font-semibold text-fg-4 transition hover:border-fg-5 hover:text-fg-1">
              {t("calc.recalculate")}
            </button>
          </div>
        )}

        {step < 3 && (
          <div className="mt-8 flex items-center justify-between">
            {step > 0
              ? <button onClick={back} className="flex items-center gap-2 rounded-full border border-strong bg-surface px-6 py-3 text-[15px] font-medium text-fg-4 transition hover:border-fg-5 hover:text-fg-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  {t("calc.back")}
                </button>
              : <div />
            }
            <button onClick={next} disabled={!canNext}
              className="flex items-center gap-2 rounded-full bg-navy px-8 py-3.5 text-base font-bold text-white transition disabled:opacity-30 hover:enabled:opacity-85">
              {step === 2 ? t("calc.show_result") : t("calc.next")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
