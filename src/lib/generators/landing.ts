import { nanoid } from 'nanoid';
import type { VentureConfig, LandingPageContent, HeroContent, FeaturesContent, FeatureShowcaseContent, PricingContent, TestimonialsContent, FAQContent, CTAContent, FooterContent, SocialProofContent } from '@/types';
import { getGeminiClient, parseGeminiJSON } from '@/lib/gemini/client';
import {
  createHeroPrompt,
  createFeaturesPrompt,
  createFeatureShowcasesPrompt,
  createPricingPrompt,
  createTestimonialsPrompt,
  createFAQPrompt,
  createCTAPrompt,
  createFooterPrompt,
} from '@/lib/gemini/prompts';

interface GeneratorOptions {
  model?: string;
  temperature?: number;
}

export class LandingPageGenerator {
  private config: VentureConfig;
  private client: ReturnType<typeof getGeminiClient>;

  constructor(config: VentureConfig, options?: GeneratorOptions) {
    this.config = config;
    this.client = getGeminiClient({
      model: options?.model ?? config.advanced.gemini_model,
      temperature: options?.temperature ?? config.advanced.temperature,
      maxRetries: config.advanced.max_retries,
      retryDelayMs: config.advanced.rate_limit_delay_ms,
    });
  }

  async generateHero(): Promise<HeroContent> {
    const prompt = createHeroPrompt(this.config);
    const response = await this.client.generate(prompt);
    return parseGeminiJSON<HeroContent>(response);
  }

  async generateSocialProof(): Promise<SocialProofContent> {
    const logoCount = this.config.landing_page.sections.social_proof.logo_count;
    const logos = Array.from({ length: logoCount }, (_, i) => ({
      name: `Partner ${i + 1}`,
      alt: `Partner ${i + 1} logo`,
    }));

    return {
      headline: 'Trusted by innovative companies worldwide',
      logos,
    };
  }

  async generateFeatures(): Promise<FeaturesContent> {
    const count = this.config.landing_page.sections.features.count;
    const prompt = createFeaturesPrompt(this.config, count);
    const response = await this.client.generate(prompt);
    const data = parseGeminiJSON<{ features: FeaturesContent['features'] }>(response);

    return {
      headline: `Why choose ${this.config.name}?`,
      subheadline: 'Everything you need to succeed',
      features: data.features.map((f, i) => ({ ...f, id: f.id || `feature-${i + 1}` })),
    };
  }

  async generateFeatureShowcases(): Promise<FeatureShowcaseContent> {
    const count = this.config.landing_page.sections.feature_showcase.count;
    const prompt = createFeatureShowcasesPrompt(this.config, count);
    const response = await this.client.generate(prompt);
    const data = parseGeminiJSON<{ showcases: FeatureShowcaseContent['showcases'] }>(response);

    return {
      showcases: data.showcases.map((s, i) => ({
        ...s,
        id: s.id || `showcase-${i + 1}`,
        image_position: i % 2 === 0 ? 'left' : 'right',
      })),
    };
  }

  async generatePricing(): Promise<PricingContent> {
    const tierCount = this.config.landing_page.sections.pricing.tiers;
    const prompt = createPricingPrompt(this.config, tierCount);
    const response = await this.client.generate(prompt);
    const data = parseGeminiJSON<PricingContent>(response);

    return {
      ...data,
      tiers: data.tiers.map((tier, i) => ({
        ...tier,
        id: tier.id || `tier-${i + 1}`,
        highlighted: i === 1,
      })),
      billing_toggle: this.config.landing_page.sections.pricing.billing_period === 'both',
    };
  }

  async generateTestimonials(): Promise<TestimonialsContent> {
    const count = this.config.landing_page.sections.testimonials.count;
    const prompt = createTestimonialsPrompt(this.config, count);
    const response = await this.client.generate(prompt);
    const data = parseGeminiJSON<{ testimonials: TestimonialsContent['testimonials'] }>(response);

    return {
      headline: 'What our customers say',
      testimonials: data.testimonials.map((t, i) => ({ ...t, id: t.id || `testimonial-${i + 1}` })),
    };
  }

  async generateFAQ(): Promise<FAQContent> {
    const count = this.config.landing_page.sections.faq.count;
    const prompt = createFAQPrompt(this.config, count);
    const response = await this.client.generate(prompt);
    const data = parseGeminiJSON<{ items: FAQContent['items'] }>(response);

    return {
      headline: 'Frequently Asked Questions',
      subheadline: 'Everything you need to know',
      items: data.items.map((item, i) => ({ ...item, id: item.id || `faq-${i + 1}` })),
    };
  }

  async generateCTA(): Promise<CTAContent> {
    const prompt = createCTAPrompt(this.config);
    const response = await this.client.generate(prompt);
    return parseGeminiJSON<CTAContent>(response);
  }

  async generateFooter(): Promise<FooterContent> {
    const columnCount = this.config.landing_page.sections.footer.columns;
    const prompt = createFooterPrompt(this.config, columnCount);
    const response = await this.client.generate(prompt);
    return parseGeminiJSON<FooterContent>(response);
  }

  async generate(): Promise<LandingPageContent> {
    console.log('Generating landing page content...');

    const [
      hero,
      social_proof,
      features,
      feature_showcase,
      pricing,
      testimonials,
      faq,
      cta,
      footer,
    ] = await Promise.all([
      this.generateHero(),
      this.generateSocialProof(),
      this.generateFeatures(),
      this.generateFeatureShowcases(),
      this.generatePricing(),
      this.generateTestimonials(),
      this.generateFAQ(),
      this.generateCTA(),
      this.generateFooter(),
    ]);

    return {
      venture_id: nanoid(),
      venture_name: this.config.name,
      generated_at: new Date().toISOString(),
      hero,
      social_proof,
      features,
      feature_showcase,
      pricing,
      testimonials,
      faq,
      cta,
      footer,
      meta: {
        title: `${this.config.name} - ${this.config.tagline}`,
        description: this.config.business.value_proposition || this.config.tagline,
        keywords: [
          this.config.blog.seo.primary_keyword,
          ...this.config.blog.seo.secondary_keywords,
        ].filter(Boolean),
      },
    };
  }
}

export async function generateLandingPage(config: VentureConfig): Promise<LandingPageContent> {
  const generator = new LandingPageGenerator(config);
  return generator.generate();
}
