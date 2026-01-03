/**
 * OpenVenture Configuration Types
 * Defines the structure for venture.config.json
 */

export type Tone = 'professional' | 'playful' | 'technical' | 'friendly';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}

export interface Brand {
  tone: Tone;
  personality: string[];
  colors: BrandColors;
  fonts: BrandFonts;
}

export interface Business {
  industry: string;
  category: string;
  target_audience: string;
  pain_points: string[];
  value_proposition: string;
  unique_selling_points: string[];
}

export interface Competitors {
  urls: string[];
  analyze_design: boolean;
  analyze_copy: boolean;
  analyze_pricing: boolean;
}

export interface HeroSection {
  enabled: boolean;
  style: 'centered' | 'left-aligned' | 'split';
  include_video: boolean;
}

export interface SocialProofSectionConfig {
  enabled: boolean;
  logo_count: number;
}

export interface FeaturesConfig {
  enabled: boolean;
  count: number;
  layout: 'grid' | 'list' | 'cards';
}

export interface FeatureShowcaseConfig {
  enabled: boolean;
  count: number;
  layout: 'alternating' | 'stacked';
}

export interface PricingConfig {
  enabled: boolean;
  tiers: number;
  currency: string;
  billing_period: 'monthly' | 'yearly' | 'both';
}

export interface TestimonialsConfig {
  enabled: boolean;
  count: number;
}

export interface FAQConfig {
  enabled: boolean;
  count: number;
}

export interface CTAConfig {
  enabled: boolean;
  style: 'gradient' | 'solid' | 'minimal';
}

export interface FooterConfig {
  enabled: boolean;
  columns: number;
}

export interface LandingPageSections {
  hero: HeroSection;
  social_proof: SocialProofSectionConfig;
  features: FeaturesConfig;
  feature_showcase: FeatureShowcaseConfig;
  pricing: PricingConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
  cta: CTAConfig;
  footer: FooterConfig;
}

export interface LandingPageConfig {
  enabled: boolean;
  sections: LandingPageSections;
}

export interface BlogSEO {
  primary_keyword: string;
  secondary_keywords: string[];
  keyword_density: number;
}

export interface BlogContent {
  min_word_count: number;
  max_word_count: number;
  sections_per_article: number;
  include_tldr: boolean;
  include_key_takeaways: boolean;
  include_tables: boolean;
  include_faqs: boolean;
  include_sources: boolean;
  internal_linking: boolean;
}

export interface BlogAuthor {
  name: string;
  role: string;
  company: string;
  image_url: string;
}

export interface BlogConfig {
  enabled: boolean;
  article_count: number;
  locale: string;
  seo: BlogSEO;
  content: BlogContent;
  author: BlogAuthor;
}

export interface ImageConfig {
  generate_hero: boolean;
  generate_feature_icons: boolean;
  generate_blog_headers: boolean;
  style: 'minimal' | 'detailed' | 'abstract';
  format: 'webp' | 'png' | 'jpg';
  quality: number;
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'cloudflare';
  auto_deploy: boolean;
  preview_deployments: boolean;
  custom_domain: string;
}

export interface OutputConfig {
  directory: string;
  formats: {
    landing_page: 'tsx' | 'html';
    blog_articles: 'json' | 'md';
    images: 'webp' | 'png' | 'jpg';
  };
}

export interface AdvancedConfig {
  gemini_model: string;
  temperature: number;
  max_retries: number;
  rate_limit_delay_ms: number;
  enable_competitor_analysis: boolean;
  enable_seo_optimization: boolean;
}

export interface VentureConfig {
  $schema?: string;
  idea: string;
  name: string;
  tagline: string;
  domain: string;
  business: Business;
  competitors: Competitors;
  brand: Brand;
  landing_page: LandingPageConfig;
  blog: BlogConfig;
  images: ImageConfig;
  deployment: DeploymentConfig;
  output: OutputConfig;
  advanced: AdvancedConfig;
}
