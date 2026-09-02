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

const rawFiles = import.meta.glob("/src/content/blog/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const parsePost = (path: string, raw: string): { lang: string; post: BlogPost } => {
  const match = path.match(/\/blog\/(cs|en)\/([^/]+)\.md$/);
  if (!match) throw new Error(`Neočekávaná cesta k blog příspěvku: ${path}`);
  const [, lang, slug] = match;

  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) throw new Error(`Chybí frontmatter v příspěvku: ${path}`);
  const [, frontmatter, content] = frontmatterMatch;

  const fields: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const fieldMatch = line.match(/^(\w+):\s*"?(.*?)"?$/);
    if (fieldMatch) fields[fieldMatch[1]] = fieldMatch[2];
  }

  const body = content.trim();
  const wordCount = body.split(/\s+/).length;

  return {
    lang,
    post: {
      slug,
      title: fields.title ?? slug,
      date: fields.date ?? "",
      excerpt: fields.excerpt ?? "",
      category: fields.category ?? "",
      tags: fields.tags ? fields.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      emoji: fields.emoji ?? "🐾",
      accent: fields.accent ?? "lime",
      image: fields.image,
      imageAlt: fields.image_alt,
      imagePosition: fields.image_position,
      readingMinutes: Math.max(1, Math.round(wordCount / 200)),
      content: body,
    },
  };
};

const postsByLang: Record<string, BlogPost[]> = { cs: [], en: [] };

for (const [path, raw] of Object.entries(rawFiles)) {
  const { lang, post } = parsePost(path, raw);
  postsByLang[lang]?.push(post);
}

for (const lang of Object.keys(postsByLang)) {
  postsByLang[lang].sort((a, b) => b.date.localeCompare(a.date));
}

export const getBlogPosts = (lang: string): BlogPost[] =>
  postsByLang[lang.startsWith("en") ? "en" : "cs"];

export const getBlogPost = (lang: string, slug: string): BlogPost | undefined =>
  getBlogPosts(lang).find((post) => post.slug === slug);

/** Malá písmena bez diakritiky — hledání pak najde „Kouč" i při zadání „kouc". */
export const normalizeText = (text: string): string =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const formatPostDate = (date: string, lang: string): string =>
  new Date(date).toLocaleDateString(lang.startsWith("en") ? "en-US" : "cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
