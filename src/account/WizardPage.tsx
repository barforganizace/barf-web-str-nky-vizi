import { useRef, useState, type ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";
import { useSession } from "../lib/session";
import { Button, ErrorText, Spinner, inputClass } from "../editor/ui";
import {
  ACTIVITIES, BODY_CONDITIONS, BOWL_PARTS, BREED_SIZES, BREED_SIZE_IMAGE, HEALTH_CONDITIONS,
  parseWeightToKg, saveDog, useRationTargets, weightLabel,
  type Activity, type BodyCondition, type BreedSize, type HealthCondition, type UnitSystem,
} from "./dogs";

// Průvodce profilem psa — stejné 4 kroky a stejný zápis do databáze jako v appce.

interface Form {
  name: string;
  breed: string;
  breedSize: BreedSize;
  ageYears: string;
  ageMonths: string;
  weight: string;
  unitSystem: UnitSystem;
  activity: Activity;
  isNeutered: boolean;
  bodyCondition: BodyCondition;
  /** Prázdné = ideální váhu odvodí databáze z kondice. */
  targetWeight: string;
  healthConditions: HealthCondition[];
  avatarFile: File | null;
  avatarPreview: string | null;
}

type StepProps = { form: Form; patch: (p: Partial<Form>) => void };

const ageMonthsOf = (f: Form) => parseInt(f.ageYears || "0") * 12 + parseInt(f.ageMonths || "0");

/** Cílová váha má smysl jen u psa mimo kondici — souhrn i uložení musí použít stejné pravidlo. */
function targetWeightKg(f: Form): number | null {
  if (f.bodyCondition === "ideal" || !(parseFloat(f.targetWeight) > 0)) return null;
  return Math.round(parseWeightToKg(parseFloat(f.targetWeight), f.unitSystem) * 100) / 100;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-5">{label}</p>
      {children}
    </div>
  );
}

function SelectCard({ selected, onClick, title, desc, img }: { selected: boolean; onClick: () => void; title: string; desc?: string; img?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-card border-2 px-4 py-3 text-left transition ${
        selected ? "border-lime bg-lime-faint" : "border-hairline bg-surface hover:border-strong"
      }`}
    >
      {img && <img src={img} alt="" className="h-10 w-10 shrink-0" />}
      <span className="flex-1">
        <span className="block text-sm font-bold text-fg-1">{title}</span>
        {desc && <span className="block text-xs text-fg-5">{desc}</span>}
      </span>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-fg-1 bg-fg-1" : "border-strong"}`}>
        {selected && <span className="h-2 w-2 rounded-full bg-surface" />}
      </span>
    </button>
  );
}

function WeightInput({ id, value, placeholder, unitSystem, onChange }: { id: string; value: string; placeholder?: string; unitSystem: UnitSystem; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input id={id} className={`${inputClass} pr-14`} type="number" step="0.1" min="0" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-fg-5">{weightLabel(unitSystem)}</span>
    </div>
  );
}

