-- Blog ve všech jazycích webu: cs, en, de, es, fr, it, pl.
-- Překlady vyrábí stejná edge funkce translate-article (teď překládá
-- do všech jazyků naráz), trigger z web_blog_translate_trigger se nemění.

alter table public.articles drop constraint articles_lang_check;
alter table public.articles
  add constraint articles_lang_check check (lang in ('cs', 'en', 'de', 'es', 'fr', 'it', 'pl'));
