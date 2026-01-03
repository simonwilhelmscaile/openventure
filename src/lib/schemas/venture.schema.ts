import { z } from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const ToneSchema = z.enum(['professional', 'playful', 'technical', 'friendly']);

export const BrandColorsSchema = z.object({
  primary: z.string().regex(hexColorRegex, 'Invalid hex color'),
  secondary: z.string().regex(hexColorRegex, 'Invalid hex color'),
  accent: z.string().regex(hexColorRegex, 'Invalid hex color'),
  background: z.string().regex(hexColorRegex, 'Invalid hex color'),
  text: z.string().regex(hexColorRegex, 'Invalid hex color'),
});

export const BrandFontsSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
});

export const BrandSchema = z.object({
  tone: ToneSchema,
  personality: z.array(z.string()),
  colors: BrandColorsSchema,
  fonts: BrandFontsSchema,
});

export const BusinessSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  category: z.string(),
  target_audience: z.string().min(1, 'Target audience is required'),
  pain_points: z.array(z.string()),
  value_proposition: z.string(),
  unique_selling_points: z.array(z.string()),
});

export const CompetitorsSchema = z.object({
  urls: z.array(z.string().url()).max(5),
  analyze_design: z.boolean(),
  analyze_copy: z.boolean(),
  analyze_pricing: z.boolean(),
});

export const HeroSectionSchema = z.object({
  enabled: z.boolean(),
  style: z.enum(['centered', 'left-aligned', 'split']),
  include_video: z.boolean(),
});

export const SocialProofSectionConfigSchema = z.object({
  enabled: z.boolean(),
  logo_count: z.number().min(0).max(12),
});

export const FeaturesConfigSchema = z.object({
  enabled: z.boolean(),
  count: z.number().min(1).max(12),
  layout: z.enum(['grid', 'list', 'cards']),
});

export const FeatureShowcaseConfigSchema = z.object({
  enabled: z.boolean(),
  count: z.number().min(1).max(6),
  layout: z.enum(['alternating', 'stacked']),
});

export const PricingConfigSchema = z.object({
  enabled: z.boolean(),
  tiers: z.number().min(1).max(5),
  currency: z.string().min(1),
  billing_period: z.enum(['monthly', 'yearly', 'both']),
});

export const TestimonialsConfigSchema = z.object({
  enabled: z.boolean(),
  count: z.number().min(0).max(10),
});

export const FAQConfigSchema = z.object({
  enabled: z.boolean(),
  count: z.number().min(0).max(20),
});

export const CTAConfigSchema = z.object({
  enabled: z.boolean(),
  style: z.enum(['gradient', 'solid', 'minimal']),
});

export const FooterConfigSchema = z.object({
  enabled: z.boolean(),
  columns: z.number().min(1).max(6),
});

export const LandingPageSectionsSchema = z.object({
  hero: HeroSectionSchema,
  social_proof: SocialProofSectionConfigSchema,
  features: FeaturesConfigSchema,
  feature_showcase: FeatureShowcaseConfigSchema,
  pricing: PricingConfigSchema,
  testimonials: TestimonialsConfigSchema,
  faq: FAQConfigSchema,
  cta: CTAConfigSchema,
  footer: FooterConfigSchema,
});

export const LandingPageConfigSchema = z.object({
  enabled: z.boolean(),
  sections: LandingPageSectionsSchema,
});

export const BlogSEOSchema = z.object({
  primary_keyword: z.string(),
  secondary_keywords: z.array(z.string()),
  keyword_density: z.number().min(0).max(5),
});

export const BlogContentSchema = z.object({
  min_word_count: z.number().min(500).max(10000),
  max_word_count: z.number().min(1000).max(20000),
  sections_per_article: z.number().min(3).max(15),
  include_tldr: z.boolean(),
  include_key_takeaways: z.boolean(),
  include_tables: z.boolean(),
  include_faqs: z.boolean(),
  include_sources: z.boolean(),
  internal_linking: z.boolean(),
});

export const BlogAuthorSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string(),
  image_url: z.string(),
});

export const BlogConfigSchema = z.object({
  enabled: z.boolean(),
  article_count: z.number().min(1).max(50),
  locale: z.string().min(2),
  seo: BlogSEOSchema,
  content: BlogContentSchema,
  author: BlogAuthorSchema,
});

export const ImageConfigSchema = z.object({
  generate_hero: z.boolean(),
  generate_feature_icons: z.boolean(),
  generate_blog_headers: z.boolean(),
  style: z.enum(['minimal', 'detailed', 'abstract']),
  format: z.enum(['webp', 'png', 'jpg']),
  quality: z.number().min(1).max(100),
});

export const DeploymentConfigSchema = z.object({
  platform: z.enum(['vercel', 'netlify', 'cloudflare']),
  auto_deploy: z.boolean(),
  preview_deployments: z.boolean(),
  custom_domain: z.string(),
});

export const OutputConfigSchema = z.object({
  directory: z.string().min(1),
  formats: z.object({
    landing_page: z.enum(['tsx', 'html']),
    blog_articles: z.enum(['json', 'md']),
    images: z.enum(['webp', 'png', 'jpg']),
  }),
});

export const AdvancedConfigSchema = z.object({
  gemini_model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  max_retries: z.number().min(1).max(10),
  rate_limit_delay_ms: z.number().min(0).max(60000),
  enable_competitor_analysis: z.boolean(),
  enable_seo_optimization: z.boolean(),
});

export const VentureConfigSchema = z.object({
  $schema: z.string().optional(),
  idea: z.string().min(10, 'Business idea must be at least 10 characters'),
  name: z.string().min(1, 'Company name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  domain: z.string(),
  business: BusinessSchema,
  competitors: CompetitorsSchema,
  brand: BrandSchema,
  landing_page: LandingPageConfigSchema,
  blog: BlogConfigSchema,
  images: ImageConfigSchema,
  deployment: DeploymentConfigSchema,
  output: OutputConfigSchema,
  advanced: AdvancedConfigSchema,
});

export type VentureConfigInput = z.infer<typeof VentureConfigSchema>;