function Step1({ form, patch }: StepProps) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-surface shadow-soft transition hover:ring-2 hover:ring-lime"
          aria-label={t("wizard.photo")}
        >
          {form.avatarPreview
            ? <img src={form.avatarPreview} alt="" className="h-full w-full object-cover" />
            : <span className="text-xs font-bold text-fg-5">{t("wizard.photo")}</span>}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) patch({ avatarFile: file, avatarPreview: URL.createObjectURL(file) });
          }}
        />
      </div>
      <Section label={t("wizard.dog_name")}>
        <input className={inputClass} value={form.name} placeholder={t("wizard.dog_name_placeholder")} onChange={(e) => patch({ name: e.target.value })} autoFocus />
      </Section>
      <Section label={t("wizard.breed")}>
        <input className={inputClass} value={form.breed} placeholder={t("wizard.breed_placeholder")} onChange={(e) => patch({ breed: e.target.value })} />
      </Section>
      <Section label={t("wizard.breed_size")}>
        <div className="space-y-2">
          {BREED_SIZES.map((size) => (
            <SelectCard
              key={size}
              selected={form.breedSize === size}
              onClick={() => patch({ breedSize: size })}
              title={t(`wizard.breed_${size}`)}
              desc={t(`wizard.breed_${size}_desc`)}
              img={BREED_SIZE_IMAGE[size]}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Step2({ form, patch }: StepProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <Section label={t("wizard.age")}>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs text-fg-6">{t("wizard.years")}</span>
            <input className={inputClass} type="number" min="0" max="25" value={form.ageYears} placeholder="0" onChange={(e) => patch({ ageYears: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-fg-6">{t("wizard.months")}</span>
            <input className={inputClass} type="number" min="0" max="11" value={form.ageMonths} placeholder="0" onChange={(e) => patch({ ageMonths: e.target.value })} />
          </label>
        </div>
      </Section>
      <Section label={t("wizard.weight")}>
        <WeightInput id="weight" value={form.weight} placeholder="0.0" unitSystem={form.unitSystem} onChange={(v) => patch({ weight: v })} />
        <p className="mt-1 text-xs text-fg-6">{t("wizard.weight_hint")}</p>
      </Section>
      <Section label={t("wizard.body_condition")}>
        <div className="space-y-2">
          {BODY_CONDITIONS.map((bc) => (
            <SelectCard
              key={bc}
              selected={form.bodyCondition === bc}
              onClick={() => patch({ bodyCondition: bc })}
              title={t(`wizard.body_${bc}`)}
              desc={t(`wizard.body_${bc}_desc`)}
            />
          ))}
        </div>
        {form.bodyCondition !== "ideal" && (
          <div className="mt-3">
            <span className="mb-1 block text-xs text-fg-6">{t("wizard.target_weight")}</span>
            <WeightInput id="target-weight" value={form.targetWeight} placeholder={t("wizard.target_weight_placeholder")} unitSystem={form.unitSystem} onChange={(v) => patch({ targetWeight: v })} />
            <p className="mt-1 text-xs text-fg-6">{t("wizard.target_weight_hint")}</p>
          </div>
        )}
      </Section>
      <Section label={t("wizard.units")}>
        <div className="grid grid-cols-2 gap-3">
          {(["metric", "imperial"] as const).map((u) => (
            <SelectCard key={u} selected={form.unitSystem === u} onClick={() => patch({ unitSystem: u })} title={t(`wizard.unit_${u}`)} desc={u === "metric" ? "kg / g" : "lbs / oz"} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Step3({ form, patch }: StepProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <Section label={t("wizard.activity_level")}>
        <div className="space-y-2">
          {ACTIVITIES.map((a) => (
            <SelectCard key={a} selected={form.activity === a} onClick={() => patch({ activity: a })} title={t(`wizard.activity_${a}`)} desc={t(`wizard.activity_${a}_desc`)} />
          ))}
        </div>
      </Section>
      <Section label={t("wizard.castration")}>
        <label className="flex items-center justify-between rounded-card border-2 border-hairline bg-surface px-4 py-3">
          <span className="text-sm font-bold text-fg-1">{t("wizard.castration_question")}</span>
          <input type="checkbox" className="h-5 w-5 accent-[#191c1d]" checked={form.isNeutered} onChange={(e) => patch({ isNeutered: e.target.checked })} />
        </label>
      </Section>
      <Section label={t("wizard.health")}>
        <p className="mb-3 text-xs text-fg-6">{t("wizard.health_hint")}</p>
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map((h) => {
            const on = form.healthConditions.includes(h);
            return (
              <button
                key={h}
                type="button"
                onClick={() => patch({ healthConditions: on ? form.healthConditions.filter((x) => x !== h) : [...form.healthConditions, h] })}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${on ? "bg-amber-400 text-[#191c1d]" : "bg-surface text-fg-3 shadow-soft hover:bg-app"}`}
              >
                {t(`wizard.health_${h}`)}
              </button>
            );
          })}
        </div>
        {form.healthConditions.length > 0 && (
          <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">{t("wizard.health_vet_note")}</p>
        )}
      </Section>
    </div>
  );
}

function Step4({ form }: { form: Form }) {
  const { t } = useTranslation();
  const currentWeightKg = parseWeightToKg(parseFloat(form.weight) || 0, form.unitSystem);
  // Dávku počítá stejná databázová funkce, kterou pro uloženého psa používá
  // počítaný sloupec daily_targets — souhrn ukáže to, co pak ukáže appka.
  const targets = useRationTargets({
    weightKg: currentWeightKg,
    ageMonths: ageMonthsOf(form),
    activity: form.activity,
    neutered: form.isNeutered,
    breedSize: form.breedSize,
    bodyCondition: form.bodyCondition,
    targetWeightKg: targetWeightKg(form),
  });
  const feedingToTarget = targets != null && Math.abs(targets.feeding_weight_kg - currentWeightKg) > 0.01;

  return (
    <div className="space-y-6">
      <div className="rounded-panel border border-hairline bg-surface p-6 text-center shadow-soft">
        <p className="text-sm text-fg-5">
          {t("wizard.daily_dose")}
          {targets && <span className="ml-2 rounded-full bg-app px-2.5 py-0.5 text-xs font-bold text-fg-4">{t(`wizard.stage_${targets.life_stage}`)}</span>}
        </p>
        <p className="mt-1 text-[52px] font-extrabold leading-tight text-fg-1">
          {targets ? targets.ration_g : "—"} <span className="text-[28px]">g</span>
        </p>
        {feedingToTarget && (
          <p className="text-xs text-fg-5">
            {t("wizard.feeding_to_target", { weight: targets.feeding_weight_kg.toFixed(1), unit: weightLabel("metric") })}
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 divide-x divide-hairline text-sm">
          <div>
            <p className="text-xs text-fg-5">{t("wizard.energy")}</p>
            <p className="font-bold text-fg-1">{targets ? targets.kcal : "—"} kcal</p>
          </div>
          <div>
            <p className="text-xs text-fg-5">{t("wizard.weight_share")}</p>
            <p className="font-bold text-fg-1">{targets && currentWeightKg > 0 ? targets.percent.toFixed(1) : "—"} %</p>
          </div>
        </div>
      </div>

      <Section label={t("wizard.bowl")}>
        <ul className="divide-y divide-hairline rounded-panel border border-hairline bg-surface px-5 shadow-soft">
          {BOWL_PARTS.map((part) => (
            <li key={part.key} className="flex items-center justify-between py-3 text-sm">
              <span className="inline-flex items-center gap-2 text-fg-3">
                <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: part.color }} />
                {t(`wizard.bowl_${part.key}`)} ({part.percent} %)
              </span>
              <span className="font-bold tabular-nums text-fg-1">{targets ? targets[part.grams] : "—"} g</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function WizardPage() {
  const { t } = useTranslation();
  const { user, loading, refetchDogs } = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Form>({
    name: "", breed: "", breedSize: "medium", ageYears: "", ageMonths: "", weight: "", unitSystem: "metric",
    activity: "pohodar", isNeutered: false, bodyCondition: "ideal", targetWeight: "", healthConditions: [],
    avatarFile: null, avatarPreview: null,
  });
  const patch = (p: Partial<Form>) => setForm((prev) => ({ ...prev, ...p }));

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/ucet" replace />;

  const canAdvance = step === 1 ? form.name.trim().length > 0 : step === 2 ? parseFloat(form.weight) > 0 : true;

  async function next() {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveDog(user!.id, {
        name: form.name,
        breed: form.breed,
        breedSize: form.breedSize,
        weightKg: parseWeightToKg(parseFloat(form.weight), form.unitSystem),
        ageMonths: ageMonthsOf(form),
        activity: form.activity,
        isNeutered: form.isNeutered,
        bodyCondition: form.bodyCondition,
        targetWeightKg: targetWeightKg(form),
        healthConditions: form.healthConditions,
        avatarFile: form.avatarFile,
        unitSystem: form.unitSystem,
      });
      await refetchDogs();
      navigate("/ucet");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("wizard.save_error"));
      setSaving(false);
    }
  }

  const titles = [t("wizard.step1_title"), t("wizard.step2_title"), t("wizard.step3_title"), t("wizard.step4_title")];

  return (
    <div className="flex min-h-screen flex-col bg-app-2">
      <SharedNav />
      <main className="mx-auto w-full max-w-[560px] flex-1 px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <p className="text-xs text-fg-5">{t("wizard.step", { current: step, total: 4 })}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-16 bg-fg-1" : i < step ? "w-8 bg-fg-1" : "w-8 bg-strong"}`} />
            ))}
          </div>
          <h1 className="mt-2 text-center text-[28px] font-extrabold text-fg-1">{titles[step - 1]}</h1>
        </div>

        {step === 1 && <Step1 form={form} patch={patch} />}
        {step === 2 && <Step2 form={form} patch={patch} />}
        {step === 3 && <Step3 form={form} patch={patch} />}
        {step === 4 && <Step4 form={form} />}

        <div className="mt-8 space-y-3">
          <ErrorText>{error}</ErrorText>
          <Button variant="lime" className="w-full" onClick={next} disabled={!canAdvance || saving}>
            {step === 4 ? (saving ? t("wizard.saving") : t("wizard.save")) : t("wizard.continue")}
          </Button>
          {step > 1 && (
            <Button variant="secondary" className="w-full" onClick={() => setStep(step - 1)} disabled={saving}>
              {t("wizard.back")}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
