import { getAllArticles } from '@/lib/content/articles';
import { getVentureMetadata } from '@/lib/content/loader';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SchemaScript } from '@/components/layout/SchemaScript';
import { generateBlogMeta, generateBlogPageSchema } from '@/lib/seo';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateBlogMeta();
}

export default function BlogPage() {
  const articles = getAllArticles();
  const venture = getVentureMetadata();
  const [featuredArticle, ...otherArticles] = articles;
  const schema = generateBlogPageSchema();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Schema.org JSON-LD */}
      <SchemaScript schema={schema} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-[var(--text-primary)] py-2 min-h-[44px] flex items-center">
            {venture.name}
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] px-3 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--text-primary)] px-3 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { name: 'Home', path: '/' },
                { name: 'Blog' },
              ]}
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
              The {venture.name} Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
              Insights, strategies, and resources to help you launch and grow your venture faster.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
              Featured
            </h2>
            <ArticleCard article={featuredArticle} featured />
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="pb-16 pt-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
            Latest Articles
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-[var(--border-default)] bg-[var(--bg-secondary)] py-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Stay Updated
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
            Get the latest insights on launching your venture delivered straight to your inbox.
          </p>
          <div className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address for newsletter subscription"
              className="flex-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)]"
            />
            <button className="btn-primary" aria-label="Subscribe to newsletter">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-tertiary)]">
          <p>&copy; {new Date().getFullYear()} {venture.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
