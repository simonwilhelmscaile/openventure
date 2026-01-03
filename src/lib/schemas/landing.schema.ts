import { z } from 'zod';

export const HeroContentSchema = z.object({
  badge: z.string().optional(),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  primary_cta: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }),
  secondary_cta: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }).optional(),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
});

export const LogoItemSchema = z.object({
  name: z.string().min(1),
  logo_url: z.string().optional(),
  alt: z.string().min(1),
});

export const SocialProofContentSchema = z.object({
  headline: z.string().optional(),
  logos: z.array(LogoItemSchema),
});

export const FeatureSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()),
  link: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }).optional(),
});

export const FeaturesContentSchema = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  features: z.array(FeatureSchema),
});

export const FeatureShowcaseSchema = z.object({
  id: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  description: z.string().min(1),
  bullets: z.array(z.string()),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
  cta: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }).optional(),
  image_position: z.enum(['left', 'right']),
});

export const FeatureShowcaseContentSchema = z.object({
  showcases: z.array(FeatureShowcaseSchema),
});

export const PricingFeatureSchema = z.object({
  text: z.string().min(1),
  included: z.boolean(),
  highlight: z.boolean().optional(),
});

export const PricingTierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.object({
    monthly: z.number().min(0),
    yearly: z.number().min(0).optional(),
  }),
  currency: z.string().min(1),
  billing_text: z.string().min(1),
  features: z.array(PricingFeatureSchema),
  cta: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }),
  highlighted: z.boolean(),
  badge: z.string().optional(),
});

export const PricingContentSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  tiers: z.array(PricingTierSchema),
  billing_toggle: z.boolean().optional(),
});

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  author: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    company: z.string().min(1),
    image_url: z.string().optional(),
  }),
  rating: z.number().min(1).max(5).optional(),
});

export const TestimonialsContentSchema = z.object({
  headline: z.string().optional(),
  testimonials: z.array(TestimonialSchema),
});

export const FAQItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const FAQContentSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  items: z.array(FAQItemSchema),
});

export const CTAContentSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  primary_cta: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }),
  secondary_cta: z.object({
    text: z.string().min(1),
    href: z.string().min(1),
  }).optional(),
  background_style: z.enum(['gradient', 'solid', 'minimal']),
});

export const FooterLinkSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1),
});

export const FooterColumnSchema = z.object({
  title: z.string().min(1),
  links: z.array(FooterLinkSchema),
});

export const SocialLinkSchema = z.object({
  platform: z.enum(['twitter', 'linkedin', 'instagram', 'facebook', 'youtube', 'tiktok', 'github']),
  href: z.string().url(),
});

export const FooterContentSchema = z.object({
  columns: z.array(FooterColumnSchema),
  social_links: z.array(SocialLinkSchema),
  copyright: z.string().min(1),
  bottom_links: z.array(FooterLinkSchema),
});

export const LandingPageContentSchema = z.object({
  venture_id: z.string().min(1),
  venture_name: z.string().min(1),
  generated_at: z.string().min(1),
  hero: HeroContentSchema,
  social_proof: SocialProofContentSchema,
  features: FeaturesContentSchema,
  feature_showcase: FeatureShowcaseContentSchema,
  pricing: PricingContentSchema,
  testimonials: TestimonialsContentSchema,
  faq: FAQContentSchema,
  cta: CTAContentSchema,
  footer: FooterContentSchema,
  meta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    og_image: z.string().optional(),
    keywords: z.array(z.string()),
  }),
});

export type LandingPageContentInput = z.infer<typeof LandingPageContentSchema>;
