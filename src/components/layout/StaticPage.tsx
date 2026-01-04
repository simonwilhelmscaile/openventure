import Link from 'next/link';
import { getVentureMetadata } from '@/lib/content/loader';
import { Breadcrumbs } from './Breadcrumbs';

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

export function StaticPage({ title, children }: StaticPageProps) {
  const venture = getVentureMetadata();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
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
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] px-3 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: title },
          ]}
        />
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          {title}
        </h1>
        <div className="mt-8 space-y-6 text-[var(--text-secondary)]" style={{ lineHeight: 1.8 }}>
          {children}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-tertiary)]">
          <p>&copy; {new Date().getFullYear()} {venture.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
