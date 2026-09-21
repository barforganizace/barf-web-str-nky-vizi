-- Omega-3 (EPA+DHA) a omega-6 (kyselina linolová) v tabulce foods jedou
-- z master tabulky ingredients (USDA SR28 / BLS 4.0), ne z ručních odhadů.
-- Každá napárovaná surovina má v food_nutrition_profiles profil 'usda' nebo
-- 'bls' se source_id = ingredients.source_code řádku, ze kterého hodnoty
-- pocházejí (celý profil nese i ostatní živiny toho řádku). Surovina bez
-- odpovídajícího řádku má omegy NULL = neznámé, ne nula.
-- Párování: stejný díl / tkáň, syrové; sanity check přes tuk v katalogu.
-- Skript jde spustit opakovaně.

-- Web (anon) čte profily kvůli zobrazení zdroje u suroviny.
drop policy if exists "Anyone can view nutrition profiles of active foods" on public.food_nutrition_profiles;
create policy "Anyone can view nutrition profiles of active foods"
  on public.food_nutrition_profiles for select to anon
  using (exists (select 1 from public.foods f where f.id = food_id and f.is_active));

drop table if exists omega_source;
create temp table omega_source on commit drop as
with mapping(name_cs, code, note) as (values
  -- ryby, oleje, řasy, vejce, tuk
  ('Ančovičky (sardele)', 'NDB-15001', null),
  ('Losos', 'NDB-15236', null),
  ('Makrela', 'NDB-15046', null),
  ('Sleď', 'NDB-15039', null),
  ('Sardinky', 'BLS-T105100', 'USDA má jen sardinky v konzervě; tuk v katalogu 11 %, BLS 8,2 %.'),
  ('Lososový olej', 'NDB-04593', null),
  ('Mořská řasa', 'NDB-11445', null),
  ('Řasa nori', 'NDB-11446', null),
  ('Vejce', 'NDB-01123', null),
  ('Vepřové sádlo', 'NDB-10109', 'Syrový vepřový tuk (leaf fat); škvařené sádlo by bylo NDB-04002.'),
  -- vnitřnosti
  ('Hovězí mozek', 'NDB-13318', null),
  ('Vepřový mozek', 'NDB-10096', 'USDA neuvádí EPA, omega-3 = jen DHA.'),
  ('Hovězí játra', 'NDB-13325', null),
  ('Vepřová játra', 'NDB-10110', null),
  ('Telecí játra', 'NDB-17202', null),
  ('Jehněčí játra', 'BLS-V535100', 'BLS má EPA i DHA, USDA (NDB-17199) je neuvádí.'),
  ('Kuřecí játra', 'NDB-05027', null),
  ('Krůtí játra', 'NDB-05177', null),
  ('Kachní játra', 'NDB-05143', null),
  ('Husí játra', 'BLS-V636100', 'BLS neuvádí kyselinu linolovou.'),
  ('Hovězí ledviny', 'NDB-13323', null),
  ('Vepřové ledviny', 'NDB-10106', null),
  ('Jehněčí ledviny', 'NDB-17195', null),
  ('Hovězí slinivka', 'NDB-13331', null),
  ('Vepřová slinivka', 'NDB-10115', null),
  ('Hovězí slezina', 'NDB-13333', null),
  ('Vepřová slezina', 'NDB-10117', null),
  ('Krůtí žaludky', 'NDB-05173', null),
  ('Kuřecí žaludky', 'NDB-05023', null),
  -- srdce
  ('Hovězí srdce', 'NDB-13321', 'Tuk v katalogu (12 %) neodpovídá USDA (3,9 %).'),
  ('Jehněčí srdce', 'NDB-17191', null),
  ('Krůtí srdce', 'NDB-05175', null),
  ('Kuřecí srdce', 'NDB-05025', null),
  ('Vepřové srdce', 'NDB-10103', null),
  -- doplňková svalovina
  ('Hovězí dršťky', 'NDB-13341', null),
  ('Hovězí plíce', 'NDB-13328', null),
  ('Vepřové plíce', 'NDB-10112', null),
  ('Vepřové uši', 'NDB-10100', null),
  ('Vepřový bůček', 'NDB-10005', null),
  ('Vepřový žaludek', 'NDB-10119', null),
  -- jazyky
  ('Hovězí jazyk', 'NDB-13339', null),
  ('Vepřový jazyk', 'NDB-10121', null),
  ('Jehněčí jazyk', 'NDB-17220', null),
  -- svalovina
  ('Hovězí svalovina', 'NDB-13795', null),
  ('Telecí svalovina', 'NDB-17090', 'USDA neuvádí EPA/DHA.'),
  ('Vepřová svalovina', 'NDB-10003', null),
  ('Jehněčí maso', 'NDB-17001', null),
  ('Kozí maso', 'BLS-V122100', 'BLS neuvádí EPA/DHA; tuk v katalogu 2,3 %, BLS 5 %.'),
  ('Vepřová panenka', 'NDB-10218', null),
  ('Vepřová kýta', 'NDB-10010', null),
  ('Vepřová pečeně (kotleta)', 'NDB-10024', null),
  ('Vepřová krkovice', 'NDB-10070', 'USDA nemá krkovici; makra v katalogu odpovídají řádku „shoulder, whole“.'),
  ('Vepřová plec', 'NDB-10074', 'Arm picnic = plec; tuk v katalogu 16 %, USDA 12,5 %.'),
  ('Kuřecí prsa', 'NDB-05057', null),
  ('Kuřecí stehno', 'NDB-05066', 'Makra v katalogu odpovídají řádku „drumstick, meat and skin“.'),
  ('Krůtí prsa', 'NDB-05191', null),
  ('Krůtí stehno', 'NDB-05193', null),
  ('Kachní prsa', 'NDB-05141', 'USDA „meat only“ (bez kůže).'),
  ('Husí maso', 'NDB-05148', null),
  -- zvěřina a spol.
  ('Daňčí maso', 'NDB-17164', 'USDA má jen obecné „deer“.'),
  ('Srnčí maso', 'BLS-V221100', 'Reh Keule (srnčí kýta).'),
  ('Zvěřina (jelení)', 'BLS-V212100', null),
  ('Divočák', 'NDB-17158', 'USDA neuvádí EPA/DHA.'),
  ('Koňské maso', 'NDB-17170', 'USDA neuvádí EPA/DHA.'),
  ('Králičí maso', 'NDB-17177', 'USDA neuvádí EPA/DHA; tuk v katalogu 3,5 %, USDA 5,6 %.'),
  -- masité kosti (jen kde zdroj odpovídá makrům v katalogu)
  ('Křepelka (celá)', 'NDB-05157', 'USDA „meat and skin“ (bez kostí); makra v katalogu odpovídají.'),
  ('Krůtí křídla', 'NDB-05195', null),
  ('Kuřecí křídla', 'NDB-05100', 'Tuk v katalogu 16 %, USDA 12,9 %.'),
  ('Vepřová žebra', 'NDB-10088', null),
  ('Jehněčí žebra', 'BLS-U857100', 'Lamm Brust (hrudí s žebry); BLS neuvádí EPA/DHA.'),
  ('Vepřové nožičky', 'NDB-10102', null),
  ('Vepřový ocásek', 'NDB-10174', null),
  ('Vepřové koleno', 'BLS-U693100', 'Hintereisbein (zadní koleno).'),
  ('Vepřová hlava', 'BLS-U508100', 'Schwein Maske (hlava bez líček).'),
  ('Hovězí oháňka', 'BLS-U109100', 'BLS neuvádí EPA/DHA; tuk v katalogu 16 %, BLS 11,5 %.'),
  -- ovoce
  ('Borůvky', 'NDB-09050', null),
  ('Černý rybíz', 'NDB-09083', 'USDA neuvádí EPA/DHA.'),
  ('Červený rybíz', 'NDB-09084', null),
  ('Jahody', 'NDB-09316', null),
  ('Maliny', 'NDB-09302', null),
  ('Ostružiny', 'NDB-09042', null),
  ('Hruška', 'NDB-09252', null),
  ('Jablko', 'NDB-09003', null),
  ('Banán', 'NDB-09040', null),
  -- zelenina
  ('Pórek', 'NDB-11246', null),
  ('Brokolice', 'NDB-11090', null),
  ('Květák', 'NDB-11135', null),
  ('Špenát', 'NDB-11457', null),
  ('Batáty', 'NDB-11507', null),
  ('Mrkev', 'NDB-11124', null),
  ('Cuketa', 'NDB-11477', null),
  ('Dýně', 'NDB-11422', null),
  ('Celer řapíkatý', 'NDB-11143', null)
)
select f.id as food_id, i.*, m.note
from mapping m
join public.food_translations t on t.locale = 'cs' and t.name = m.name_cs
join public.foods f on f.id = t.food_id
join public.ingredients i on i.source_code = m.code;

