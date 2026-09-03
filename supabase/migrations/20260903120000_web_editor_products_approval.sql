-- Editor produktů na webu barfingapp.com.
-- Rozšiřuje schéma z create_editor_tables:
--   * komponenta receptury může být i ze standardní databáze appky (foods),
--     ne jen z master surovin (ingredients); receptura se zadává v gramech
--   * produkt má popis, poznámku z kontroly a odkaz na řádek ve foods
--   * nový stav 'rejected'; stavy published/rejected nastavuje jen admin
--   * funkce: založení produktu, přepočet živin, nová verze, schválení/zamítnutí.
-- Schválení zapíše produkt jako řádek do foods (+ food_translations), takže
-- se objeví v katalogu appky. NULL v datech se nikdy nesčítá jako 0.

alter table public.products
  add column description text,
  add column food_id uuid references public.foods(id) on delete set null,
  add column review_note text;

alter table public.products alter column legal_type set default 'complementary_feed';

alter table public.products drop constraint products_status_check;
alter table public.products add constraint products_status_check
  check (status in ('draft', 'in_review', 'published', 'rejected', 'archived'));

alter table public.product_components
  alter column ingredient_id drop not null,
  add column food_id uuid references public.foods(id),
  add column grams numeric check (grams is null or grams >= 0),
  add constraint product_components_source_check
    check ((ingredient_id is null) <> (food_id is null));

create unique index product_components_version_food_key
  on public.product_components (version_id, food_id) where food_id is not null;

-- Stav published/rejected a propojení s foods smí měnit jen admin.
create or replace function public.guard_product_status()
returns trigger language plpgsql set search_path = public as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.status in ('published', 'rejected')
     and (tg_op = 'INSERT' or new.status <> old.status) then
    raise exception 'Stav "%" může nastavit jen admin.', new.status;
  end if;
  if new.food_id is not null
     and (tg_op = 'INSERT' or new.food_id is distinct from old.food_id) then
    raise exception 'Propojení s databází appky spravuje jen admin.';
  end if;
  return new;
end;
$$;
revoke execute on function public.guard_product_status() from public, anon, authenticated;

create trigger products_guard_status
  before insert or update on public.products
  for each row execute function public.guard_product_status();

-- Založení produktu i s první verzí v jednom kroku (RLS platí — volající musí být člen firmy).
create or replace function public.create_product(p_org_id uuid, p_name text, p_category text)
returns uuid language plpgsql set search_path = public as $$
declare
  pid uuid;
  vid uuid;
begin
  insert into public.products (org_id, name, category)
  values (p_org_id, p_name, p_category)
  returning id into pid;

  insert into public.product_versions (product_id, version)
  values (pid, 1)
  returning id into vid;

  update public.products set current_version_id = vid where id = pid;
  return pid;
end;
$$;
revoke execute on function public.create_product(uuid, text, text) from public, anon;
grant execute on function public.create_product(uuid, text, text) to authenticated;

