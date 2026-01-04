import { StaticPage } from '@/components/layout/StaticPage';
import { generateStaticPageMeta } from '@/lib/seo';
import { getVentureMetadata } from '@/lib/content/loader';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMeta('careers');
}

export default function CareersPage() {
  const venture = getVentureMetadata();

  return (
    <StaticPage title={`Careers at ${venture.name}`}>
      <p>
        We&apos;re building the future of startup creation. Join us in democratizing entrepreneurship
        through the power of AI.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Why {venture.name}?</h2>
      <p>
        At {venture.name}, you&apos;ll work on cutting-edge AI technology that directly impacts entrepreneurs
        worldwide. We&apos;re a small, focused team where your contributions make a real difference.
      </p>

      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>Work with the latest AI and web technologies</li>
        <li>Remote-first culture with flexible hours</li>
        <li>Competitive compensation and equity</li>
        <li>Direct impact on product and company direction</li>
      </ul>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Open Positions</h2>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-[var(--border-default)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Senior Full-Stack Engineer</h3>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">Remote · Full-time</p>
          <p className="mt-3">
            Build and scale our AI-powered generation platform using Next.js, TypeScript, and Google&apos;s Gemini API.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-default)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">AI/ML Engineer</h3>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">Remote · Full-time</p>
          <p className="mt-3">
            Improve our content generation quality through prompt engineering and fine-tuning.
          </p>
        </div>

        <div className="rounded-lg border border-[var(--border-default)] p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Growth Marketing Lead</h3>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">Remote · Full-time</p>
          <p className="mt-3">
            Drive user acquisition and help more entrepreneurs discover {venture.name}.
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">How to Apply</h2>
      <p>
        Send your resume and a brief note about why you&apos;re excited about {venture.name} to careers@{venture.domain}.
        We read every application personally.
      </p>
    </StaticPage>
  );
}
