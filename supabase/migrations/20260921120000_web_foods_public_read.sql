-- Katalog surovin na webu barfingapp.com/suroviny. Web běží pod anon klíčem
-- (návštěvník není přihlášený), takže potřebuje číst aktivní řádky foods a
-- jejich překlady. Zápis zůstává jen pro přihlášené / admina.

create policy "Anyone can view active foods"
  on public.foods for select to anon
  using (is_active = true);

create policy "Anyone can view translations of active foods"
  on public.food_translations for select to anon
  using (exists (select 1 from public.foods f where f.id = food_id and f.is_active));
