/* =====================================================================
 * BARF kalkulačka — referenční výpočetní jádro
 * ---------------------------------------------------------------------
 * Čistý JavaScript, bez závislostí. Funguje v prohlížeči i v Node.
 * Všechny hodnoty odpovídají souboru barf-data.json a živému kódu appky.
 *
 * Hmotnosti: kg | dávky: g | věk: měsíce
 *
 * Použití (rychlý příklad je úplně dole):
 *   const vysledek = calcDailyTargets({
 *     weightKg: 20, ageMonths: 36, activity: 'pohodar',
 *     neutered: false, breedSize: 'medium', bodyCondition: 'ideal',
 *   });
 * ===================================================================== */

/* ---------------------------------------------------------------------
 * 1) DATA (tabulky a konstanty)
 * ------------------------------------------------------------------- */

// Hranice životních fází podle velikosti plemene (v měsících).
const BREED_STAGE_THRESHOLDS = {
  small:  { puppyEnd: 10, seniorStart: 96 },
  medium: { puppyEnd: 12, seniorStart: 84 },
  large:  { puppyEnd: 15, seniorStart: 72 },
  giant:  { puppyEnd: 24, seniorStart: 60 },
};

// Procento z hmotnosti pro dospělé psy: [velikost][aktivita] -> {neutral, neutered}.
// neutral = nekastrovaný, neutered = kastrovaný.
const ADULT_RATES = {
  small: {
    gaucak:    { neutral: 2.5, neutered: 2.2 },
    pohodar:   { neutral: 3.0, neutered: 2.7 },
    sportovec: { neutral: 3.5, neutered: 3.2 },
  },
  medium: {
    gaucak:    { neutral: 2.0, neutered: 1.8 },
    pohodar:   { neutral: 2.5, neutered: 2.2 },
    sportovec: { neutral: 3.0, neutered: 2.7 },
  },
  large: {
    gaucak:    { neutral: 1.8, neutered: 1.6 },
    pohodar:   { neutral: 2.2, neutered: 2.0 },
    sportovec: { neutral: 2.7, neutered: 2.4 },
  },
  giant: {
    gaucak:    { neutral: 1.5, neutered: 1.3 },
    pohodar:   { neutral: 1.8, neutered: 1.6 },
    sportovec: { neutral: 2.2, neutered: 2.0 },
  },
};

// Štěně: procento z AKTUÁLNÍ hmotnosti, klesá s věkem.
// Bereme první rozsah, kde ageMonths <= maxMonths.
const PUPPY_RATES = [
  { maxMonths: 4,  percent: 9.0 },
  { maxMonths: 6,  percent: 7.0 },
  { maxMonths: 9,  percent: 5.5 },
  { maxMonths: 12, percent: 4.5 },
];

// Korekce procenta podle kondice (přičítá se).
const BODY_CONDITION_ADJUST = {
  underweight:  0.5,
  ideal:        0.0,
  overweight:  -0.5,
};

// Výchozí poměr složek misky (součet = 100). Lze přepsat parametrem `ratios`.
const DEFAULT_RATIOS = {
  muscle_pct: 50,
  bones_pct:  25,
  organs_pct: 15,
  other_pct:  10,
};

// FEDIAF minima mikroživin na KG hmotnosti za den. Štěně má vyšší hodnoty napřímo.
const MICRO_PER_KG = {
  puppy:  { calcium_mg: 320, phosphorus_mg: 250, magnesium_mg: 14,   iron_mg: 2.2,  zinc_mg: 2.25, vitamin_a_ug: 75,   vitamin_d_ug: 1.4 },
  adult:  { calcium_mg: 120, phosphorus_mg: 100, magnesium_mg: 8.75, iron_mg: 1.25, zinc_mg: 1.5,  vitamin_a_ug: 37.5, vitamin_d_ug: 0.688 },
  senior: { calcium_mg: 120, phosphorus_mg: 100, magnesium_mg: 8.75, iron_mg: 1.25, zinc_mg: 1.5,  vitamin_a_ug: 37.5, vitamin_d_ug: 0.688 },
};

const KCAL_PER_GRAM = 1.6; // zjednodušený přepočet kalorií

/* ---------------------------------------------------------------------
 * 2) POMOCNÉ FUNKCE
 * ------------------------------------------------------------------- */

const DAYS_PER_MONTH = 30.44;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Věk v celých měsících z data narození ("YYYY-MM-DD"). Prázdné -> 0. */
function ageMonthsFromBirthDate(birthDate) {
  if (!birthDate) return 0;
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (DAYS_PER_MONTH * MS_PER_DAY));
}