-- Živiny receptury na 100 g ve sloupcích tabulky foods (vážený průměr podle podílu).
-- Hodnota se uvádí jen když ji má aspoň 85 % hmotnosti receptury, jinak null.
-- Převody jednotek ze surovin: vit. A 1 IU = 0,3 µg retinolu, vit. D 1 IU = 0,025 µg,
-- EPA+DHA a LA z gramů na mg. Kost bez naměřeného Ca vápník neuvádí.
create or replace function public.product_nutrients(p_version_id uuid)
returns jsonb language sql stable set search_path = public as $$
with comps as (
  select
    c.percent,
    case when c.ingredient_id is not null then jsonb_build_object(
      'kcal_per_100g', i.kcal_per_100g,
      'protein_pct', i.protein_pct,
      'fat_pct', i.fat_pct,
      'carbs_pct', i.carbs_pct,
      'fiber_pct', i.fiber_pct,
      'moisture_pct', i.moisture_pct,
      'calcium_mg', case when i.is_bone and not i.ca_measured then null else i.calcium_mg end,
      'phosphorus_mg', i.phosphorus_mg,
      'magnesium_mg', i.magnesium_mg,
      'potassium_mg', i.potassium_mg,
      'sodium_mg', i.sodium_mg,
      'chloride_mg', null,
      'iron_mg', i.iron_mg,
      'zinc_mg', i.zinc_mg,
      'copper_mg', i.copper_mg,
      'manganese_mg', i.manganese_mg,
      'selenium_ug', i.selenium_ug,
      'iodine_ug', i.iodine_ug,
      'chromium_ug', null,
      'molybdenum_ug', null,
      'vitamin_a_ug', i.vitamin_a_iu * 0.3,
      'vitamin_d_ug', i.vitamin_d_iu * 0.025,
      'vitamin_e_mg', i.vitamin_e_mg,
      'vitamin_k_ug', i.vitamin_k_ug,
      'vitamin_b1_mg', i.vitamin_b1_mg,
      'vitamin_b2_mg', i.vitamin_b2_mg,
      'vitamin_b3_mg', i.vitamin_b3_mg,
      'vitamin_b6_mg', i.vitamin_b6_mg,
      'vitamin_b9_ug', i.vitamin_b9_ug,
      'vitamin_b12_ug', i.vitamin_b12_ug,
      'vitamin_c_mg', i.vitamin_c_mg,
      'omega3_epa_dha_mg', case when i.epa_g is null and i.dha_g is null then null
                               else (coalesce(i.epa_g, 0) + coalesce(i.dha_g, 0)) * 1000 end,
      'omega6_la_mg', i.la_g * 1000
    ) else (
      select jsonb_object_agg(k, to_jsonb(f) -> k)
      from unnest(array[
        'kcal_per_100g','protein_pct','fat_pct','carbs_pct','fiber_pct','moisture_pct',
        'calcium_mg','phosphorus_mg','magnesium_mg','potassium_mg','sodium_mg','chloride_mg',
        'iron_mg','zinc_mg','copper_mg','manganese_mg','selenium_ug','iodine_ug','chromium_ug',
        'molybdenum_ug','vitamin_a_ug','vitamin_d_ug','vitamin_e_mg','vitamin_k_ug',
        'vitamin_b1_mg','vitamin_b2_mg','vitamin_b3_mg','vitamin_b6_mg','vitamin_b9_ug',
        'vitamin_b12_ug','vitamin_c_mg','omega3_epa_dha_mg','omega6_la_mg'
      ]) k
    ) end as n,
    case when c.ingredient_id is not null then jsonb_build_object(
      case i.category_app
        when 'maso' then 'muscle' when 'ryby' then 'muscle' when 'kosti' then 'rmb'
        when 'droby' then 'organs' when 'jatra' then 'organs' else 'other' end, 1)
    else coalesce(f.bucket_composition, jsonb_build_object(
      case f.category
        when 'muscle_meat' then 'muscle' when 'bone' then 'rmb'
        when 'organ' then 'organs' when 'liver' then 'organs' else 'other' end, 1))
    end as b,
    coalesce(i.category_app = 'jatra' or f.category = 'liver', false) as is_liver
  from public.product_components c
  left join public.ingredients i on i.id = c.ingredient_id
  left join public.foods f on f.id = c.food_id
  where c.version_id = p_version_id and c.enabled and c.percent > 0
),
total as (select coalesce(sum(percent), 0) as t from comps),
kv as (
  select e.key, comps.percent as w, (e.value #>> '{}')::numeric as v
  from comps, jsonb_each(comps.n) e
),
agg as (
  select key,
    sum(w * v) filter (where v is not null) / nullif(sum(w) filter (where v is not null), 0) as value,
    coalesce(sum(w) filter (where v is not null), 0) / nullif((select t from total), 0) as coverage
  from kv group by key
)
select jsonb_build_object(
  'per100g', coalesce((select jsonb_object_agg(key, case when coverage >= 0.85 then round(value, 3) end) from agg), '{}'::jsonb),
  'coverage', coalesce((select jsonb_object_agg(key, round(coverage, 2)) from agg), '{}'::jsonb),
  'buckets', (select jsonb_build_object(
      'muscle', round(coalesce(sum(percent * coalesce((b ->> 'muscle')::numeric, 0)), 0) / nullif((select t from total), 0), 3),
      'rmb',    round(coalesce(sum(percent * coalesce((b ->> 'rmb')::numeric, 0)), 0) / nullif((select t from total), 0), 3),
      'organs', round(coalesce(sum(percent * coalesce((b ->> 'organs')::numeric, 0)), 0) / nullif((select t from total), 0), 3),
      'other',  round(coalesce(sum(percent * coalesce((b ->> 'other')::numeric, 0)), 0) / nullif((select t from total), 0), 3)
    ) from comps),
  'liver_pct', (select coalesce(sum(percent) filter (where is_liver), 0) from comps),
  'total_percent', (select t from total)
);
$$;
revoke execute on function public.product_nutrients(uuid) from public, anon;
grant execute on function public.product_nutrients(uuid) to authenticated;

-- Nová verze = kopie aktuální (publikovaná verze je zmrazená, edituje se kopie).
create or replace function public.new_product_version(p_product_id uuid)
returns uuid language plpgsql set search_path = public as $$
declare
  v public.product_versions%rowtype;
  nv uuid;
begin
  select * into v from public.product_versions
  where id = (select current_version_id from public.products where id = p_product_id);
  if not found then
    raise exception 'Produkt nemá aktuální verzi.';
  end if;

  insert into public.product_versions (product_id, version, fediaf_profile, net_weight_g, storage_note, photos, label, declared)
  select p_product_id, coalesce(max(version), 0) + 1, v.fediaf_profile, v.net_weight_g, v.storage_note, v.photos, v.label, v.declared
  from public.product_versions where product_id = p_product_id
  returning id into nv;

  insert into public.product_components (version_id, ingredient_id, food_id, percent, grams, label_name, position, enabled)
  select nv, ingredient_id, food_id, percent, grams, label_name, position, enabled
  from public.product_components where version_id = v.id;

  update public.products
  set current_version_id = nv, status = 'draft', review_note = null, updated_at = now()
  where id = p_product_id;
  return nv;
end;
$$;
revoke execute on function public.new_product_version(uuid) from public, anon;
grant execute on function public.new_product_version(uuid) to authenticated;

-- Schválení adminem: zmrazí verzi, zapíše produkt do foods (nový řádek, nebo
-- aktualizace toho, na který už produkt ukazuje) a přidá překlady názvu.
create or replace function public.approve_product(p_product_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  p public.products%rowtype;
  v public.product_versions%rowtype;
  n jsonb;
  per jsonb;
  b jsonb;
  dominant text;
  cat text;
  fid uuid;
begin
  if not public.is_admin() then
    raise exception 'Schvalovat produkty může jen admin.';
  end if;

  select * into p from public.products where id = p_product_id;
  if not found then
    raise exception 'Produkt nenalezen.';
  end if;

  select * into v from public.product_versions where id = p.current_version_id;
  if not found then
    raise exception 'Produkt nemá aktuální verzi.';
  end if;

  n := public.product_nutrients(v.id);
  if abs(coalesce((n ->> 'total_percent')::numeric, 0) - 100) > 0.5 then
    raise exception 'Složení musí dávat 100 %% (teď % %%).', round((n ->> 'total_percent')::numeric, 1);
  end if;

  per := n -> 'per100g';
  b := n -> 'buckets';
  select key into dominant from jsonb_each_text(b) order by value::numeric desc limit 1;
  cat := case
    when coalesce((n ->> 'liver_pct')::numeric, 0) > 50 then 'liver'
    when dominant = 'muscle' then 'muscle_meat'
    when dominant = 'rmb' then 'bone'
    when dominant = 'organs' then 'organ'
    else 'other' end;

  fid := p.food_id;
  if fid is null then
    insert into public.foods (category) values (cat) returning id into fid;
  end if;

  update public.foods set
    category = cat,
    subcategory = 'product',
    is_active = true,
    bucket_composition = b,
    photo_url = case when v.photos ->> 'front' is null then null
      else 'https://nhkxabxbgjwjsujetpcx.supabase.co/storage/v1/object/public/product-photos/' || (v.photos ->> 'front') end,
    piece_grams = nullif(v.net_weight_g, 0),
    kcal_per_100g = (per ->> 'kcal_per_100g')::numeric,
    protein_pct = (per ->> 'protein_pct')::numeric,
    fat_pct = (per ->> 'fat_pct')::numeric,
    carbs_pct = (per ->> 'carbs_pct')::numeric,
    fiber_pct = (per ->> 'fiber_pct')::numeric,
    moisture_pct = (per ->> 'moisture_pct')::numeric,
    calcium_mg = (per ->> 'calcium_mg')::numeric,
    phosphorus_mg = (per ->> 'phosphorus_mg')::numeric,
    magnesium_mg = (per ->> 'magnesium_mg')::numeric,
    potassium_mg = (per ->> 'potassium_mg')::numeric,
    sodium_mg = (per ->> 'sodium_mg')::numeric,
    chloride_mg = (per ->> 'chloride_mg')::numeric,
    iron_mg = (per ->> 'iron_mg')::numeric,
    zinc_mg = (per ->> 'zinc_mg')::numeric,
    copper_mg = (per ->> 'copper_mg')::numeric,
    manganese_mg = (per ->> 'manganese_mg')::numeric,
    selenium_ug = (per ->> 'selenium_ug')::numeric,
    iodine_ug = (per ->> 'iodine_ug')::numeric,
    chromium_ug = (per ->> 'chromium_ug')::numeric,
    molybdenum_ug = (per ->> 'molybdenum_ug')::numeric,
    vitamin_a_ug = (per ->> 'vitamin_a_ug')::numeric,
    vitamin_d_ug = (per ->> 'vitamin_d_ug')::numeric,
    vitamin_e_mg = (per ->> 'vitamin_e_mg')::numeric,
    vitamin_k_ug = (per ->> 'vitamin_k_ug')::numeric,
    vitamin_b1_mg = (per ->> 'vitamin_b1_mg')::numeric,
    vitamin_b2_mg = (per ->> 'vitamin_b2_mg')::numeric,
    vitamin_b3_mg = (per ->> 'vitamin_b3_mg')::numeric,
    vitamin_b6_mg = (per ->> 'vitamin_b6_mg')::numeric,
    vitamin_b9_ug = (per ->> 'vitamin_b9_ug')::numeric,
    vitamin_b12_ug = (per ->> 'vitamin_b12_ug')::numeric,
    vitamin_c_mg = (per ->> 'vitamin_c_mg')::numeric,
    omega3_epa_dha_mg = (per ->> 'omega3_epa_dha_mg')::numeric,
    omega6_la_mg = (per ->> 'omega6_la_mg')::numeric
  where id = fid;

  delete from public.food_translations where food_id = fid;
  insert into public.food_translations (food_id, locale, name, description)
  values (fid, 'cs', p.name, coalesce(p.description, '')),
         (fid, 'en', p.name, coalesce(p.description, ''));

  if not v.is_frozen then
    update public.product_versions
    set computed = n, is_frozen = true, published_at = now(), updated_at = now()
    where id = v.id;
  end if;

  update public.products
  set status = 'published', food_id = fid, review_note = null, updated_at = now()
  where id = p.id;

  insert into public.audit_log (org_id, user_id, action, entity, entity_id, diff)
  values (p.org_id, auth.uid(), 'approve', 'product', p.id,
          jsonb_build_object('version', v.version, 'food_id', fid));
  return fid;
end;
$$;
revoke execute on function public.approve_product(uuid) from public, anon;
grant execute on function public.approve_product(uuid) to authenticated;

create or replace function public.reject_product(p_product_id uuid, p_note text)
returns void language plpgsql security definer set search_path = public as $$
declare
  org uuid;
begin
  if not public.is_admin() then
    raise exception 'Zamítat produkty může jen admin.';
  end if;
  update public.products
  set status = 'rejected', review_note = p_note, updated_at = now()
  where id = p_product_id
  returning org_id into org;
  if not found then
    raise exception 'Produkt nenalezen.';
  end if;
  insert into public.audit_log (org_id, user_id, action, entity, entity_id, diff)
  values (org, auth.uid(), 'reject', 'product', p_product_id, jsonb_build_object('note', p_note));
end;
$$;
revoke execute on function public.reject_product(uuid, text) from public, anon;
grant execute on function public.reject_product(uuid, text) to authenticated;
