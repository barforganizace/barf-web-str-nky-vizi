# BARF kalkulačka — kompletní specifikace výpočtu a onboardingu

Zdroj: `src/pages/KalkulackaPage.tsx` (jediný soubor, veškerá logika i data jsou v něm).
Texty: `src/i18n/cs.json` / `en.json`, namespace `calc.*`.

Tento dokument je samostatný — obsahuje všechna data i vzorce, není potřeba číst kód.

---

## 1. Onboarding — průběh

4 obrazovky, stav `step` = 0..3. Krokový indikátor ukazuje 3 kroky (výsledek se nepočítá).

| step | Obrazovka | Co uživatel zadává | Podmínka pro „Pokračovat" |
|---|---|---|---|
| 0 | Velikost psa | `breedSize` (small/medium/large/giant) | `breedSize !== null` |
| 1 | Váha a věk | `weight` (slider), `ageMonths` (slider) | vždy povoleno (slidery mají default) |
| 2 | Životní styl | `activity`, `neutered`, `condition` | `activity !== null && neutered !== null` |
| 3 | Výsledek | — | tlačítko „Spočítat znovu" → reset na step 0 |

### Stav (počáteční hodnoty)

```
breedSize = null
weight    = 15      // kg
ageMonths = 36      // měsíce
activity  = null
neutered  = null
condition = "ideal"
```

### Chování jednotlivých kroků

**Krok 0 — velikost.** Výběr velikosti zároveň přenastaví váhu na střed rozsahu dané velikosti:
`weight = round((min + max) / 2)`.

| breedSize | rozsah slideru (kg) | default po výběru | popisek | příklady plemen |
|---|---|---|---|---|
| small | 1–10 | 6 | do 10 kg | Čivava, Krysařík, Yorkie |
| medium | 10–25 | 18 | 10–25 kg | Border kolie, Kokršpaněl |
| large | 25–45 | 35 | 25–45 kg | Labrador, Zlatý retrívr |
| giant | 45–80 | 63 | nad 45 kg | Doga, Bernardýn, Newfoundland |

**Krok 1 — váha a věk.**
- Váha: slider v rozsahu podle velikosti (tabulka výše), krok 1 kg. Zadává se **cílová** váha, ne aktuální.
- Věk: slider 1–180 měsíců (1 měs. – 15 let), krok 1 měsíc.
- Živá zpětná vazba: pod sliderem se ukáže **automaticky detekovaná životní fáze** (štěně/dospělý/senior) + vysvětlující poznámka. Fázi uživatel nevybírá.

**Krok 2 — životní styl.**
- **Aktivita** se zobrazí **jen dospělým psům**. Pokud je fáze `puppy` nebo `senior`, sekce se skryje a `activity` se automaticky nastaví na `"pohodar"` (u seniora ani u štěněte se stejně nepoužije — viz vzorec).
- **Kastrace**: ano/ne, povinné.
- **Kondice**: podváha / ideální / nadváha, default „ideální".

**Krok 3 — výsledek.** Karta s celkovou dávkou, 4 karty složek, týdenní/měsíční tabulka, mřížka mikroživin, disclaimer.

---

## 2. Určení životní fáze (`getStage`)

```
stage = ageMonths <  puppyEnd     -> "puppy"
        ageMonths >= seniorStart  -> "senior"
        jinak                     -> "adult"
```

Prahy v **měsících**, podle velikosti:

| breedSize | puppyEnd (< = štěně) | seniorStart (>= = senior) |
|---|---|---|
| small | 10 | 96 (8 let) |
| medium | 12 | 84 (7 let) |
| large | 15 | 72 (6 let) |
| giant | 24 | 60 (5 let) |

---

## 3. Výpočet procenta z hmotnosti

Denní dávka = **procento z tělesné hmotnosti**. Procento se určí podle fáze:

### 3a) Štěně (`puppy`) — podle věku, nezávisle na velikosti a aktivitě

Vybere se první pásmo, kde `ageMonths <= maxMonths`:

| věk (měsíce) | % z hmotnosti |
|---|---|
| ≤ 4 | 9,0 |
| ≤ 6 | 7,0 |
| ≤ 9 | 5,5 |
| ≤ 12 | 4,5 |

Fallback: pokud věk přesáhne 12 měsíců a pes je stále ve fázi „štěně" (týká se jen `giant`, kde puppyEnd = 24), použije se poslední pásmo **4,5 %**.

