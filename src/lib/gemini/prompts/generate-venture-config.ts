/**
 * Prompt to generate a complete venture.config.json from a user's business description
 */

export function createVentureConfigPrompt(userDescription: string): string {
  return `
You are an expert startup advisor and branding strategist. A founder has described their business idea to you. Your task is to analyze their description and generate a complete venture configuration for their website and content.

## FOUNDER'S DESCRIPTION:
${userDescription}

## YOUR TASK:
Generate a comprehensive venture configuration JSON that captures:
1. The core business idea (distilled to one compelling sentence)
2. A memorable company name (if not provided, suggest one)
3. A catchy tagline (5-8 words)
4. Industry classification
5. Target audience analysis
6. Pain points the solution addresses
7. Value proposition
8. Unique selling points
9. Brand personality and colors
10. SEO keywords for content marketing

## GUIDELINES:

### Company Name:
- If the founder mentioned a company name, use it
- If not, suggest a memorable, brandable name
- Should be: short (1-2 words), easy to spell, domain-friendly

### Industry Classification:
Choose the most appropriate:
- "saas" - Software as a Service
- "ai" - Artificial Intelligence / ML
- "fintech" - Financial Technology
- "health" - Healthcare / Medical
- "deeptech" - Deep Technology / R&D
- "industrial" - Industrial / Manufacturing
- "construction" - Construction / Infrastructure
- "energy" - Energy / CleanTech
- "logistics" - Logistics / Supply Chain
- "enterprise" - Enterprise Software
- "cybersecurity" - Security
- "iot" - Internet of Things
- "robotics" - Robotics / Automation

### Brand Colors:
Select colors that match the industry and convey trust/innovation:
- Deep Tech/AI: Blues, purples (#4F46E5, #7C3AED)
- Industrial/Construction: Dark blues, oranges (#1E3A8A, #EA580C)
- Healthcare: Teals, greens (#0D9488, #059669)
- Enterprise: Navy, grays (#1E40AF, #475569)
- Fintech: Greens, blues (#10B981, #3B82F6)

### Target Audience:
Be specific about:
- Job titles (e.g., "Asset Integrity Engineers", "Plant Managers")
- Company types (e.g., "Oil & gas operators", "Infrastructure owners")
- Company size (e.g., "Enterprise companies with 500+ employees")

### Pain Points:
Identify 3-4 specific problems from the description:
- Current manual processes
- Cost/time inefficiencies
- Risk/safety concerns
- Lack of predictive capabilities

### SEO Keywords:
Generate keywords that potential customers would search for:
- Primary: Main search term (e.g., "AI corrosion detection")
- Secondary: Related terms (e.g., "structural integrity AI", "predictive maintenance imaging")

## OUTPUT FORMAT:
Return ONLY valid JSON (no markdown, no explanation):

{
  "idea": "One sentence describing the core value proposition",
  "name": "CompanyName",
  "tagline": "5-8 word memorable tagline",
  "domain": "companyname.vercel.app",

  "business": {
    "industry": "industry-slug",
    "category": "Specific Category Name",
    "target_audience": "Detailed description of target customers",
    "pain_points": [
      "Specific pain point 1",
      "Specific pain point 2",
      "Specific pain point 3"
    ],
    "value_proposition": "Clear statement of unique value delivered",
    "unique_selling_points": [
      "USP 1 - specific differentiator",
      "USP 2 - specific differentiator",
      "USP 3 - specific differentiator",
      "USP 4 - specific differentiator"
    ]
  },

  "competitors": {
    "urls": [],
    "analyze_design": false,
    "analyze_copy": false,
    "analyze_pricing": false
  },

  "brand": {
    "tone": "professional",
    "personality": ["innovative", "trustworthy", "expert"],
    "colors": {
      "primary": "#HEX",
      "secondary": "#HEX",
      "accent": "#HEX",
      "background": "#FFFFFF",
      "text": "#111827"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    }
  },

  "landing_page": {
    "enabled": true,
    "sections": {
      "hero": { "enabled": true, "style": "centered", "include_video": false },
      "social_proof": { "enabled": true, "logo_count": 6 },
      "features": { "enabled": true, "count": 6, "layout": "grid" },
      "feature_showcase": { "enabled": true, "count": 3, "layout": "alternating" },
      "pricing": { "enabled": true, "tiers": 3, "currency": "USD", "billing_period": "monthly" },
      "testimonials": { "enabled": true, "count": 3 },
      "faq": { "enabled": true, "count": 6 },
      "cta": { "enabled": true, "style": "gradient" },
      "footer": { "enabled": true, "columns": 4 }
    }
  },

  "blog": {
    "enabled": true,
    "article_count": 20,
    "locale": "en-US",
    "author": {
      "name": "Company Team",
      "role": "Content Team",
      "company": "CompanyName",
      "image_url": ""
    },
    "seo": {
      "primary_keyword": "main search keyword",
      "secondary_keywords": ["keyword2", "keyword3", "keyword4", "keyword5"],
      "keyword_density": 1.5
    },
    "content": {
      "min_word_count": 2000,
      "max_word_count": 3500,
      "sections_per_article": 7,
      "include_tldr": true,
      "include_key_takeaways": true,
      "include_tables": true,
      "include_faqs": true,
      "include_sources": true,
      "internal_linking": true
    }
  },

  "images": {
    "generate_hero": false,
    "generate_feature_icons": false,
    "generate_blog_headers": false,
    "style": "minimal",
    "format": "webp",
    "quality": 85
  },

  "deployment": {
    "platform": "vercel",
    "auto_deploy": true,
    "preview_deployments": true,
    "custom_domain": ""
  },

  "output": {
    "directory": "./content",
    "formats": {
      "landing_page": "tsx",
      "blog_articles": "json",
      "images": "webp"
    }
  },

  "advanced": {
    "gemini_model": "gemini-2.0-flash-exp",
    "temperature": 0.7,
    "max_retries": 3,
    "rate_limit_delay_ms": 1000,
    "enable_competitor_analysis": false,
    "enable_seo_optimization": true
  }
}
`.trim();
}
