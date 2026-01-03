import type { Article } from '@/lib/content/types';
import { ArticleCard } from './ArticleCard';

interface BlogListProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
}

export function BlogList({ articles, title, subtitle }: BlogListProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h1 className="text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-[var(--text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
