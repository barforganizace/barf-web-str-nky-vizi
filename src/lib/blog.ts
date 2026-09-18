import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  emoji: string;
  accent: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  readingMinutes: number;
  content: string;
};

type ArticleRow = {
  slug: string;
  title: string;
  published_at: string;
  excerpt: string;
  category: string;
  tags: string[];
  emoji: string;
  accent: string;
  image: string | null;
  image_alt: string | null;
  image_position: string | null;
  content: string;
};

const toBlogPost = (row: ArticleRow): BlogPost => ({
  slug: row.slug,
  title: row.title,
  date: row.published_at,
  excerpt: row.excerpt,
  category: row.category,
  tags: row.tags,
  emoji: row.emoji,
  accent: row.accent,
  image: row.image ?? undefined,
  imageAlt: row.image_alt ?? undefined,
  imagePosition: row.image_position ?? undefined,
  readingMinutes: Math.max(1, Math.round(row.content.split(/\s+/).length / 200)),
  content: row.content,
});

type Lang = "cs" | "en";

const toLang = (lang: string): Lang => (lang.startsWith("en") ? "en" : "cs");

const cache: Partial<Record<Lang, BlogPost[]>> = {};
const pending: Partial<Record<Lang, Promise<BlogPost[]>>> = {};

const fetchBlogPosts = (lang: Lang): Promise<BlogPost[]> => {
  if (cache[lang]) return Promise.resolve(cache[lang]!);
  if (!pending[lang]) {
    pending[lang] = Promise.resolve(
      supabase
        .from("articles")
        .select(
          "slug, title, published_at, excerpt, category, tags, emoji, accent, image, image_alt, image_position, content",
        )
        .eq("lang", lang)
        .order("published_at", { ascending: false }),
    ).then(({ data, error }) => {
      if (error) throw error;
      const posts = (data as ArticleRow[]).map(toBlogPost);
      cache[lang] = posts;
      return posts;
    });
  }
  return pending[lang]!;
};

/** Publikované blog příspěvky pro daný jazyk, načtené ze Supabase (tabulka articles). */
export const useBlogPosts = (lang: string): { posts: BlogPost[]; loading: boolean } => {
  const resolvedLang = toLang(lang);
  const [posts, setPosts] = useState<BlogPost[]>(() => cache[resolvedLang] ?? []);
  const [loading, setLoading] = useState(!cache[resolvedLang]);

  useEffect(() => {
    let cancelled = false;
    setLoading(!cache[resolvedLang]);
    fetchBlogPosts(resolvedLang).then((result) => {
      if (!cancelled) {
        setPosts(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [resolvedLang]);

  return { posts, loading };
};

/** Malá písmena bez diakritiky — hledání pak najde „Kouč" i při zadání „kouc". */
export const normalizeText = (text: string): string =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const formatPostDate = (date: string, lang: string): string =>
  new Date(date).toLocaleDateString(lang.startsWith("en") ? "en-US" : "cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
