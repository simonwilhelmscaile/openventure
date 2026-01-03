'use client';

import type { HeroContent } from '@/types';

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        {content.badge && (
          <span className="mb-6 inline-block rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary)]">
            {content.badge}
          </span>
        )}

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl xl:text-7xl" style={{ lineHeight: 1.1 }}>
          {content.headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-secondary)] md:text-xl" style={{ lineHeight: 1.5 }}>
          {content.subheadline}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={content.primary_cta.href}
            onClick={(e) => handleClick(e, content.primary_cta.href)}
            className="btn-primary"
          >
            {content.primary_cta.text}
          </a>
          {content.secondary_cta && (
            <a
              href={content.secondary_cta.href}
              onClick={(e) => handleClick(e, content.secondary_cta?.href ?? '')}
              className="btn-secondary"
            >
              {content.secondary_cta.text}
            </a>
          )}
        </div>

        {content.image_url && (
          <div className="mt-16">
            <img
              src={content.image_url}
              alt="Product preview"
              className="mx-auto rounded-xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
