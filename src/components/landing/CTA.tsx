import type { CTAContent } from '@/types';

interface CTAProps {
  content: CTAContent;
}

export function CTA({ content }: CTAProps) {
  // Superhuman style: solid dark background or minimal light
  const bgClass = content.background_style === 'gradient' || content.background_style === 'solid'
    ? 'bg-[#1B1B1B]'  // Superhuman's cod-gray
    : 'bg-[var(--bg-secondary)]';

  const textClass = content.background_style === 'minimal'
    ? 'text-[var(--text-primary)]'
    : 'text-white';

  const subTextClass = content.background_style === 'minimal'
    ? 'text-[var(--text-secondary)]'
    : 'text-white/70';

  return (
    <section className={`${bgClass} py-24 md:py-32`}>
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <h2 className={`text-3xl font-bold md:text-4xl lg:text-5xl ${textClass}`}>
          {content.headline}
        </h2>

        {content.subheadline && (
          <p className={`mx-auto mt-6 max-w-2xl text-lg ${subTextClass}`}>
            {content.subheadline}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {content.background_style === 'minimal' ? (
            <>
              <a href={content.primary_cta.href} className="btn-primary">
                {content.primary_cta.text}
              </a>
              {content.secondary_cta && (
                <a href={content.secondary_cta.href} className="btn-secondary">
                  {content.secondary_cta.text}
                </a>
              )}
            </>
          ) : (
            <>
              <a
                href={content.primary_cta.href}
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 h-[44px] font-medium text-[#1B1B1B] transition-all hover:opacity-90 hover:-translate-y-0.5"
              >
                {content.primary_cta.text}
              </a>
              {content.secondary_cta && (
                <a
                  href={content.secondary_cta.href}
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 h-[44px] font-medium text-white transition-all hover:bg-white/10"
                >
                  {content.secondary_cta.text}
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
