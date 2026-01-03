import type { FeatureShowcaseContent, FeatureShowcase as FeatureShowcaseType } from '@/types';
import { ConfigPreview, ArticlesPreview, DeployPreview } from '@/components/previews';

interface FeatureShowcaseProps {
  content: FeatureShowcaseContent;
}

function getPreviewComponent(showcaseId: string): React.ReactNode {
  // Match showcase IDs to preview components
  if (showcaseId.includes('showcase-1') || showcaseId.toLowerCase().includes('config')) {
    return <ConfigPreview />;
  }
  if (showcaseId.includes('showcase-2') || showcaseId.toLowerCase().includes('article') || showcaseId.toLowerCase().includes('blog')) {
    return <ArticlesPreview />;
  }
  if (showcaseId.includes('showcase-3') || showcaseId.toLowerCase().includes('deploy')) {
    return <DeployPreview />;
  }
  // Default to config preview for first, articles for second, deploy for third
  return null;
}

function ShowcaseItem({ showcase, index }: { showcase: FeatureShowcaseType; index: number }) {
  const isImageLeft = showcase.image_position === 'left';

  // Get dynamic preview based on showcase id or fallback to index-based
  const previewComponent = getPreviewComponent(showcase.id) || (
    index === 0 ? <ConfigPreview /> :
    index === 1 ? <ArticlesPreview /> :
    <DeployPreview />
  );

  return (
    <div className={`flex flex-col items-center gap-12 lg:flex-row ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
      <div className="w-full lg:w-1/2">
        <div className="aspect-video overflow-hidden rounded-xl bg-[var(--bg-secondary)] shadow-xl">
          {showcase.image_url ? (
            <img
              src={showcase.image_url}
              alt={showcase.headline}
              className="h-full w-full object-cover"
            />
          ) : showcase.video_url ? (
            <video
              src={showcase.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            previewComponent
          )}
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <h3 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
          {showcase.headline}
        </h3>

        <p className="mt-2 text-lg text-[var(--color-primary)]">
          {showcase.subheadline}
        </p>

        <p className="mt-4 text-[var(--text-secondary)]" style={{ lineHeight: 1.7 }}>
          {showcase.description}
        </p>

        <ul className="mt-6 space-y-3">
          {showcase.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--text-secondary)]">{bullet}</span>
            </li>
          ))}
        </ul>

        {showcase.cta && (
          <a href={showcase.cta.href} className="btn-primary mt-8 inline-flex">
            {showcase.cta.text}
          </a>
        )}
      </div>
    </div>
  );
}

export function FeatureShowcase({ content }: FeatureShowcaseProps) {
  return (
    <section className="bg-[var(--bg-secondary)] py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="space-y-24 md:space-y-32">
          {content.showcases.map((showcase, index) => (
            <ShowcaseItem key={showcase.id} showcase={showcase} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