do $$
begin
  if (select count(*) from omega_source) <> 93 then
    raise exception 'omega_source: čekáno 93 napárovaných surovin, je %', (select count(*) from omega_source);
  end if;
end $$;

insert into public.food_nutrition_profiles (
  food_id, source, source_id, source_name, source_version, is_default, notes,
  protein_pct, fat_pct, carbs_pct, fiber_pct, moisture_pct, kcal_per_100g,
  calcium_mg, phosphorus_mg, magnesium_mg, potassium_mg, sodium_mg,
  iron_mg, zinc_mg, copper_mg, manganese_mg, selenium_ug, iodine_ug,
  vitamin_d_ug, vitamin_e_mg, vitamin_k_ug,
  vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, vitamin_c_mg,
  omega3_epa_dha_mg, omega6_la_mg)
select
  food_id, 'usda', source_code, name_en, source, false,
  concat_ws(' ', note, 'Omega-3 = (EPA + DHA) × 1000, omega-6 = kyselina linolová × 1000 z řádku ' || source || ' ' || source_code || '. Vitamin A, chlorid, chrom a molybden zdroj neuvádí.'),
  protein_pct, fat_pct, carbs_pct, fiber_pct, moisture_pct, kcal_per_100g,
  calcium_mg, phosphorus_mg, magnesium_mg, potassium_mg, sodium_mg,
  iron_mg, zinc_mg, copper_mg, manganese_mg, selenium_ug, iodine_ug,
  vitamin_d_iu / 40, vitamin_e_mg, vitamin_k_ug,
  vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, vitamin_c_mg,
  case when epa_g is null and dha_g is null then null else round((coalesce(epa_g, 0) + coalesce(dha_g, 0)) * 1000) end,
  round(la_g * 1000)
