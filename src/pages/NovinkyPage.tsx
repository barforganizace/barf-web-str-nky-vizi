import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";
import { WaitlistForm } from "../components/WaitlistForm";
import { SkeletonFeatured, SkeletonCard } from "../components/SkeletonCard";
import { posts } from "../data/posts";

const CATEGORY_KEYS = ["Vše", "Výzkum", "Tipy", "Sezóna", "Začátky", "Komunita", "Věda"] as const;

const CategoryBadge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${color}`}>
    {label}
  </span>
);

export const NovinkyPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("Vše");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const CATEGORY_LABELS: Record<string, string> = {
    "Vše":      t("news.cat_all"),
    "Výzkum":   t("news.cat_research"),
    "Tipy":     t("news.cat_tips"),
    "Sezóna":   t("news.cat_season"),
    "Začátky":  t("news.cat_beginner"),
    "Komunita": t("news.cat_community"),
    "Věda":     t("news.cat_science"),
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "Vše" || p.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ = q === "" || p.title.toLowerCase().includes(q) || p.perex.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      <div className="bg-textdark px-6 py-14 text-center">
        <p className="mb-3 [font-family:'Manrope',Helvetica] text-sm font-bold tracking-[2.5px] text-[#c3e96b]">
          {t("news.label")}
        </p>
        <h1 className="mb-4 [font-family:'Inter',Helvetica] text-[40px] font-normal leading-tight tracking-[-1.2px] text-white sm:text-[52px]">
          {t("news.title")}
        </h1>
        <p className="mb-10 text-base text-[#ffffffb8]">
          {t("news.subtitle")}
        </p>

        <div className="relative mx-auto w-full max-w-[540px]">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("news.search_placeholder")}
            className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-10 text-base text-gray-800 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#c3e96b]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1100px] gap-2 overflow-x-auto px-6 py-3">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat ? "bg-textdark text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1100px] px-6 py-12">
        {loading ? (
          <>
            <SkeletonFeatured />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            <p className="text-3xl">📰</p>
            <p className="mt-3 text-lg font-medium text-gray-700">{t("news.no_results")}</p>
            <p className="mt-1">{t("news.no_results_hint")}</p>
          </div>
        ) : (
          <>
            {featured && (
              <Link to={`/novinky/${featured.id}`} className="mb-10 block">
                <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:border-[#c3e366] hover:shadow-md">
                  <div className="flex flex-col lg:flex-row">
                    <div className="h-52 lg:h-auto lg:w-[340px] lg:shrink-0 overflow-hidden">
                      <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-10">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <CategoryBadge label={featured.category} color={featured.categoryColor} />
                        <span className="text-xs text-gray-400">{featured.date} · {featured.readTime}</span>
                      </div>
                      <h2 className="mb-3 [font-family:'Inter',Helvetica] text-[22px] font-semibold leading-snug text-textprimary sm:text-[26px]">
                        {featured.title}
                      </h2>
                      <p className="text-base leading-relaxed text-gray-500">{featured.perex}</p>
                      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-textdark px-5 py-2.5 text-sm font-semibold text-white">
                        {t("news.read_article")}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link key={post.id} to={`/novinky/${post.id}`} className="group block">
                  <article className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#c3e366] hover:shadow-md">
                    <div className="h-44 overflow-hidden">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3">
                        <CategoryBadge label={post.category} color={post.categoryColor} />
                      </div>
                      <h3 className="mb-2 flex-1 [font-family:'Inter',Helvetica] text-[16px] font-semibold leading-snug text-textprimary group-hover:text-[#506600]">
                        {post.title}
                      </h3>
                      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-500">{post.perex}</p>
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-16 rounded-3xl bg-textdark px-8 py-10 text-center">
          <p className="mb-1 text-sm font-semibold tracking-widest text-[#c3e96b]">{t("news.newsletter_label")}</p>
          <h2 className="mt-2 [font-family:'Inter',Helvetica] text-[26px] font-normal leading-tight text-white sm:text-[32px]">
            {t("news.newsletter_title")}
          </h2>
          <p className="mt-3 text-[#ffffffb8]">{t("news.newsletter_desc")}</p>
          <div className="mx-auto mt-7 w-full max-w-[420px]">
            <WaitlistForm dark />
          </div>
        </div>
      </main>
    </div>
  );
};
