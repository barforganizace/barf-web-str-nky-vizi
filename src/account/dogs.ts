import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Pes majitele — stejná tabulka `dogs` jako v appce (barfing.net). Denní dávku
// počítá databáze: u uloženého psa počítaný sloupec `daily_targets`, u psa
// v průvodci funkce `calc_daily_targets`. Web si nic nepočítá sám, aby se
// nerozešel s appkou.

export type BreedSize = "small" | "medium" | "large" | "giant";
export type Activity = "gaucak" | "pohodar" | "sportovec";
export type BodyCondition = "underweight" | "ideal" | "overweight" | "obese";
export type HealthCondition = "kidney" | "pancreatitis" | "liver" | "allergy" | "joints" | "obesity_managed";
export type UnitSystem = "metric" | "imperial";

export const BREED_SIZES: BreedSize[] = ["small", "medium", "large", "giant"];
export const ACTIVITIES: Activity[] = ["gaucak", "pohodar", "sportovec"];
export const BODY_CONDITIONS: BodyCondition[] = ["underweight", "ideal", "overweight", "obese"];
export const HEALTH_CONDITIONS: HealthCondition[] = ["kidney", "pancreatitis", "liver", "allergy", "joints", "obesity_managed"];

export const BREED_SIZE_IMAGE: Record<BreedSize, string> = {
  small: "/plemeno-maly-pes.svg",
  medium: "/plemeno-stredni-pes.svg",
  large: "/plemeno-velky-pes.svg",
  giant: "/plemeno-obri-pes.svg",
};

/** Výchozí složení misky 50/25/15/10 — klíč překladu, procento, barva, pole s gramy v odpovědi databáze. */
export const BOWL_PARTS: { key: string; percent: number; color: string; grams: keyof RationTargets }[] = [
  { key: "muscle", percent: 50, color: "#d9534f", grams: "muscle_g" },
  { key: "bones", percent: 25, color: "#e8b923", grams: "bone_g" },
  { key: "organs", percent: 15, color: "#8e5bb5", grams: "organ_g" },
  { key: "other", percent: 10, color: "#5cb85c", grams: "other_g" },
];

export interface RationTargets {
  ration_g: number;
  percent: number;
  muscle_g: number;
  bone_g: number;
  organ_g: number;
  liver_g: number;
  other_g: number;
  kcal: number;
  life_stage: "puppy" | "adult" | "senior";
  feeding_weight_kg: number;
}

/** Počítaný sloupec daily_targets PostgREST do select("*") nedá — musí se vyjmenovat. */
export const DOG_SELECT = "*, daily_targets";

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  breed_size: BreedSize;
  weight_kg: number;
  birth_date: string | null;
  activity_level: Activity;
  is_neutered: boolean;
  avatar_url: string | null;
  body_condition: BodyCondition;
  target_weight_kg: number | null;
  health_conditions: HealthCondition[];
  daily_targets: RationTargets;
}

// ---------- jednotky a datum ----------

const KG_TO_LBS = 2.20462;
const DAYS_PER_MONTH = 30.44;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const parseWeightToKg = (value: number, system: UnitSystem) => (system === "imperial" ? value / KG_TO_LBS : value);
export const weightLabel = (system: UnitSystem) => (system === "imperial" ? "lbs" : "kg");

export function formatWeight(kg: number, system: UnitSystem): string {
  const v = system === "imperial" ? kg * KG_TO_LBS : kg;
  return `${v % 1 === 0 ? v : v.toFixed(1)} ${weightLabel(system)}`;
}