from omega_source
where source = 'USDA SR28'
on conflict (food_id, source) do update set
  source_id = excluded.source_id, source_name = excluded.source_name, source_version = excluded.source_version, notes = excluded.notes,
  protein_pct = excluded.protein_pct, fat_pct = excluded.fat_pct, carbs_pct = excluded.carbs_pct, fiber_pct = excluded.fiber_pct, moisture_pct = excluded.moisture_pct, kcal_per_100g = excluded.kcal_per_100g,
  calcium_mg = excluded.calcium_mg, phosphorus_mg = excluded.phosphorus_mg, magnesium_mg = excluded.magnesium_mg, potassium_mg = excluded.potassium_mg, sodium_mg = excluded.sodium_mg,
  iron_mg = excluded.iron_mg, zinc_mg = excluded.zinc_mg, copper_mg = excluded.copper_mg, manganese_mg = excluded.manganese_mg, selenium_ug = excluded.selenium_ug, iodine_ug = excluded.iodine_ug,
  vitamin_d_ug = excluded.vitamin_d_ug, vitamin_e_mg = excluded.vitamin_e_mg, vitamin_k_ug = excluded.vitamin_k_ug,
  vitamin_b1_mg = excluded.vitamin_b1_mg, vitamin_b2_mg = excluded.vitamin_b2_mg, vitamin_b3_mg = excluded.vitamin_b3_mg, vitamin_b6_mg = excluded.vitamin_b6_mg, vitamin_b9_ug = excluded.vitamin_b9_ug, vitamin_b12_ug = excluded.vitamin_b12_ug, vitamin_c_mg = excluded.vitamin_c_mg,
  omega3_epa_dha_mg = excluded.omega3_epa_dha_mg, omega6_la_mg = excluded.omega6_la_mg;

