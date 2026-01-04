import Link from 'next/link';
import type { Article } from '@/lib/content/types';

interface RelatedArticlesProps {
  articles: Article[];
  currentSlug: string;
}

export function RelatedArticles({ articles, currentSlug }: RelatedArticlesProps) {
  // Filter out current article and get up to 3 related
  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[var(--border-default)] pt-12">
      <h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">
        Related Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-[#1B1B1B]">
              <span className="px-4 text-center text-sm font-semibold text-white/90 line-clamp-3">
                {article.Headline}
              </span>
            </div>
            {article.category && (
              <span className="mb-2 inline-block rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                {article.category}
              </span>
            )}
            <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {article.Headline}
            </h3>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              {article.read_time} min read
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
