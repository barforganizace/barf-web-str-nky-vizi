-- Automatický anglický překlad článků blogu.
-- Po vložení nebo změně českého článku zavolá databáze přes pg_net edge
-- funkci translate-article (supabase/functions/translate-article), která ho
-- přeloží Claudem a zapíše/přepíše anglický řádek se stejným slugem.
-- Anglické řádky trigger nespouští, takže nevzniká smyčka.
-- Autorizace anon klíčem: je veřejný (je v bundlu webu), funkce má verify_jwt
-- a jen překládá existující české řádky, takže zneužití nic nerozbije.

create extension if not exists pg_net;

create or replace function public.tg_translate_article()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url := 'https://nhkxabxbgjwjsujetpcx.supabase.co/functions/v1/translate-article',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oa3hhYnhiZ2p3anN1amV0cGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNzQ0ODcsImV4cCI6MjA5NTc1MDQ4N30.mb_1KZMzjbl5TYMscKob96rytuKlzSOixv0J72Zos3w'
    ),
    body := jsonb_build_object('id', new.id)
  );
  return new;
end;
$$;
revoke execute on function public.tg_translate_article() from public, anon, authenticated;

create trigger articles_translate_insert
  after insert on public.articles
  for each row
  when (new.lang = 'cs')
  execute function public.tg_translate_article();

create trigger articles_translate_update
  after update on public.articles
  for each row
  when (new.lang = 'cs' and to_jsonb(new) - 'updated_at' is distinct from to_jsonb(old) - 'updated_at')
  execute function public.tg_translate_article();

-- Stávající anglické články dostanou slug shodný s českým protějškem, aby je
-- překlad při další úpravě přepsal místo založení duplicitu a aby přepnutí
-- jazyka na stránce článku našlo protějšek.
update public.articles set slug = 'co-je-barf-dieta' where lang = 'en' and slug = 'what-is-the-barf-diet';
update public.articles set slug = 'jak-funguje-kouc' where lang = 'en' and slug = 'how-the-coach-works';
update public.articles set slug = 'kolik-kosti-ma-pes-jist' where lang = 'en' and slug = 'how-many-bones-should-a-dog-eat';
