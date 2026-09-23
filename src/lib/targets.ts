import type { RationTargets } from "../account/dogs";

// Denní cíle živin podle NRC 2006 (Recommended Allowance na 1000 kcal ME).
// Tabulky jsou zkopírované z appky (barf-dog-nutrition-main: src/lib/barf.ts,
// ADULT_ALLOWANCES / PUPPY_ALLOWANCES), aby web ukazoval stejné cíle jako
// appka. Dávka, kcal, krmná váha a životní etapa přicházejí z databáze
// (daily_targets psa), tady se jen násobí tabulkou.
//
// Klíče odpovídají sloupcům tabulky foods, aby šly cíle rovnou porovnat se
// součtem misky: protein_pct = gramy bílkovin v porci, calcium_mg = mg vápníku…

type Stage = RationTargets["life_stage"];

const ADULT: Record<string, number> = {
  calcium_mg: 1000, phosphorus_mg: 750, magnesium_mg: 150, potassium_mg: 1000, sodium_mg: 200, chloride_mg: 300,
  iron_mg: 7.5, zinc_mg: 15, copper_mg: 1.5, manganese_mg: 1.2, selenium_ug: 87.5, iodine_ug: 220,
  vitamin_a_ug: 379, vitamin_d_ug: 3.4, vitamin_e_mg: 7.5,
  vitamin_b1_mg: 0.56, vitamin_b2_mg: 1.3, vitamin_b3_mg: 4.25, vitamin_b6_mg: 0.375, vitamin_b9_ug: 67.5, vitamin_b12_ug: 8.75,
  omega3_epa_dha_mg: 110, omega6_la_mg: 2800,
};

// Růst („štěňata od 14 týdnů“ v NRC tabulce).
const PUPPY: Record<string, number> = {
  calcium_mg: 3000, phosphorus_mg: 2500, magnesium_mg: 100, potassium_mg: 1100, sodium_mg: 550, chloride_mg: 720,
  iron_mg: 22, zinc_mg: 25, copper_mg: 2.7, manganese_mg: 1.4, selenium_ug: 87.5, iodine_ug: 220,
  vitamin_a_ug: 379, vitamin_d_ug: 3.4, vitamin_e_mg: 7.5,
  vitamin_b1_mg: 0.34, vitamin_b2_mg: 1.32, vitamin_b3_mg: 4.25, vitamin_b6_mg: 0.375, vitamin_b9_ug: 68, vitamin_b12_ug: 8.75,
  omega3_epa_dha_mg: 130, omega6_la_mg: 3300,
};

const PROTEIN_G_PER_1000KCAL: Record<Stage, number> = { puppy: 43.8, adult: 25, senior: 25 };
const FAT_G_PER_1000KCAL: Record<Stage, number> = { puppy: 21.3, adult: 13.8, senior: 13.8 };
// Sacharidy nejsou požadavek NRC, jen doporučení nutricionistů (10–20 % kalorií).
const CARBS_PCT_OF_KCAL = 0.15;
// NRC tabulky stojí na referenčním psu s ~130 kcal na kg^0,75; pod tuhle hranici
// se energetický základ nepouští, jinak by málo žravý pes měl cíle pod NRC.
const NRC_REFERENCE_KCAL_PER_METABOLIC_KG = 130;

/** Tisíce kcal, na které NRC tabulky přepočítávají — základ obou tabulek níž. */
const energyBasis = (r: RationTargets): number =>
  Math.max(r.kcal, NRC_REFERENCE_KCAL_PER_METABOLIC_KG * Math.pow(r.feeding_weight_kg, 0.75)) / 1000;

/** Denní cíle psa podle jeho dávky z databáze; klíče = sloupce tabulky foods + kcal a ration_g. */
export function dailyTargets(r: RationTargets): Record<string, number> {
  const basis = energyBasis(r);
  const table = r.life_stage === "puppy" ? PUPPY : ADULT;
  const out: Record<string, number> = {
    kcal: r.kcal,
    ration_g: r.ration_g,
    protein_pct: Math.round(basis * PROTEIN_G_PER_1000KCAL[r.life_stage]),
    fat_pct: Math.round(basis * FAT_G_PER_1000KCAL[r.life_stage]),
    carbs_pct: Math.round((r.kcal * CARBS_PCT_OF_KCAL) / 4),
  };
  for (const [key, ra] of Object.entries(table)) out[key] = ra * basis;
  return out;
}

// Bezpečné horní limity (NRC Safe Upper Limit na 1000 kcal), zkopírované z appky
// (nutrients.ts, pole `sul` a FAT_SUL_G_PER_1000KCAL). Většina živin žádný limit nemá:
// chybějící klíč znamená „NRC strop nestanovuje“, ne „neomezeně“. Bílkoviny mezi nimi
// schválně nejsou — cíl je u nich minimum, které syrová dávka běžně několikrát přesáhne.
const ADULT_LIMITS: Record<string, number> = {
  fat_pct: 82.5,
  vitamin_a_ug: 16000, vitamin_d_ug: 20,
  omega3_epa_dha_mg: 2800, omega6_la_mg: 16300,
};

const PUPPY_LIMITS: Record<string, number> = {
  fat_pct: 330, calcium_mg: 18000,
  vitamin_a_ug: 3750, vitamin_d_ug: 20,
  omega3_epa_dha_mg: 11000, omega6_la_mg: 65000,
};

/** Horní hranice pro tentýž den. Kalorie jsou jediný cíl, který je zároveň strop. */
export function dailyLimits(r: RationTargets): Record<string, number> {
  const basis = energyBasis(r);
  const table = r.life_stage === "puppy" ? PUPPY_LIMITS : ADULT_LIMITS;
  const out: Record<string, number> = { kcal: r.kcal };
  for (const [key, sul] of Object.entries(table)) out[key] = sul * basis;
  return out;
}
