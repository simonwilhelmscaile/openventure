import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/content/types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

function ArticleThumbnail({ title, imageUrl, imageAlt }: { title: string; imageUrl?: string; imageAlt?: string }) {
  if (imageUrl) {
    return (
      <div className="relative h-48 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-48 items-center justify-center rounded-lg bg-[#1B1B1B] p-6">
      <span className="text-center text-lg font-semibold text-white/90 line-clamp-3">
        {title}
      </span>
    </div>
  );
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formattedDate = new Date(article.publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="group block overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] transition-all hover:shadow-lg"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {article.hero_image ? (
            <div className="relative h-64 md:h-auto min-h-[256px]">
              <Image
                src={article.hero_image}
                alt={article.hero_image_alt || article.Headline}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-64 md:h-auto items-center justify-center bg-[#1B1B1B] p-8">
              <span className="text-center text-2xl font-bold text-white/90 line-clamp-4 group-hover:text-white transition-colors">
                {article.Headline}
              </span>
            </div>
          )}
          <div className="p-8 flex flex-col justify-center">
            {article.category && (
              <span className="mb-3 inline-block w-fit rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                {article.category}
              </span>
            )}
            <h2 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors">
              {article.Headline}
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] line-clamp-3">
              {article.Subtitle}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
              <time>{formattedDate}</time>
              <span>-</span>
              <span>{article.read_time} min read</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <ArticleThumbnail title={article.Headline} imageUrl={article.thumbnail} imageAlt={article.hero_image_alt} />
      <div className="p-6">
        {article.category && (
          <span className="mb-2 inline-block rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
            {article.category}
          </span>
        )}
        <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-2">
          {article.Headline}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
          {article.Subtitle}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
          <time>{formattedDate}</time>
          <span>-</span>
          <span>{article.read_time} min read</span>
        </div>
      </div>
    </Link>
  );
}
