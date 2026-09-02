import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BlogCover } from "../../../../components/BlogCover";
import { formatPostDate, getBlogPosts } from "../../../../lib/blog";

export const BlogPreviewSection = (): JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const posts = getBlogPosts(i18n.language).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[1180px]">
        <header className="mb-14 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[640px]">
            <h2 className="mb-3 text-[30px] font-extrabold tracking-[-0.01em] text-fg-1 lg:text-[36px]">
              {t("blog_section.title")}
            </h2>
            <p className="text-[15px] leading-[1.6] text-fg-5">
              {t("blog_section.subtitle")}
            </p>
          </div>
          <Link
            to="/blog"
            data-umami-event="blog-zobrazit-vse"
            className="shrink-0 text-sm font-bold text-navy transition-opacity hover:opacity-70"
          >
            {t("blog_section.view_all")} →
          </Link>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              data-umami-event={`blog-clanek-${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-feature bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
            >
              <BlogCover emoji={post.emoji} accent={post.accent} image={post.image} imageAlt={post.imageAlt} imagePosition={post.imagePosition} className="h-44" />

              <div className="flex flex-1 flex-col p-6">
                <p className="mb-2.5 text-[13px] font-medium text-fg-6">
                  {post.category} · {formatPostDate(post.date, i18n.language)} · {post.readingMinutes}{" "}
                  {t("blog_section.min_read")}
                </p>
                <h3 className="mb-2 text-lg font-extrabold leading-snug tracking-[-0.01em] text-fg-1">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed text-fg-5">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