/** Datum narození "YYYY-MM-DD" pro psa starého ageMonths, null když je věk 0. */
export function birthDateFromAgeMonths(ageMonths: number): string | null {
  if (ageMonths <= 0) return null;
  const d = new Date(Date.now() - ageMonths * DAYS_PER_MONTH * MS_PER_DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ageMonthsFromBirthDate(birthDate: string | null): number {
  if (!birthDate) return 0;
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (DAYS_PER_MONTH * MS_PER_DAY));
}

// ---------- denní dávka pro psa, který ještě není uložený ----------

export interface RationQuery {
  weightKg: number;
  ageMonths: number;
  activity: Activity;
  neutered: boolean;
  breedSize: BreedSize;
  bodyCondition: BodyCondition;
  targetWeightKg: number | null;
}

export function useRationTargets(query: RationQuery): RationTargets | null {
  const [targets, setTargets] = useState<RationTargets | null>(null);
  const key = JSON.stringify(query);

  useEffect(() => {
    const q: RationQuery = JSON.parse(key);
    let cancelled = false;
    supabase.rpc("calc_daily_targets", {
      p_weight_kg: q.weightKg,
      p_age_months: q.ageMonths,
      p_activity: q.activity,
      p_neutered: q.neutered,
      p_breed_size: q.breedSize,
      p_ratios: null,
      p_manual_percent: null,
      p_body_condition: q.bodyCondition,
      p_target_weight_kg: q.targetWeightKg,
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) console.error("[db] calc_daily_targets:", error.message);
      else if (data) setTargets(data as RationTargets);
    });
    return () => { cancelled = true; };
  }, [key]);

  return targets;
}

// ---------- uložení psa ----------

export interface NewDog {
  name: string;
  breed: string;
  breedSize: BreedSize;
  weightKg: number;
  ageMonths: number;
  activity: Activity;
  isNeutered: boolean;
  bodyCondition: BodyCondition;
  targetWeightKg: number | null;
  healthConditions: HealthCondition[];
  avatarFile: File | null;
  unitSystem: UnitSystem;
}

/** Zmenší fotku na 400 px a uloží do bucketu dog-avatars, stejně jako appka. */
async function uploadAvatar(userId: string, dogId: string, file: File): Promise<string> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(400 / img.width, 400 / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("compress"))), "image/jpeg", 0.8);
    };
    img.onerror = () => reject(new Error("load"));
    img.src = URL.createObjectURL(file);
  });
  const path = `${userId}/${dogId}.jpg`;
  const { error } = await supabase.storage.from("dog-avatars").upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  return `${supabase.storage.from("dog-avatars").getPublicUrl(path).data.publicUrl}?t=${Date.now()}`;
}

/** Založí psa, první bod váhové křivky a fotku. Chybu vyhodí jen u samotného psa,
 *  váha a fotka jsou doplňkové a jen se zalogují. */
export async function saveDog(userId: string, d: NewDog): Promise<void> {
  const weightKg = Math.round(d.weightKg * 100) / 100;
  const { data: dog, error } = await supabase
    .from("dogs")
    .insert({
      user_id: userId,
      name: d.name.trim(),
      breed: d.breed.trim(),
      breed_size: d.breedSize,
      weight_kg: weightKg,
      birth_date: birthDateFromAgeMonths(d.ageMonths),
      activity_level: d.activity,
      is_neutered: d.isNeutered,
      body_condition: d.bodyCondition,
      target_weight_kg: d.targetWeightKg,
      health_conditions: d.healthConditions,
    })
    .select("id")
    .single();
  if (error) throw error;

  const { error: prefError } = await supabase
    .from("user_preferences")
    .upsert({ user_id: userId, unit_system: d.unitSystem, updated_at: new Date().toISOString() });
  if (prefError) console.error("[db] user_preferences.upsert:", prefError.message);

  const { error: weightError } = await supabase
    .from("weight_entries")
    .insert({ user_id: userId, dog_id: dog.id, weight_kg: weightKg, body_condition: d.bodyCondition });
  if (weightError) console.error("[db] weight_entries.insert:", weightError.message);

  if (d.avatarFile) {
    try {
      const avatarUrl = await uploadAvatar(userId, dog.id, d.avatarFile);
      const { error: avatarError } = await supabase.from("dogs").update({ avatar_url: avatarUrl }).eq("id", dog.id);
      if (avatarError) console.error("[db] dogs.update(avatar_url):", avatarError.message);
    } catch (e) {
      console.error("[storage] dog-avatars:", e);
    }
  }
}
