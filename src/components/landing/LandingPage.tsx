import type { LandingPageContent } from '@/types';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { FeatureShowcase } from './FeatureShowcase';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
import { FAQ } from './FAQ';
import { CTA } from './CTA';
import { Footer } from './Footer';

interface ArticlePreviewData {
  title: string;
  category?: string;
  date: string;
}

interface LandingPageProps {
  content: LandingPageContent;
  articles?: ArticlePreviewData[];
  domain?: string;
  industry?: string;
  primaryColor?: string;
}

export function LandingPage({ content, articles, domain, industry, primaryColor }: LandingPageProps) {
  // Extract tagline from hero subtitle or use venture name
  const tagline = content.hero.subheadline?.split('.')[0] || content.venture_name;

  return (
    <>
      <Navigation brandName={content.venture_name} />
      <main className="pt-16"> {/* Add padding for fixed nav */}
        <Hero content={content.hero} />
        <SocialProof content={content.social_proof} />
        <section id="features">
          <Features content={content.features} />
        </section>
        <section id="showcase">
          <FeatureShowcase
            content={content.feature_showcase}
            ventureName={content.venture_name}
            tagline={tagline}
            articles={articles}
            domain={domain}
            industry={industry}
            primaryColor={primaryColor}
          />
        </section>
        <section id="pricing">
          <Pricing content={content.pricing} />
        </section>
        <Testimonials content={content.testimonials} />
        <section id="faq">
          <FAQ content={content.faq} />
        </section>
        <CTA content={content.cta} />
        <Footer content={content.footer} companyName={content.venture_name} />
      </main>
    </>
  );
}