/** Životní fáze z věku a velikosti plemene. */
function getLifeStage(ageMonths, breedSize) {
  const { puppyEnd, seniorStart } = BREED_STAGE_THRESHOLDS[breedSize];
  if (ageMonths < puppyEnd) return 'puppy';
  if (ageMonths >= seniorStart) return 'senior';
  return 'adult';
}

/* ---------------------------------------------------------------------
 * 3) JÁDRO VÝPOČTU
 * ------------------------------------------------------------------- */

/**
 * Spočítá denní dávku v gramech a použité procento.
 * @returns {{ grams: number, percent: number, stage: string }}
 */
function calcRation({ weightKg, ageMonths, activity, neutered, bodyCondition, breedSize }) {
  const stage = getLifeStage(ageMonths, breedSize);
  let percent;

  if (stage === 'puppy') {
    // Najdi první věkový rozsah, do kterého se štěně vejde (fallback = poslední).
    const bracket = PUPPY_RATES.find((r) => ageMonths <= r.maxMonths) || PUPPY_RATES[PUPPY_RATES.length - 1];
    percent = bracket.percent;
  } else if (stage === 'senior') {
    // Senior = sazba "gaucak" pro danou velikost (aktivita se ignoruje).
    const rates = ADULT_RATES[breedSize].gaucak;
    percent = neutered ? rates.neutered : rates.neutral;
  } else {
    const rates = ADULT_RATES[breedSize][activity];
    percent = neutered ? rates.neutered : rates.neutral;
  }

  // Korekce kondice (neznámá hodnota -> 0).
  percent += BODY_CONDITION_ADJUST[bodyCondition] || 0;

  const grams = Math.round((weightKg * percent / 100) * 1000);
  return { grams, percent, stage };
}

/**
 * Kompletní denní cíle: dávka, rozpad na složky, kalorie a mikroživiny.
 * @param {object} dog
 * @param {number} dog.weightKg
 * @param {number} dog.ageMonths
 * @param {'gaucak'|'pohodar'|'sportovec'} dog.activity
 * @param {boolean} dog.neutered
 * @param {'small'|'medium'|'large'|'giant'} dog.breedSize
 * @param {'underweight'|'ideal'|'overweight'} [dog.bodyCondition='ideal']
 * @param {object} [dog.ratios] - {muscle_pct, bones_pct, organs_pct, other_pct}
 */
function calcDailyTargets(dog) {
  const bodyCondition = dog.bodyCondition || 'ideal';
  const { grams, percent, stage } = calcRation({ ...dog, bodyCondition });
  const micro = MICRO_PER_KG[stage];
  const r = dog.ratios || DEFAULT_RATIOS;
  const w = dog.weightKg;

  return {
    stage,
    percent,
    ration_g:      grams,
    // Rozpad dávky na složky misky:
    muscle_g:      Math.round(grams * r.muscle_pct / 100),
    rmb_g:         Math.round(grams * r.bones_pct  / 100),
    organs_g:      Math.round(grams * r.organs_pct / 100),
    other_g:       Math.round(grams * r.other_pct  / 100),
    // Kalorie:
    kcal:          Math.round(grams * KCAL_PER_GRAM),
    // Mikroživiny (lineárně podle hmotnosti):
    calcium_mg:    Math.round(w * micro.calcium_mg),
    phosphorus_mg: Math.round(w * micro.phosphorus_mg),
    magnesium_mg:  Math.round(w * micro.magnesium_mg),
    iron_mg:       Math.round(w * micro.iron_mg * 10) / 10,
    zinc_mg:       Math.round(w * micro.zinc_mg * 10) / 10,
    vitamin_a_ug:  Math.round(w * micro.vitamin_a_ug),
    vitamin_d_ug:  Math.round(w * micro.vitamin_d_ug * 10) / 10,
  };
}

/* ---------------------------------------------------------------------
 * 4) EXPORT (Node) — v prohlížeči jsou funkce dostupné globálně.
 * ------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BREED_STAGE_THRESHOLDS, ADULT_RATES, PUPPY_RATES, BODY_CONDITION_ADJUST,
    DEFAULT_RATIOS, MICRO_PER_KG, KCAL_PER_GRAM,
    ageMonthsFromBirthDate, getLifeStage, calcRation, calcDailyTargets,
  };
}

/* ---------------------------------------------------------------------
 * 5) RYCHLÝ PŘÍKLAD (odkomentuj a spusť `node barf-calc.js`)
 * ------------------------------------------------------------------- */
// console.log(calcDailyTargets({
//   weightKg: 20, ageMonths: 36, activity: 'pohodar',
//   neutered: false, breedSize: 'medium', bodyCondition: 'ideal',
// }));
// => { stage:'adult', percent:2.5, ration_g:500, muscle_g:250, rmb_g:125, ... }
