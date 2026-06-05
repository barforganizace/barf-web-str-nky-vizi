import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";
import { posts } from "../data/posts";

export const ArticlePage = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const index = posts.findIndex((p) => p.id === id);
  const post = posts[index];
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f2f4f7]">
        <SharedNav />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-4xl">📰</p>
          <h1 className="text-2xl font-semibold text-gray-700">{t("news.no_results")}</h1>
          <Link to="/novinky" className="text-[#506600] underline hover:opacity-70">
            {t("article.back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <SharedNav />

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[780px] items-center gap-4 px-6 py-3">
          <button
            onClick={() => navigate("/novinky")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("article.back")}
          </button>
          <span className="text-gray-300">/</span>
          <span className="line-clamp-1 text-sm text-gray-400">{post.title}</span>
        </div>
      </div>

      <main className="mx-auto max-w-[780px] px-6 py-12">
        <div className="mb-10 overflow-hidden rounded-3xl">
          <img src={post.image} alt={post.title} className="h-[280px] w-full object-cover sm:h-[360px]" />
        </div>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${post.categoryColor}`}>
              {post.category}
            </span>
            <span className="text-sm text-gray-400">{post.date}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">{post.readTime}</span>
          </div>
          <h1 className="mb-5 [font-family:'Inter',Helvetica] text-[28px] font-semibold leading-snug tracking-[-0.5px] text-[#191c1d] sm:text-[36px]">
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed text-gray-500">{post.perex}</p>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#506600]">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            {t("news.source")}:{" "}
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#506600] hover:underline">
              {post.source}
            </a>
          </div>
        </header>

        <div className="mb-10 h-px bg-gray-200" />

        <article className="[font-family:'Inter',Helvetica] text-[16.5px] leading-relaxed">
          {post.content}
        </article>

        <div className="mt-14 h-px bg-gray-200" />

        <nav className="mt-8 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link to={`/novinky/${prev.id}`} className="group flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#c3e366] hover:shadow-sm">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                {t("article.prev")}
              </span>
              <span className="line-clamp-2 text-sm font-medium text-gray-700 group-hover:text-[#506600]">{prev.title}</span>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/novinky/${next.id}`} className="group flex flex-col items-end gap-1 rounded-2xl border border-gray-200 bg-white p-5 text-right transition-all hover:border-[#c3e366] hover:shadow-sm">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("article.next")}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
              <span className="line-clamp-2 text-sm font-medium text-gray-700 group-hover:text-[#506600]">{next.title}</span>
            </Link>
          ) : <div />}
        </nav>

        <div className="mt-8 text-center">
          <Link to="/novinky" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-[#c3e366] hover:text-gray-900">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("article.back_all")}
          </Link>
        </div>
      </main>
    </div>
  );
};
