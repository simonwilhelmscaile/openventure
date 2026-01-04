import { LandingPage } from '@/components/landing';
import { loadLandingContent, loadArticlePreviews, getVentureMetadata } from '@/lib/content/loader';
import { SchemaScript } from '@/components/layout/SchemaScript';
import { generateHomeMeta, generateHomePageSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMeta();
}

export default function Home() {
  const content = loadLandingContent();
  const schema = generateHomePageSchema();
  const articles = loadArticlePreviews();
  const metadata = getVentureMetadata();

  return (
    <>
      <SchemaScript schema={schema} />
      <LandingPage
        content={content}
        articles={articles.length > 0 ? articles : undefined}
        domain={metadata.domain}
      />
    </>
  );
}
