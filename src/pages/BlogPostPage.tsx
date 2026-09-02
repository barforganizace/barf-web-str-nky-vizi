import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { SharedNav } from "../components/SharedNav";
import { BlogCover } from "../components/BlogCover";
import { GlossaryTerm } from "../components/GlossaryTerm";
import { formatPostDate, getBlogPost, getBlogPosts } from "../lib/blog";
import { NotFoundPage } from "./NotFoundPage";

const GLOSSARY_PREFIX = "#pojem:";

/** Odkazy tvaru [text](#pojem:slug) se renderují jako bublina se slovníčkem. */
const markdownComponents = {
  a: ({ href, children }: { href?: string; children?: ReactNode }) =>
    href?.startsWith(GLOSSARY_PREFIX) ? (
      <GlossaryTerm slug={href.slice(GLOSSARY_PREFIX.length)}>{children}</GlossaryTerm>
    ) : (
      <a href={href}>{children}</a>
    ),
};

/** Tenká lišta nahoře ukazující postup čtení. */
const ReadingProgress = (): JSX.Element => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(1, window.scrollY / total) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div aria-hidden="true" className="fixed left-0 top-0 z-[60] h-[3px] w-full">
      <div className="h-full bg-lime" style={{ width: `${progress * 100}%` }} />
    </div>
  );
};

export const BlogPostPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const post = slug ? getBlogPost(i18n.language, slug) : undefined;

  if (!post) return <NotFoundPage />;

  const posts = getBlogPosts(i18n.language);
  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const nextPost = posts.length > 1 ? posts[(currentIndex + 1) % posts.length] : undefined;

  return (
    <div className="min-h-screen bg-app-2">
      <ReadingProgress />
      <SharedNav />

      <main className="mx-auto w-full max-w-[720px] px-5 py-12 sm:px-8 lg:py-16">
        <Link
          to="/blog"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-fg-5 transition-colors hover:text-navy"
        >
          ← {t("blog_page.back")}
        </Link>

        <header className="mb-8">
          <p className="mb-4 text-sm font-medium text-fg-6">
            {post.category} · {formatPostDate(post.date, i18n.language)} · {post.readingMinutes}{" "}
            {t("blog_section.min_read")}
          </p>

          <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-[-0.015em] text-fg-1 lg:text-[42px]">
            {post.title}
          </h1>
        </header>

        <div className="group mb-10">
          <BlogCover
            emoji={post.emoji}
            accent={post.accent}
            image={post.image}
            imageAlt={post.imageAlt}
            imagePosition={post.imagePosition ?? "50% 80%"}
            className="h-[408px] rounded-feature shadow-soft sm:h-[456px]"
            badgeClassName="h-24 w-24 rounded-[28px] text-[46px]"
          />
        </div>

        <div className="blog-prose">
          <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-14 rounded-feature bg-navy px-7 py-10 text-center sm:px-10">
          <h2 className="mb-2.5 text-[22px] font-extrabold tracking-[-0.01em] text-fg-0 sm:text-[26px]">
            {t("blog_page.cta_title")}
          </h2>
          <p className="mx-auto mb-7 max-w-[420px] text-[15px] leading-relaxed text-white/65">
            {t("blog_page.cta_desc")}
          </p>
          <a
            href="/#stahnout"
            data-umami-event="blog-cta-stahnout"
            className="inline-flex h-12 items-center justify-center rounded-card bg-lime px-7 text-sm font-bold text-navy transition-opacity hover:opacity-90"
          >
            {t("blog_page.cta_btn")}
          </a>
        </div>

        {nextPost && (
          <div className="mt-10 border-t border-hairline pt-10">
            <p className="mb-4 text-sm font-bold text-fg-1">{t("blog_page.next_article")}</p>
            <Link
              to={`/blog/${nextPost.slug}`}
              data-umami-event={`blog-dalsi-${nextPost.slug}`}
              className="group flex items-center gap-5 rounded-feature bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lifted sm:gap-6"
            >
              <BlogCover
                emoji={nextPost.emoji}
                accent={nextPost.accent}
                image={nextPost.image}
                imageAlt={nextPost.imageAlt}
                imagePosition={nextPost.imagePosition}
                className="h-24 w-24 shrink-0 rounded-panel sm:h-28 sm:w-28"
                badgeClassName="h-12 w-12 rounded-[14px] text-[22px]"
              />
              <div className="min-w-0">
                <p className="mb-1.5 text-xs font-medium text-fg-6">
                  {nextPost.category} · {nextPost.readingMinutes} {t("blog_section.min_read")}
                </p>
                <h3 className="text-[17px] font-extrabold leading-snug tracking-[-0.01em] text-fg-1">
                  {nextPost.title}
                </h3>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
