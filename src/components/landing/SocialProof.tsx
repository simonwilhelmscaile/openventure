import type { SocialProofContent } from '@/types';

interface SocialProofProps {
  content: SocialProofContent;
}

export function SocialProof({ content }: SocialProofProps) {
  return (
    <section className="border-y border-[var(--border-default)] bg-[var(--bg-secondary)] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        {content.headline && (
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
            {content.headline}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {content.logos.map((logo, index) => (
            <div
              key={index}
              className="flex h-8 items-center opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              {logo.logo_url ? (
                <img
                  src={logo.logo_url}
                  alt={logo.alt}
                  className="h-full w-auto max-w-[120px] object-contain"
                />
              ) : (
                <div className="flex h-8 items-center justify-center rounded bg-[var(--bg-tertiary)] px-4">
                  <span className="text-sm font-medium text-[var(--text-tertiary)]">
                    {logo.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
