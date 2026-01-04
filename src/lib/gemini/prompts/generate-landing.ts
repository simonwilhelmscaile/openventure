import type { VentureConfig } from '@/types';

export function createHeroPrompt(config: VentureConfig): string {
  return `
You are an expert copywriter creating content for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Tagline: ${config.tagline}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Tone: ${config.brand.tone}
- Value Proposition: ${config.business.value_proposition}

TASK:
Generate hero section content for the landing page.

REQUIREMENTS:
- Badge/Category: 1-3 words indicating category or new feature
- Headline: 5-12 words, convey primary value proposition, powerful and memorable
- Subheadline: 15-30 words, explain how the product delivers value
- Primary CTA: 2-4 words, action-oriented (e.g., "Get Started", "Try Free")
- Secondary CTA: 2-4 words, lower commitment (e.g., "Learn More", "Watch Demo")
- Use active voice
- No jargon unless industry-specific and understood by target audience

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "badge": "...",
  "headline": "...",
  "subheadline": "...",
  "primary_cta": {
    "text": "...",
    "href": "#pricing"
  },
  "secondary_cta": {
    "text": "...",
    "href": "#features"
  }
}
`.trim();
}

export function createFeaturesPrompt(config: VentureConfig, count: number): string {
  return `
You are an expert copywriter creating feature content for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Tone: ${config.brand.tone}
- USPs: ${config.business.unique_selling_points.join(', ')}
- Pain Points: ${config.business.pain_points.join(', ')}

TASK:
Generate ${count} feature cards for the landing page.

REQUIREMENTS:
For each feature:
- Icon: One of these icon names (zap, shield, clock, users, chart, globe, lock, star, heart, check)
- Title: 2-5 words, benefit-focused
- Description: 20-40 words explaining the feature and its benefit
- Features: 3-4 bullet points, specific benefits or capabilities
- Each feature should address a different pain point or highlight a different USP

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "features": [
    {
      "id": "feature-1",
      "icon": "zap",
      "title": "...",
      "description": "...",
      "features": ["benefit 1", "benefit 2", "benefit 3"]
    }
  ]
}
`.trim();
}

export function createFeatureShowcasesPrompt(config: VentureConfig, count: number): string {
  return `
You are an expert copywriter creating detailed feature showcases for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Tone: ${config.brand.tone}
- USPs: ${config.business.unique_selling_points.join(', ')}

TASK:
Generate ${count} feature showcase sections. These are larger sections that deep-dive into key features.

REQUIREMENTS:
For each showcase:
- Headline: 3-8 words, compelling and benefit-focused
- Subheadline: 10-20 words, expanding on the headline
- Description: 50-100 words explaining the feature in detail
- Bullets: 4-6 specific benefits or capabilities
- CTA: Action-oriented button text
- Alternate image positions (left/right) for visual variety

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "showcases": [
    {
      "id": "showcase-1",
      "headline": "...",
      "subheadline": "...",
      "description": "...",
      "bullets": ["bullet 1", "bullet 2", ...],
      "cta": {
        "text": "Learn More",
        "href": "#"
      },
      "image_position": "left"
    }
  ]
}
`.trim();
}

export function createPricingPrompt(config: VentureConfig, tierCount: number): string {
  return `
You are an expert pricing strategist for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Industry: ${config.business.industry}
- Currency: ${config.landing_page.sections.pricing.currency}

TASK:
Generate ${tierCount} pricing tiers for the landing page.

REQUIREMENTS:
- Create a clear progression from basic to premium
- Tier names should be memorable (e.g., Starter, Professional, Enterprise)
- Each tier should have 6-10 features
- Clearly differentiate tiers by features and price
- Middle tier should be highlighted as recommended
- Prices should be realistic for the industry
- Include both monthly and yearly pricing (yearly = monthly * 10, 2 months free)

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "headline": "Simple, transparent pricing",
  "subheadline": "Choose the plan that's right for you",
  "tiers": [
    {
      "id": "tier-1",
      "name": "Starter",
      "description": "Perfect for individuals...",
      "price": {
        "monthly": 29,
        "yearly": 290
      },
      "currency": "EUR",
      "billing_text": "per user/month",
      "features": [
        {"text": "Feature 1", "included": true},
        {"text": "Feature 2", "included": true},
        {"text": "Premium feature", "included": false}
      ],
      "cta": {
        "text": "Get Started",
        "href": "#signup"
      },
      "highlighted": false
    }
  ]
}
`.trim();
}

