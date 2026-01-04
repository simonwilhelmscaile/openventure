#!/usr/bin/env npx ts-node

/**
 * Random Venture Generator
 * Generates random venture configurations for testing
 */

import * as fs from 'fs';

interface VentureConfig {
  name: string;
  idea: string;
  tagline: string;
  domain: string;
  business: {
    industry: string;
    category: string;
    target_audience: string;
    pain_points: string[];
    value_proposition: string;
    unique_selling_points: string[];
  };
  brand: {
    tone: string;
    personality: string[];
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  landing_page: {
    enabled: boolean;
    sections: {
      hero: { enabled: boolean; style: string; include_video: boolean };
      social_proof: { enabled: boolean; logo_count: number };
      features: { enabled: boolean; count: number; layout: string };
      feature_showcase: { enabled: boolean; count: number; layout: string };
      pricing: { enabled: boolean; tiers: number; currency: string; billing_period: string };
      testimonials: { enabled: boolean; count: number };
      faq: { enabled: boolean; count: number };
      cta: { enabled: boolean; style: string };
      footer: { enabled: boolean; columns: number };
    };
  };
  blog: {
    enabled: boolean;
    article_count: number;
    locale: string;
    seo: {
      primary_keyword: string;
      secondary_keywords: string[];
      keyword_density: number;
    };
    content: {
      min_word_count: number;
      max_word_count: number;
      sections_per_article: number;
      include_tldr: boolean;
      include_key_takeaways: boolean;
      include_tables: boolean;
      include_faqs: boolean;
      include_sources: boolean;
      internal_linking: boolean;
    };
    author: {
      name: string;
      role: string;
      company: string;
      image_url: string;
    };
  };
  images: {
    generate_hero: boolean;
    generate_feature_icons: boolean;
    generate_blog_headers: boolean;
    style: string;
    format: string;
    quality: number;
  };
  output: {
    directory: string;
    formats: {
      landing_page: string;
      blog_articles: string;
      images: string;
    };
  };
  advanced: {
    gemini_model: string;
    temperature: number;
    max_retries: number;
    rate_limit_delay_ms: number;
    enable_competitor_analysis: boolean;
    enable_seo_optimization: boolean;
  };
}

// Industry templates
const INDUSTRIES = {
  saas: {
    industries: ['saas', 'software', 'technology'],
    audiences: [
      'small business owners',
      'enterprise teams',
      'startups',
      'remote workers',
      'marketing teams',
      'sales professionals',
    ],
    painPoints: [
      'Manual processes that waste time',
      'Lack of real-time insights',
      'Poor team collaboration',
      'Scattered data across tools',
      'Difficulty scaling operations',
      'High customer churn',
      'Slow customer response times',
    ],
    valueProps: [
      'Automate repetitive tasks and save hours every week',
      'Get actionable insights in real-time',
      'Streamline workflows across your entire team',
      'Centralize all your data in one platform',
      'Scale effortlessly as your business grows',
    ],
  },
  ecommerce: {
    industries: ['ecommerce', 'retail', 'marketplace'],
    audiences: [
      'online shoppers',
      'small retailers',
      'D2C brands',
      'fashion enthusiasts',
      'home decor buyers',
      'gift shoppers',
    ],
    painPoints: [
      'Hard to find unique products',
      'Slow shipping times',
      'Poor product quality',
      'Complicated returns',
      'Lack of personalization',
      'Overwhelming choices',
    ],
    valueProps: [
      'Curated selection of premium products',
      'Fast, free shipping on all orders',
      'Quality guaranteed or your money back',
      'Hassle-free returns within 30 days',
      'Personalized recommendations just for you',
    ],
  },
  service: {
    industries: ['agency', 'consulting', 'professional services'],
    audiences: [
      'growing businesses',
      'executives',
      'entrepreneurs',
      'marketing directors',
      'HR managers',
      'finance teams',
    ],
    painPoints: [
      'Lack of expertise in-house',
      'Inconsistent results from freelancers',
      'Difficulty finding reliable partners',
      'Budget constraints',
      'Long project timelines',
      'Poor communication',
    ],
    valueProps: [
      'Expert team with proven track record',
      'Transparent pricing with no hidden fees',
      'Dedicated account manager for every client',
      'Results-driven approach with measurable KPIs',
      'Fast turnaround without sacrificing quality',
    ],
  },
};

// Company name patterns
const NAME_PREFIXES = [
  'Swift', 'Bright', 'Clear', 'Smart', 'Quick', 'Pure', 'Bold', 'True',
  'Peak', 'Prime', 'Core', 'Flow', 'Spark', 'Pulse', 'Wave', 'Flux',
];

const NAME_SUFFIXES = [
  'Labs', 'HQ', 'AI', 'Hub', 'Pro', 'Plus', 'Max', 'One',
  'Stack', 'Cloud', 'Base', 'Sync', 'Link', 'Works', 'Tech', 'IO',
];

// Brand colors (curated palettes)
const COLOR_PALETTES = [
  { primary: '#000000', accent: '#6366F1' }, // Black + Indigo
  { primary: '#1a1a2e', accent: '#e94560' }, // Dark Blue + Coral
  { primary: '#2d3436', accent: '#00b894' }, // Charcoal + Mint
  { primary: '#0a0a0a', accent: '#ffd93d' }, // Black + Gold
  { primary: '#1e3a5f', accent: '#3498db' }, // Navy + Blue
  { primary: '#2c3e50', accent: '#e74c3c' }, // Dark Gray + Red
  { primary: '#1a1a1a', accent: '#9b59b6' }, // Black + Purple
  { primary: '#0f0f0f', accent: '#1abc9c' }, // Near Black + Teal
];

// Tagline templates
const TAGLINE_TEMPLATES = [
  '{action} {audience}, {benefit}',
  'The {adjective} way to {action}',
  '{benefit} for {audience}',
  'Where {audience} {action}',
  '{action}. {benefit}. {result}.',
];

const TAGLINE_WORDS = {
  actions: ['Empower', 'Transform', 'Accelerate', 'Simplify', 'Automate', 'Unlock', 'Streamline'],
  adjectives: ['smart', 'simple', 'modern', 'better', 'faster', 'easier', 'proven'],
  benefits: ['without the hassle', 'in half the time', 'effortlessly', 'with confidence'],
  results: ['Grow faster', 'Work smarter', 'Save time', 'See results'],
};

// Utility functions
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateCompanyName(): string {
  return `${randomItem(NAME_PREFIXES)}${randomItem(NAME_SUFFIXES)}`;
}

function generateTagline(industry: keyof typeof INDUSTRIES): string {
  const template = randomItem(TAGLINE_TEMPLATES);
  const data = INDUSTRIES[industry];

  return template
    .replace('{action}', randomItem(TAGLINE_WORDS.actions))
    .replace('{adjective}', randomItem(TAGLINE_WORDS.adjectives))
    .replace('{audience}', randomItem(data.audiences))
    .replace('{benefit}', randomItem(TAGLINE_WORDS.benefits))
    .replace('{result}', randomItem(TAGLINE_WORDS.results));
}

function generateIdea(industry: keyof typeof INDUSTRIES, name: string): string {
  const data = INDUSTRIES[industry];
  const audience = randomItem(data.audiences);
  const painPoint = randomItem(data.painPoints).toLowerCase();
  const valueProp = randomItem(data.valueProps);

  return `${name} is a ${randomItem(data.industries)} platform designed for ${audience}. ` +
    `We solve the problem of ${painPoint} by providing ${valueProp.toLowerCase()}. ` +
    `Our solution combines cutting-edge technology with intuitive design to deliver ` +
    `exceptional results for our customers.`;
}

// Main generator
function generateRandomVenture(
  industryType?: 'saas' | 'ecommerce' | 'service'
): VentureConfig {
  const industry = industryType || randomItem(['saas', 'ecommerce', 'service'] as const);
  const data = INDUSTRIES[industry];
  const name = generateCompanyName();
  const colors = randomItem(COLOR_PALETTES);

  const config: VentureConfig = {
    name,
    idea: generateIdea(industry, name),
    tagline: generateTagline(industry),
    domain: `${name.toLowerCase()}.com`,
    business: {
      industry: randomItem(data.industries),
      category: `${randomItem(data.industries)} Platform`,
      target_audience: randomItem(data.audiences),
      pain_points: randomItems(data.painPoints, 3),
      value_proposition: randomItem(data.valueProps),
      unique_selling_points: randomItems(data.valueProps, 3),
    },
    brand: {
      tone: 'professional',
      personality: ['innovative', 'efficient', 'trustworthy'],
      colors: {
        primary: colors.primary,
        secondary: '#1B1B1B',
        accent: colors.accent,
        background: '#FFFFFF',
        text: '#000000',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
    landing_page: {
      enabled: true,
      sections: {
        hero: { enabled: true, style: 'centered', include_video: false },
        social_proof: { enabled: true, logo_count: 6 },
        features: { enabled: true, count: 6, layout: 'grid' },
        feature_showcase: { enabled: true, count: 3, layout: 'alternating' },
        pricing: { enabled: true, tiers: 3, currency: 'USD', billing_period: 'monthly' },
        testimonials: { enabled: true, count: 3 },
        faq: { enabled: true, count: 8 },
        cta: { enabled: true, style: 'gradient' },
        footer: { enabled: true, columns: 4 },
      },
    },
    blog: {
      enabled: true,
      article_count: 10,
      locale: 'en-US',
      seo: {
        primary_keyword: `${randomItem(data.industries)} solutions`,
        secondary_keywords: [
          `${industry} software`,
          `best ${industry} tools`,
          `${randomItem(data.audiences)} solutions`,
        ],
        keyword_density: 1.5,
      },
      content: {
        min_word_count: 2000,
        max_word_count: 4000,
        sections_per_article: 8,
        include_tldr: true,
        include_key_takeaways: true,
        include_tables: true,
        include_faqs: true,
        include_sources: true,
        internal_linking: true,
      },
      author: {
        name: 'Editorial Team',
        role: 'Content Team',
        company: name,
        image_url: '',
      },
    },
    images: {
      generate_hero: true,
      generate_feature_icons: true,
      generate_blog_headers: true,
      style: 'minimal',
      format: 'webp',
      quality: 85,
    },
    output: {
      directory: './content',
      formats: {
        landing_page: 'tsx',
        blog_articles: 'json',
        images: 'webp',
      },
    },
    advanced: {
      gemini_model: 'gemini-2.0-flash-exp',
      temperature: 0.7,
      max_retries: 3,
      rate_limit_delay_ms: 1000,
      enable_competitor_analysis: false,
      enable_seo_optimization: true,
    },
  };

  return config;
}

// CLI execution
const args = process.argv.slice(2);
const industryArg = args.find(a => ['saas', 'ecommerce', 'service'].includes(a)) as 'saas' | 'ecommerce' | 'service' | undefined;
const outputPath = args.find(a => a.startsWith('--output='))?.split('=')[1];

const venture = generateRandomVenture(industryArg);

if (outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(venture, null, 2));
  console.log(`Generated venture config saved to: ${outputPath}`);
} else {
  console.log(JSON.stringify(venture, null, 2));
}

export { generateRandomVenture };
export type { VentureConfig };
