import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";
import { BlogCover } from "../components/BlogCover";
import { BlogPost, formatPostDate, getBlogPosts, normalizeText } from "../lib/blog";

const filterChipClass = (active: boolean) =>
  `flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors ${
    active
      ? "border-navy bg-navy text-fg-0"
      : "border-hairline bg-surface text-fg-4 hover:border-strong"
  }`;

export const BlogListPage = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const posts = getBlogPosts(i18n.language);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
  const tags = [...new Set(posts.flatMap((post) => post.tags))];

  const q = normalizeText(query.trim());
  const filtered = posts.filter((post) => {
    if (category && post.category !== category) return false;
    if (tag && !post.tags.includes(tag)) return false;
    if (q) {
      const haystack = normalizeText(
        [post.title, post.excerpt, post.category, post.tags.join(" "), post.content].join(" "),
      );
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const isFiltering = q !== "" || category !== null || tag !== null;
  const featured = isFiltering ? undefined : filtered[0];
  const gridPosts = isFiltering ? filtered : filtered.slice(1);

  const metaLine = (post: BlogPost) =>
    `${post.category} · ${formatPostDate(post.date, i18n.language)} · ${post.readingMinutes} ${t("blog_section.min_read")}`;

  return (
    <div className="min-h-screen bg-app-2">
      <SharedNav />

      <main className="mx-auto w-full max-w-[1020px] px-5 py-12 sm:px-8 lg:py-16">
        <header className="mb-10 max-w-[640px]">
          <h1 className="mb-3 text-[36px] font-extrabold leading-[1.1] tracking-[-0.015em] text-fg-1 lg:text-[46px]">
            {t("blog_page.title")}
          </h1>
          <p className="text-[17px] leading-[1.6] text-fg-5">{t("blog_page.subtitle")}</p>
        </header>

        <div className="mb-10 flex flex-col gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("blog_page.search_placeholder")}
            aria-label={t("blog_page.search_placeholder")}
            className="h-12 w-full max-w-[420px] rounded-card border border-hairline bg-surface px-5 text-[15px] text-fg-1 placeholder:text-fg-6 focus:border-strong focus:outline-none"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setCategory(null)} className={filterChipClass(category === null)}>
              {t("blog_page.filter_all")}
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(category === c ? null : c)}
                data-umami-event={`blog-filtr-${c}`}
                className={filterChipClass(category === c)}
              >
                {c}
              </button>
            ))}

            {tags.length > 0 && <span aria-hidden="true" className="mx-1 h-5 w-px bg-hairline" />}

            {tags.map((tg) => (
              <button
                key={tg}
                type="button"
                onClick={() => setTag(tag === tg ? null : tg)}
                data-umami-event={`blog-tag-${tg}`}
                className={filterChipClass(tag === tg)}
              >
                #{tg}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <Link
            to={`/blog/${featured.slug}`}
            data-umami-event={`blog-clanek-${featured.slug}`}
            className="group mb-8 grid overflow-hidden rounded-feature bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted lg:grid-cols-[5fr_6fr]"
          >
            <BlogCover
              emoji={featured.emoji}
              accent={featured.accent}
              image={featured.image}
              imageAlt={featured.imageAlt}
              imagePosition={featured.imagePosition}
              className="h-52 lg:h-full lg:min-h-[300px]"
              badgeClassName="h-24 w-24 rounded-[28px] text-[46px]"
            />

            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="mb-3 text-[13px] font-medium text-fg-6">{metaLine(featured)}</p>
              <h2 className="mb-3 text-[24px] font-extrabold leading-[1.2] tracking-[-0.01em] text-fg-1 sm:text-[28px]">
                {featured.title}
              </h2>
              <p className="text-[15px] leading-[1.65] text-fg-5">{featured.excerpt}</p>
            </div>
          </Link>
        )}

        {gridPosts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {gridPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                data-umami-event={`blog-clanek-${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-feature bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
              >
                <BlogCover emoji={post.emoji} accent={post.accent} image={post.image} imageAlt={post.imageAlt} imagePosition={post.imagePosition} className="h-44" />

                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2.5 text-[13px] font-medium text-fg-6">{metaLine(post)}</p>
                  <h2 className="mb-2 text-lg font-extrabold leading-snug tracking-[-0.01em] text-fg-1">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-fg-5">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {isFiltering && filtered.length === 0 && (
          <p className="py-10 text-[15px] text-fg-5">{t("blog_page.no_results")}</p>
        )}
      </main>
    </div>
  );
};