### 3b) Dospělý (`adult`) — matice velikost × aktivita × kastrace

| breedSize | aktivita | nekastrovaný % | kastrovaný % |
|---|---|---|---|
| small | gaucak | 2,5 | 2,2 |
| small | pohodar | 3,0 | 2,7 |
| small | sportovec | 3,5 | 3,2 |
| medium | gaucak | 2,0 | 1,8 |
| medium | pohodar | 2,5 | 2,2 |
| medium | sportovec | 3,0 | 2,7 |
| large | gaucak | 1,8 | 1,6 |
| large | pohodar | 2,2 | 2,0 |
| large | sportovec | 2,7 | 2,4 |
| giant | gaucak | 1,5 | 1,3 |
| giant | pohodar | 1,8 | 1,6 |
| giant | sportovec | 2,2 | 2,0 |

Aktivity: `gaucak` = málo pohybu / doma, `pohodar` = běžné procházky 30–60 min denně, `sportovec` = sport, agility, pracovní pes.

### 3c) Senior — vždy sazba „gaucak" pro danou velikost

Aktivita se ignoruje, kastrace se stále zohlední. Tj. `ADULT_RATES[breedSize].gaucak.{neutral|neutered}`.

### 3d) Korekce kondice (aplikuje se na všechny fáze)

Přičte se **absolutní procentní bod** k výslednému procentu:

| condition | úprava |
|---|---|
| underweight (podváha) | +0,5 |
| ideal | 0 |
| overweight (nadváha) | −0,5 |

---

## 4. Výstupní hodnoty

```
ration_g = round( weightKg * percent / 100 * 1000 )   // celková denní dávka v gramech
```

### Rozpad dávky (podíly z `ration_g`)

| klíč | podíl | popisek CZ |
|---|---|---|
| muscle_g | 70 % | Svalovina |
| rmb_g | 10 % | Masité kosti |
| organs_g | 5 % | Vnitřnosti (mimo ledvin) |
| kidneys_g | 5 % | Ledviny |
| other_g | 10 % | Ostatní |

Rozpad „Ostatní" v týdenní tabulce (počítá se znovu z `ration_g`, ne z `other_g`):

| položka | podíl z ration_g |
|---|---|
| zelenina | 7 % |
| ořechy/semínka | 2 % |
| ovoce | 1 % |

### Energie

```
kcal = round( ration_g * 1.6 )      // 1,6 kcal na 1 g syrové stravy
```

### Mikroživiny — **na kilogram hmotnosti psa a den**, podle fáze

| živina | puppy | adult | senior |
|---|---|---|---|
| vápník (mg/kg) | 320 | 120 | 120 |
| fosfor (mg/kg) | 250 | 100 | 100 |
| hořčík (mg/kg) | 14 | 8,75 | 8,75 |
| železo (mg/kg) | 2,2 | 1,25 | 1,25 |
| zinek (mg/kg) | 2,25 | 1,5 | 1,5 |
| vitamín A (µg/kg) | 75 | 37,5 | 37,5 |
| vitamín D (µg/kg) | 1,4 | 0,688 | 0,688 |

Výpočet: `hodnota = weightKg * tabulka[stage][živina]`.
Zaokrouhlení: vápník, fosfor, hořčík, vit. A → celé číslo; železo, zinek, vit. D → 1 desetinné místo.
`adult` a `senior` mají shodné hodnoty.

### Odvozené zobrazované hodnoty

```
na porci (2× denně) = round(ration_g / 2)
týden               = grams * 7 / 1000    kg  (2 desetinná místa)
měsíc               = grams * 30 / 1000   kg  (1 desetinné místo)
```

---

## 5. Referenční pseudokód

