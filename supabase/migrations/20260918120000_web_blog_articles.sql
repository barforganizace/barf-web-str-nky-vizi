-- Články blogu na webu barfingapp.com/blog. Nahrazuje Markdown soubory
-- v src/content/blog/* — obsah se teď píše/upravuje přímo v téhle tabulce
-- (i z chatu na claude.ai přes Supabase konektor), web ho jen čte.
-- Zápis nemá RLS politiku, takže jde jen přes Supabase konektor/dashboard
-- (service role), ne přes anon/authenticated klíč webu.

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  lang text not null check (lang in ('cs', 'en')),
  title text not null,
  excerpt text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  emoji text not null default '🐾',
  accent text not null default 'lime' check (accent in ('lime', 'navy', 'mist')),
  image text,
  image_alt text,
  image_position text,
  content text not null,
  published boolean not null default true,
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, lang)
);

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.tg_set_updated_at();

alter table public.articles enable row level security;

create policy "Kdokoli čte publikované články"
  on public.articles for select
  to anon, authenticated
  using (published);
