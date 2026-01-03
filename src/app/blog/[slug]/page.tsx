import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/content/articles';
import { getVentureMetadata } from '@/lib/content/loader';
import { ArticleRenderer } from '@/components/blog/ArticleRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const venture = getVentureMetadata();

  if (!article) {
    return {
      title: `Article Not Found | ${venture.name} Blog`,
    };
  }

  return {
    title: `${article.Headline} | ${venture.name} Blog`,
    description: article.Subtitle,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const venture = getVentureMetadata();

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-[var(--text-primary)]">
            {venture.name}
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <ArticleRenderer article={article} />

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-tertiary)]">
          <p>&copy; {new Date().getFullYear()} {venture.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