export function createTestimonialsPrompt(config: VentureConfig, count: number): string {
  return `
You are creating realistic testimonials for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Value Proposition: ${config.business.value_proposition}

TASK:
Generate ${count} realistic testimonials from satisfied customers.

REQUIREMENTS:
- Each quote should be 30-60 words
- Include specific benefits or results mentioned
- Authors should have realistic names, titles, and companies
- Vary the industries and company sizes
- Include ratings (4 or 5 stars)
- Make them feel authentic, not generic

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "testimonials": [
    {
      "id": "testimonial-1",
      "quote": "...",
      "author": {
        "name": "...",
        "title": "...",
        "company": "..."
      },
      "rating": 5
    }
  ]
}
`.trim();
}

export function createFAQPrompt(config: VentureConfig, count: number): string {
  return `
You are creating FAQ content for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Industry: ${config.business.industry}

TASK:
Generate ${count} frequently asked questions and answers.

REQUIREMENTS:
- Questions should address common concerns and objections
- Answers should be 30-80 words
- Cover topics like: pricing, features, security, support, onboarding
- Use clear, helpful language
- Address potential objections directly

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "items": [
    {
      "id": "faq-1",
      "question": "...",
      "answer": "..."
    }
  ]
}
`.trim();
}

export function createCTAPrompt(config: VentureConfig): string {
  return `
You are creating a final call-to-action section for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Tagline: ${config.tagline}
- Target Audience: ${config.business.target_audience}
- Tone: ${config.brand.tone}

TASK:
Generate compelling CTA section content.

REQUIREMENTS:
- Headline: 5-10 words, create urgency or excitement
- Subheadline: 15-25 words, reinforce the value proposition
- Primary CTA: 2-4 words, strong action
- Secondary CTA: 2-4 words, alternative action

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "headline": "...",
  "subheadline": "...",
  "primary_cta": {
    "text": "...",
    "href": "#signup"
  },
  "secondary_cta": {
    "text": "...",
    "href": "#demo"
  },
  "background_style": "gradient"
}
`.trim();
}

export function createFooterPrompt(config: VentureConfig, columnCount: number): string {
  return `
You are creating footer content for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Industry: ${config.business.industry}

TASK:
Generate footer content with ${columnCount} navigation columns.

REQUIREMENTS:
- Column 1: Product links - MUST use anchor links for sections on the landing page: "/#features", "/#pricing", "/#faq"
- Column 2: Company links - Use page paths: "/about", "/careers", "/contact"
- Column 3: Resources - Use "/blog" for blog, external URLs for GitHub/docs
- Column 4: Legal - Use page paths: "/terms", "/privacy"
- Include social media links with full URLs
- Include copyright text

CRITICAL:
- For sections on the homepage (Features, Pricing, FAQ), use "/#features", "/#pricing", "/#faq" NOT "/features", "/pricing", "/faq"
- Only these pages exist: /about, /careers, /contact, /blog, /terms, /privacy
- For external resources, use full https:// URLs

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "columns": [
    {
      "title": "Product",
      "links": [
        {"text": "Features", "href": "/#features"},
        {"text": "Pricing", "href": "/#pricing"},
        {"text": "FAQ", "href": "/#faq"}
      ]
    },
    {
      "title": "Company",
      "links": [
        {"text": "About", "href": "/about"},
        {"text": "Careers", "href": "/careers"},
        {"text": "Contact", "href": "/contact"}
      ]
    },
    {
      "title": "Resources",
      "links": [
        {"text": "Blog", "href": "/blog"}
      ]
    },
    {
      "title": "Legal",
      "links": [
        {"text": "Terms", "href": "/terms"},
        {"text": "Privacy", "href": "/privacy"}
      ]
    }
  ],
  "social_links": [
    {"platform": "twitter", "href": "https://twitter.com/${config.name.toLowerCase().replace(/\s+/g, '')}"},
    {"platform": "linkedin", "href": "https://linkedin.com/company/${config.name.toLowerCase().replace(/\s+/g, '')}"}
  ],
  "copyright": "© ${new Date().getFullYear()} ${config.name}. All rights reserved.",
  "bottom_links": [
    {"text": "Terms", "href": "/terms"},
    {"text": "Privacy", "href": "/privacy"}
  ]
}
`.trim();
}
