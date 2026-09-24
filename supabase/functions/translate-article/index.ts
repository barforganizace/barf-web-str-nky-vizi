import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk";
import { zodOutputFormat } from "npm:@anthropic-ai/sdk/helpers/zod";
import { z } from "npm:zod";

// Volá ji databázový trigger na tabulce articles (pg_net) s { id } českého
// článku. Odpoví hned 202 a překlady do všech jazyků webu dokončí na pozadí,
// aby pg_net nečekal. Cizojazyčný řádek má stejný slug jako český, takže
// přepnutí jazyka na stránce článku najde protějšek.
// Volitelné { langs: ["de", "pl"] } v těle omezí cílové jazyky (ruční doplnění).

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

const TARGETS = ["en", "de", "es", "fr", "it", "pl"] as const;
type Target = (typeof TARGETS)[number];
const isTarget = (value: unknown): value is Target => TARGETS.includes(value as Target);

const LANGUAGE: Record<Target, string> = {
  en: "English",
  de: "German",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pl: "Polish",
};

// Kategorie slouží na blogu jako filtr, tak musí být v každém jazyce pokaždé stejná.
const CATEGORY: Record<Target, Record<string, string>> = {
  en: { Barfování: "Raw feeding", Appka: "App" },
  de: { Barfování: "Rohfütterung", Appka: "App" },
  es: { Barfování: "Alimentación cruda", Appka: "App" },
  fr: { Barfování: "Alimentation crue", Appka: "Appli" },
  it: { Barfování: "Alimentazione cruda", Appka: "App" },
  pl: { Barfování: "Surowe żywienie", Appka: "Aplikacja" },
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  emoji: string;
  accent: string;
  image: string | null;
  image_alt: string | null;
  image_position: string | null;
  content: string;
  published: boolean;
  published_at: string;
};

const Translation = z.object({
  title: z.string(),
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  image_alt: z.string().nullable(),
  content: z.string(),
});

const systemPrompt = (lang: Target) => {
  const language = LANGUAGE[lang];
  const categories = Object.entries(CATEGORY[lang])
    .map(([cs, translated]) => `"${cs}" is "${translated}"`)
    .join(", ");
  return `You translate blog posts for barfingapp.com from Czech to ${language}. The author is Kuba, a 28-year-old Czech guy who builds an app for raw feeding (BARF) dogs. Keep his voice: first person, short sentences, short paragraphs, dry self-irony, casual but grammatical ${language}. No marketing tone, no added explanations, no softening of his opinions.

Rules:
- Translate title, excerpt, category, tags, image_alt and content. Keep the Markdown exactly as structured: same headings, lists, blockquotes, bold, line breaks.
- Links of the form [text](#pojem:slug) are glossary popups: translate the link text, keep the href untouched.
- "BARF" stays "BARF". "appka" is the app. "Kouč" is the app's AI assistant — call it "Coach" (with whatever article or inflection ${language} needs) and use it consistently.
- Categories: ${categories}.
- Do not add or remove sentences. Do not add a disclaimer or notes of your own.`;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const translate = async (cs: ArticleRow, lang: Target) => {
  const response = await anthropic.messages.parse({
    model: "claude-opus-5",
    max_tokens: 16000,
    system: systemPrompt(lang),
    output_config: { format: zodOutputFormat(Translation), effort: "medium" },
    messages: [
      {
        role: "user",
        content: JSON.stringify({
          title: cs.title,
          excerpt: cs.excerpt,
          category: cs.category,
          tags: cs.tags,
          image_alt: cs.image_alt,
          content: cs.content,
        }),
      },
    ],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Překlad selhal (stop_reason: ${response.stop_reason})`);
  }
  const t = response.parsed_output;

  const { error } = await supabase.from("articles").upsert(
    {
      slug: cs.slug,
      lang,
      title: t.title,
      excerpt: t.excerpt,
      category: CATEGORY[lang][cs.category] ?? t.category,
      tags: t.tags,
      emoji: cs.emoji,
      accent: cs.accent,
      image: cs.image,
      image_alt: t.image_alt,
      image_position: cs.image_position,
      content: t.content,
      published: cs.published,
      published_at: cs.published_at,
    },
    { onConflict: "slug,lang" },
  );
  if (error) throw error;
  console.log("translate-article: přeloženo", cs.slug, lang);
};

Deno.serve(async (req: Request) => {
  let id: string | undefined;
  let langs: unknown;
  try {
    ({ id, langs } = await req.json());
  } catch {
    // bez těla
  }
  if (!id) return json({ error: "Chybí id článku" }, 400);
  const targets = Array.isArray(langs) ? langs.filter(isTarget) : [...TARGETS];

  const { data: cs, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("lang", "cs")
    .maybeSingle();
  if (error) return json({ error: error.message }, 500);
  if (!cs) return json({ error: "Český článek nenalezen" }, 404);

  EdgeRuntime.waitUntil(
    Promise.all(
      targets.map((lang) =>
        translate(cs as ArticleRow, lang).catch((e) => console.error("translate-article", cs.slug, lang, e)),
      ),
    ),
  );
  return json({ status: "queued", slug: cs.slug, langs: targets }, 202);
});