insert into public.food_nutrition_profiles (
  food_id, source, source_id, source_name, source_version, is_default, notes,
  protein_pct, fat_pct, carbs_pct, fiber_pct, moisture_pct, kcal_per_100g,
  calcium_mg, phosphorus_mg, magnesium_mg, potassium_mg, sodium_mg,
  iron_mg, zinc_mg, copper_mg, manganese_mg, selenium_ug, iodine_ug,
  vitamin_d_ug, vitamin_e_mg, vitamin_k_ug,
  vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, vitamin_c_mg,
  omega3_epa_dha_mg, omega6_la_mg)
select
  food_id, 'bls', source_code, name_en, source, false,
  concat_ws(' ', note, 'Omega-3 = (EPA + DHA) × 1000, omega-6 = kyselina linolová × 1000 z řádku ' || source || ' ' || source_code || '. Vitamin A, chlorid, chrom a molybden zdroj neuvádí.'),
  protein_pct, fat_pct, carbs_pct, fiber_pct, moisture_pct, kcal_per_100g,
  calcium_mg, phosphorus_mg, magnesium_mg, potassium_mg, sodium_mg,
  iron_mg, zinc_mg, copper_mg, manganese_mg, selenium_ug, iodine_ug,
  vitamin_d_iu / 40, vitamin_e_mg, vitamin_k_ug,
  vitamin_b1_mg, vitamin_b2_mg, vitamin_b3_mg, vitamin_b6_mg, vitamin_b9_ug, vitamin_b12_ug, vitamin_c_mg,
  case when epa_g is null and dha_g is null then null else round((coalesce(epa_g, 0) + coalesce(dha_g, 0)) * 1000) end,
  round(la_g * 1000)
from omega_source
where source = 'BLS 4.0'
on conflict (food_id, source) do update set
  source_id = excluded.source_id, source_name = excluded.source_name, source_version = excluded.source_version, notes = excluded.notes,
  protein_pct = excluded.protein_pct, fat_pct = excluded.fat_pct, carbs_pct = excluded.carbs_pct, fiber_pct = excluded.fiber_pct, moisture_pct = excluded.moisture_pct, kcal_per_100g = excluded.kcal_per_100g,
  calcium_mg = excluded.calcium_mg, phosphorus_mg = excluded.phosphorus_mg, magnesium_mg = excluded.magnesium_mg, potassium_mg = excluded.potassium_mg, sodium_mg = excluded.sodium_mg,
  iron_mg = excluded.iron_mg, zinc_mg = excluded.zinc_mg, copper_mg = excluded.copper_mg, manganese_mg = excluded.manganese_mg, selenium_ug = excluded.selenium_ug, iodine_ug = excluded.iodine_ug,
  vitamin_d_ug = excluded.vitamin_d_ug, vitamin_e_mg = excluded.vitamin_e_mg, vitamin_k_ug = excluded.vitamin_k_ug,
  vitamin_b1_mg = excluded.vitamin_b1_mg, vitamin_b2_mg = excluded.vitamin_b2_mg, vitamin_b3_mg = excluded.vitamin_b3_mg, vitamin_b6_mg = excluded.vitamin_b6_mg, vitamin_b9_ug = excluded.vitamin_b9_ug, vitamin_b12_ug = excluded.vitamin_b12_ug, vitamin_c_mg = excluded.vitamin_c_mg,
  omega3_epa_dha_mg = excluded.omega3_epa_dha_mg, omega6_la_mg = excluded.omega6_la_mg;

-- foods: omegy jen z profilu usda/bls; bez profilu = NULL (neznámé).
update public.foods f
set omega3_epa_dha_mg = p.omega3_epa_dha_mg, omega6_la_mg = p.omega6_la_mg
from public.food_nutrition_profiles p
where p.food_id = f.id and p.source::text in ('usda', 'bls');

update public.foods f
set omega3_epa_dha_mg = null, omega6_la_mg = null
where not exists (
  select 1 from public.food_nutrition_profiles p
  where p.food_id = f.id and p.source::text in ('usda', 'bls')
);
