import { LandingPage } from '@/components/landing';
import { loadLandingContent } from '@/lib/content/loader';

export default function Home() {
  const content = loadLandingContent();
  return <LandingPage content={content} />;
}