```
function calcDaily(weightKg, ageMonths, breedSize, activity, neutered, condition):
    stage = getStage(ageMonths, breedSize)

    if stage == "puppy":
        percent = first PUPPY_RATES[r] where ageMonths <= r.maxMonths  else 4.5
    else if stage == "senior":
        percent = ADULT_RATES[breedSize]["gaucak"][neutered ? "neutered" : "neutral"]
    else:
        percent = ADULT_RATES[breedSize][activity][neutered ? "neutered" : "neutral"]

    percent += CONDITION_ADJUST[condition]        // +0.5 / 0 / -0.5

    ration_g = round(weightKg * percent / 100 * 1000)
    micro    = MICRO_PER_KG[stage]

    return {
      stage, percent, ration_g,
      muscle_g  = round(ration_g * 0.70),
      rmb_g     = round(ration_g * 0.10),
      organs_g  = round(ration_g * 0.05),
      kidneys_g = round(ration_g * 0.05),
      other_g   = round(ration_g * 0.10),
      kcal      = round(ration_g * 1.6),
      calcium_mg    = round(weightKg * micro.calcium_mg),
      phosphorus_mg = round(weightKg * micro.phosphorus_mg),
      magnesium_mg  = round(weightKg * micro.magnesium_mg),
      iron_mg       = round1(weightKg * micro.iron_mg),
      zinc_mg       = round1(weightKg * micro.zinc_mg),
      vitamin_a_ug  = round(weightKg * micro.vitamin_a_ug),
      vitamin_d_ug  = round1(weightKg * micro.vitamin_d_ug),
    }
```

---

## 6. Kontrolní příklady

**A) Labrador, 30 kg, 4 roky (48 měs.), large, pohodář, nekastrovaný, ideální kondice**
- stage: 48 < 72 a >= 15 → `adult`
- percent: large/pohodar/neutral = 2,2 + 0 = **2,2 %**
- ration_g = 30 × 2,2 / 100 × 1000 = **660 g/den**
- svalovina 462 g · masité kosti 66 g · vnitřnosti 33 g · ledviny 33 g · ostatní 66 g
- kcal = 1056
- vápník 3600 mg, fosfor 3000 mg, hořčík 263 mg, železo 37,5 mg, zinek 45 mg, vit. A 1125 µg, vit. D 20,6 µg

**B) Štěně border kolie, 12 kg, 5 měsíců, medium, ideální**
- stage: 5 < 12 → `puppy`
- percent: pásmo ≤ 6 → 7,0 + 0 = **7,0 %**
- ration_g = 12 × 7 / 100 × 1000 = **840 g/den**
- kcal = 1344; vápník 3840 mg, fosfor 3000 mg (puppy sazby)

**C) Senior čivava, 5 kg, 9 let (108 měs.), small, kastrovaná, nadváha**
- stage: 108 >= 96 → `senior`
- percent: small/gaucak/neutered = 2,2 − 0,5 = **1,7 %**
- ration_g = 5 × 1,7 / 100 × 1000 = **85 g/den**

---

## 7. Známé nesrovnalosti v současné implementaci

1. **Karta „Vnitřnosti" ve výsledku** má popisek `10 %`, ale zobrazuje hodnotu `organs_g`, což je 5 %. Týdenní tabulka to má správně (`organs_g + kidneys_g` = 10 %). Karta ukazuje polovinu.
2. **Pole `CATS`** obsahuje jen 4 karty (muscle, rmb, organs, other) — ledviny nemají vlastní kartu, jen řádek v tabulce.
3. **Obří plemena 13–24 měsíců** jsou stále ve fázi „štěně" (puppyEnd = 24), ale tabulka `PUPPY_RATES` končí u 12 měsíců → spadnou na fallback 4,5 %. Chybí pásmo pro 12–24 měs.
4. **Aktivita u štěněte/seniora** se nastavuje vedlejším efektem přímo v renderu (`setActivity` uvnitř JSX) — funkčně to prochází, ale je to anti-pattern.
5. Součet podílů sedí na 100 % (70 + 10 + 5 + 5 + 10), stejně jako rozpad „ostatní" (7 + 2 + 1 = 10).

---

## 8. Texty rozhraní (CS)

- Titulek: „Kolik sežere váš pes?" · podtitulek: „Výpočet podle FEDIAF · korekce kondice · mikroživiny"
- Poznámka ke kastraci: „Kastrace snižuje energetické nároky o ~10 %."
- Poznámka k fázím:
  - štěně: „Procento se počítá z aktuální hmotnosti a klesá s věkem. Vážte štěně každý týden."
  - dospělý: „Procento vychází z matice velikost × aktivita × kastrace."
  - senior: „Senior dostává sazbu 'Gaučák' bez ohledu na aktivitu."
- Disclaimer: „Výsledky jsou orientační dle FEDIAF metodik. Skutečné potřeby závisí na zdravotním stavu a rase. U štěňat vážte každý týden a přepočítávejte. Poraďte se s veterinárním nutričním specialistou."
