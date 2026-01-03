import Link from 'next/link';
import type { Article, ArticleSection } from '@/lib/content/types';
import { getArticleSections, getKeyTakeaways } from '@/lib/content/articles';

interface ArticleRendererProps {
  article: Article;
  blogConfig?: {
    author: {
      name: string;
      title: string;
    };
  };
}

export function ArticleRenderer({ article, blogConfig }: ArticleRendererProps) {
  const sections = getArticleSections(article);
  const keyTakeaways = getKeyTakeaways(article);

  const formattedDate = new Date(article.publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const authorName = blogConfig?.author?.name || 'OpenVenture Team';
  const authorTitle = blogConfig?.author?.title || 'Content Team';

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--text-tertiary)]">
          {article.category && (
            <>
              <span className="rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-xs font-medium uppercase tracking-wide">
                {article.category}
              </span>
              <span>·</span>
            </>
          )}
          <time dateTime={article.publication_date}>{formattedDate}</time>
          <span>·</span>
          <span>{article.read_time} min read</span>
        </div>

        <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
          {article.Headline}
        </h1>

        <p className="mt-4 text-xl text-[var(--text-secondary)]">
          {article.Subtitle}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-primary)]">
            {authorName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">{authorName}</p>
            <p className="text-sm text-[var(--text-tertiary)]">{authorTitle}</p>
          </div>
        </div>
      </header>

      {/* TLDR */}
      {article.TLDR && (
        <div className="mb-12 rounded-xl bg-[var(--bg-secondary)] p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
            TL;DR
          </h2>
          <p className="text-[var(--text-secondary)]">{article.TLDR}</p>
        </div>
      )}

      {/* Key Takeaways */}
      {keyTakeaways.length > 0 && (
        <div className="mb-12 rounded-xl border border-[var(--border-default)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
            Key Takeaways
          </h2>
          <ul className="space-y-3">
            {keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--text-secondary)]">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Teaser */}
      {article.Teaser && (
        <p className="mb-8 text-xl text-[var(--text-secondary)]" style={{ lineHeight: 1.8 }}>
          {article.Teaser}
        </p>
      )}

      {/* Sections */}
      <div className="prose prose-lg max-w-none">
        {sections.map((section, index) => (
          <section key={section.id} className="mt-12">
            <h2 id={section.id} className="text-2xl font-bold text-[var(--text-primary)]">
              {section.title}
            </h2>
            <div className="mt-4 text-[var(--text-secondary)]" style={{ lineHeight: 1.8 }}>
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mt-4">{paragraph}</p>
              ))}
            </div>

            {/* Insert table after section if applicable */}
            {article.tables?.map((table) => (
              table.after_section === index + 1 && (
                <div key={table.title} className="mt-8 overflow-x-auto">
                  <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
                    {table.title}
                  </h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
                        {table.headers.map((header, i) => (
                          <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, i) => (
                        <tr key={i} className="border-b border-[var(--border-default)]">
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ))}
          </section>
        ))}
      </div>

      {/* Tables without specific position */}
      {article.tables && article.tables.filter(t => !t.after_section).length > 0 && (
        <div className="mt-12 space-y-8">
          {article.tables.filter(t => !t.after_section).map((table) => (
            <div key={table.title} className="overflow-x-auto">
              <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
                {table.title}
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
                    {table.headers.map((header, i) => (
                      <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border-default)]">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* FAQ */}
      {article.faq_items && article.faq_items.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {article.faq_items.map((faq, index) => (
              <div key={index} className="rounded-xl border border-[var(--border-default)] p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back to blog */}
      <div className="mt-16 border-t border-[var(--border-default)] pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all articles
        </Link>
      </div>
    </article>
  );
}
