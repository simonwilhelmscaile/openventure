/**
 * Landing Page Content Types
 * Generated content structure for landing pages
 */

export interface HeroContent {
  badge?: string;
  headline: string;
  subheadline: string;
  primary_cta: {
    text: string;
    href: string;
  };
  secondary_cta?: {
    text: string;
    href: string;
  };
  image_url?: string;
  video_url?: string;
}

export interface LogoItem {
  name: string;
  logo_url?: string;
  alt: string;
}

export interface SocialProofContent {
  headline?: string;
  logos: LogoItem[];
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  link?: {
    text: string;
    href: string;
  };
}

export interface FeaturesContent {
  headline?: string;
  subheadline?: string;
  features: Feature[];
}

export interface FeatureShowcase {
  id: string;
  headline: string;
  subheadline: string;
  description: string;
  bullets: string[];
  image_url?: string;
  video_url?: string;
  cta?: {
    text: string;
    href: string;
  };
  image_position: 'left' | 'right';
}

export interface FeatureShowcaseContent {
  showcases: FeatureShowcase[];
}

export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly?: number;
  };
  currency: string;
  billing_text: string;
  features: PricingFeature[];
  cta: {
    text: string;
    href: string;
  };
  highlighted: boolean;
  badge?: string;
}

export interface PricingContent {
  headline: string;
  subheadline?: string;
  tiers: PricingTier[];
  billing_toggle?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    title: string;
    company: string;
    image_url?: string;
  };
  rating?: number;
}

export interface TestimonialsContent {
  headline?: string;
  testimonials: Testimonial[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  headline: string;
  subheadline?: string;
  items: FAQItem[];
}

export interface CTAContent {
  headline: string;
  subheadline?: string;
  primary_cta: {
    text: string;
    href: string;
  };
  secondary_cta?: {
    text: string;
    href: string;
  };
  background_style: 'gradient' | 'solid' | 'minimal';
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'github';
  href: string;
}

export interface FooterContent {
  columns: FooterColumn[];
  social_links: SocialLink[];
  copyright: string;
  bottom_links: FooterLink[];
}

export interface LandingPageContent {
  venture_id: string;
  venture_name: string;
  generated_at: string;
  hero: HeroContent;
  social_proof: SocialProofContent;
  features: FeaturesContent;
  feature_showcase: FeatureShowcaseContent;
  pricing: PricingContent;
  testimonials: TestimonialsContent;
  faq: FAQContent;
  cta: CTAContent;
  footer: FooterContent;
  meta: {
    title: string;
    description: string;
    og_image?: string;
    keywords: string[];
  };
}
