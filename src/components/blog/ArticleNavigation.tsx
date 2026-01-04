import Link from 'next/link';
import type { Article } from '@/lib/content/types';

interface ArticleNavigationProps {
  previousArticle?: Article;
  nextArticle?: Article;
}

export function ArticleNavigation({ previousArticle, nextArticle }: ArticleNavigationProps) {
  if (!previousArticle && !nextArticle) return null;

  return (
    <nav className="mt-12 grid gap-4 md:grid-cols-2" aria-label="Article navigation">
      {previousArticle ? (
        <Link
          href={`/blog/${previousArticle.slug}`}
          className="group flex flex-col rounded-xl border border-[var(--border-default)] p-4 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-secondary)]"
        >
          <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
          <span className="mt-1 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary)] line-clamp-2">
            {previousArticle.Headline}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {nextArticle && (
        <Link
          href={`/blog/${nextArticle.slug}`}
          className="group flex flex-col items-end rounded-xl border border-[var(--border-default)] p-4 text-right transition-all hover:border-[var(--color-primary)] hover:bg-[var(--bg-secondary)]"
        >
          <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            Next
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span className="mt-1 text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-primary)] line-clamp-2">
            {nextArticle.Headline}
          </span>
        </Link>
      )}
    </nav>
  );
}
