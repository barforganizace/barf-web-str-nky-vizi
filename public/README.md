# BARF kalkulačka — podklady pro vývoj

Tahle složka je samostatný balíček, ze kterého postavíš kalkulačku dávky syrového krmiva (BARF) pro psy. Nepotřebuješ nic z hlavní appky — všechno je tady.

## Co je ve složce

| Soubor | K čemu je |
|---|---|
| `README.md` | Tahle guida — vysvětlení, jak se to počítá. |
| `barf-data.json` | Všechna data (tabulky procent, mikroživiny, suroviny, limity). Tvůj zdroj pravdy. |
| `barf-calc.js` | Hotové výpočetní jádro v čistém JS. Můžeš ho rovnou použít nebo si podle něj napsat vlastní. |

---

## Jak to funguje (v kostce)

Celý výpočet stojí na jedné myšlence: **pes sní určité procento ze své hmotnosti denně.** To procento se liší podle věku, velikosti, aktivity, kastrace a kondice.

### Hlavní vzorec

```
denní dávka [g] = hmotnost [kg] × procento / 100 × 1000
```

Příklad: pes 20 kg, procento 2,5 % → `20 × 2,5 / 100 × 1000 = 500 g denně`.

> ⚠️ **Důležité:** počítej z **cílové** hmotnosti, ne z aktuální. Když je pes tlustý, zadej váhu, na které ho chceš mít.

### Postup ve 4 krocích

**1. Urči životní fázi** — z věku a velikosti plemene. Hranice nejsou pevné, protože malá plemena dospívají dřív a žijí dýl než obří:

| Velikost | Štěně do | Senior od |
|---|---|---|
| Malé | 10 měs. | 96 měs. (8 let) |
| Střední | 12 měs. | 84 měs. (7 let) |
| Velké | 15 měs. | 72 měs. (6 let) |
| Obří | 24 měs. | 60 měs. (5 let) |

**2. Vyber procento** podle fáze:

- **Štěně** — % z *aktuální* hmotnosti, klesá s věkem (9 % → 7 % → 5,5 % → 4,5 %). Štěně se má vážit často a přepočítávat.
- **Dospělý** — z matice *velikost × aktivita × kastrace* (viz tabulka níž).
- **Senior** — bere sazbu „gaučáka" pro svou velikost (aktivita se neřeší).

Matice pro dospělé (formát `nekastrovaný / kastrovaný`):

| Velikost | Gaučák | Pohodář | Sportovec |
|---|---|---|---|
| Malé | 2,5 / 2,2 | 3,0 / 2,7 | 3,5 / 3,2 |
| Střední | 2,0 / 1,8 | 2,5 / 2,2 | 3,0 / 2,7 |
| Velké | 1,8 / 1,6 | 2,2 / 2,0 | 2,7 / 2,4 |
| Obří | 1,5 / 1,3 | 1,8 / 1,6 | 2,2 / 2,0 |

Aktivita znamená: **Gaučák** = málo pohybu, **Pohodář** = běžné procházky, **Sportovec** = hodně zátěže.

**3. Přičti korekci kondice:**

| Kondice | Úprava procenta |
|---|---|
| Podváha | +0,5 |
| Ideální | 0,0 |
| Nadváha | −0,5 |

**4. Dosaď do vzorce** a spočítej gramy.

### Rozpad dávky na misku

Hotových gramů pak rozpočítáš na složky. Výchozí poměr appky:

- Svalovina **50 %**
- Masité kosti **25 %**
- Vnitřnosti **15 %**
- Ostatní **10 %**

V `barf-data.json` jsou navíc dva „učebnicové" modely (`barf` se zeleninou a `pmr` bez zeleniny), které můžeš nabídnout jako alternativu.

### Volitelné: kalorie a mikroživiny

- Kalorie: `kcal = gramy × 1,6` (hrubý odhad).
- Mikroživiny (vápník, fosfor, …): hodnota *na kg hmotnosti* × hmotnost. Štěně má vyšší hodnoty. Viz `mikroziviny` v JSONu.

---

## Jak použít kód

### V prohlížeči
```html
<script src="barf-calc.js"></script>
<script>
  const v = calcDailyTargets({
    weightKg: 20, ageMonths: 36, activity: 'pohodar',
    neutered: false, breedSize: 'medium', bodyCondition: 'ideal',
  });
  console.log(v.ration_g); // 500
</script>
```

### V Node
```js
const { calcDailyTargets } = require('./barf-calc.js');
console.log(calcDailyTargets({
  weightKg: 20, ageMonths: 36, activity: 'pohodar',
  neutered: false, breedSize: 'medium', bodyCondition: 'ideal',
}));
```

### Co funkce vrátí
```js
{
  stage: 'adult',     // životní fáze
  percent: 2.5,       // použité procento
  ration_g: 500,      // celková denní dávka
  muscle_g: 250,      // svalovina
  rmb_g: 125,         // masité kosti
  organs_g: 75,       // vnitřnosti
  other_g: 50,        // ostatní
  kcal: 800,          // odhad kalorií
  calcium_mg: 2400,   // … a další mikroživiny
  phosphorus_mg: 2000,
  // ...
}
```

Vstupní klíče: `weightKg`, `ageMonths`, `activity` (`gaucak`/`pohodar`/`sportovec`), `neutered` (true/false), `breedSize` (`small`/`medium`/`large`/`giant`), `bodyCondition` (`underweight`/`ideal`/`overweight`, výchozí `ideal`), volitelně `ratios`.

---

## Zdravotní limity (pro validaci misky)

Když budeš dělat i kontrolu složení, hlídej:

- **Játra max 5 %** (kvůli vitaminu A), nikdy nemíchat s ostatními orgány.
- **Kost** cílově 10 %, rozsah 8–15 % *reálné kosti*. Pozor: celé RMB (krky, křídla) jsou ~50 % maso → 10 % kosti ≈ 15–20 % RMB.
- **Svalovina min 70 %** (u učebnicového modelu).
- **Poměr Ca:P ≈ 1,2–1,4 : 1**.
- Přechod na BARF postupně **7–10 dní**.

## Suroviny a zakázané potraviny

Kompletní seznamy (svalovina, kosti, játra, orgány, zelenina, doplňky) a **toxický blacklist** (cibule, česnek, hrozny, avokádo, čokoláda, xylitol, makadamové ořechy, vařené kosti, syrové vepřové) najdeš v `barf-data.json` v klíčích `suroviny` a `zakazane`.

---

## Disclaimer

Jde o orientační výpočet, ne veterinární doporučení. U štěňat, březích fen a nemocných psů ať uživatel konzultuje s veterinářem.
