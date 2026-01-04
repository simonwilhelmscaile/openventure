import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/content/types';
import { getArticleSections, getKeyTakeaways } from '@/lib/content/articles';
import { loadVentureConfig, getVentureMetadata } from '@/lib/content/loader';
import { TableOfContents } from './TableOfContents';
import { ShareButtons } from './ShareButtons';
import { FAQAccordion } from './FAQAccordion';

interface ArticleRendererProps {
  article: Article;
  blogConfig?: {
    author: {
      name: string;
      title: string;
    };
  };
}

/**
 * Parse basic markdown to HTML
 * Handles: **bold**, *italic*, `code`, [links](url), and lists
 */
function parseMarkdown(text: string): string {
  let html = text;

  // Escape HTML special chars first (except for ones we'll add)
  html = html.replace(/&/g, '&amp;');

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (but not inside words)
  html = html.replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '<em>$1</em>');
  html = html.replace(/(?<!\w)_([^_]+)_(?!\w)/g, '<em>$1</em>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-sm font-mono">$1</code>');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--color-primary)] underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>');

  return html;
}

/**
 * Render paragraph content with markdown parsing
 */
function renderContent(content: string): React.ReactElement[] {
  const paragraphs = content.split('\n\n');

  return paragraphs.map((paragraph, i) => {
    const trimmed = paragraph.trim();

    // Check for unordered list
    if (trimmed.match(/^[-*]\s/m)) {
      const items = trimmed.split('\n').filter(line => line.match(/^[-*]\s/));
      return (
        <ul key={i} className="mt-4 list-disc space-y-2 pl-6">
          {items.map((item, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(item.replace(/^[-*]\s/, '')) }}
            />
          ))}
        </ul>
      );
    }

    // Check for ordered list
    if (trimmed.match(/^\d+\.\s/m)) {
      const items = trimmed.split('\n').filter(line => line.match(/^\d+\.\s/));
      return (
        <ol key={i} className="mt-4 list-decimal space-y-2 pl-6">
          {items.map((item, j) => (
            <li
              key={j}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(item.replace(/^\d+\.\s/, '')) }}
            />
          ))}
        </ol>
      );
    }

    // Regular paragraph
    return (
      <p
        key={i}
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(trimmed) }}
      />
    );
  });
}

export function ArticleRenderer({ article, blogConfig }: ArticleRendererProps) {
  const sections = getArticleSections(article);
  const keyTakeaways = getKeyTakeaways(article);
  const ventureConfig = loadVentureConfig();
  const venture = getVentureMetadata();

  const formattedDate = new Date(article.publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const authorName = blogConfig?.author?.name || ventureConfig?.blog?.author?.name || 'Content Team';
  const authorTitle = blogConfig?.author?.title || ventureConfig?.blog?.author?.role || 'Content Team';

  // Generate TOC items from sections
  const tocItems = sections.map((section) => ({
    id: section.id,
    title: section.title,
    level: 1,
  }));

  // Build article URL for sharing
  const articleUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://${venture.domain}/blog/${article.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-tertiary)]">
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
          <ShareButtons url={articleUrl} title={article.Headline} />
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

      {/* Hero Image/Visual */}
      {article.hero_image ? (
        <div className="relative mb-12 aspect-video overflow-hidden rounded-xl">
          <Image
            src={article.hero_image}
            alt={article.hero_image_alt || article.Headline}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="relative mb-12 aspect-video overflow-hidden rounded-xl bg-[#0a0a0a]">
          {/* Grid pattern background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-transparent to-[var(--color-accent)]/20" />
          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">{venture.name.charAt(0)}</span>
            </div>
            <h2 className="max-w-xl text-lg font-semibold text-white/90 line-clamp-3">
              {article.Headline}
            </h2>
          </div>
        </div>
      )}

      {/* TLDR */}
      {article.TLDR && (
        <div className="mb-12 rounded-xl bg-[var(--bg-secondary)] p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
            TL;DR
          </h2>
          <p className="text-[var(--text-secondary)]">{article.TLDR}</p>
        </div>
      )}

      {/* Table of Contents */}
      {tocItems.length > 3 && (
        <div className="mb-12 rounded-xl border border-[var(--border-default)] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
            Table of Contents
          </h2>
          <nav aria-label="Table of contents">
            <ol className="space-y-2">
              {tocItems.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-center gap-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-xs font-medium">
                      {index + 1}
                    </span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
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
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
              {renderContent(section.content)}
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
          <FAQAccordion items={article.faq_items} />
        </div>
      )}
    </article>
  );
}
