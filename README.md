# OpenVenture

> Generate a production-ready website + SEO blog from just a business idea.
> No coding required. Deploy in minutes.

## What You Get

- **Professional Landing Page** - Superhuman-style design with hero, features, pricing, FAQ
- **10 SEO-Optimized Blog Articles** - 2000+ words each, ready to drive organic traffic
- **Production-Ready Code** - Built on Next.js, deployable to Vercel
- **One-Click Deployment** - From idea to live website in under an hour

## Quick Start (5 Minutes)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key somewhere safe

### Step 2: Clone & Setup

```bash
git clone https://github.com/simonwilhelmscaile/openventure.git
cd openventure
npm install
```

### Step 3: Configure Your Venture

Copy the example config and edit it with your business details:

```bash
cp venture.config.example.json venture.config.json
```

Open `venture.config.json` and fill in your details:

```json
{
  "name": "Your Company Name",
  "idea": "One paragraph describing your business",
  "tagline": "Your catchy tagline",
  "business": {
    "industry": "saas",
    "target_audience": "Who are your customers?",
    "pain_points": ["Problem 1", "Problem 2", "Problem 3"],
    "value_proposition": "How you solve their problems"
  },
  "brand": {
    "colors": {
      "primary": "#000000",
      "accent": "#6366F1"
    }
  }
}
```

### Step 4: Generate Your Venture

```bash
export GEMINI_API_KEY=your-api-key-here
npm run generate
```

This creates your landing page content and blog articles (takes 5-10 minutes).

### Step 5: Preview Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site!

### Step 6: Deploy to Vercel

```bash
# First time: Login to Vercel
npx vercel login

# Deploy preview
npx vercel

# Deploy to production
npx vercel --prod
```

Your site will be live at `https://your-project.vercel.app`!

**Live Demo:** https://openventure.vercel.app

## Configuration Guide

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Your company/product name | "PetPal AI" |
| `idea` | One paragraph describing your business (50+ chars) | "AI assistant that helps pet owners..." |
| `tagline` | Catchy one-liner (10-150 chars) | "Your Pet's Health, Powered by AI" |

### Business Section

| Field | Description |
|-------|-------------|
| `industry` | One of: `saas`, `ecommerce`, `fintech`, `healthtech`, `edtech`, `marketplace`, `agency`, `consulting`, `media`, `other` |
| `target_audience` | Who you're selling to |
| `pain_points` | 3-5 problems you solve |
| `value_proposition` | Your core value statement |
| `unique_selling_points` | What makes you different |

### Brand Colors

Customize your site's look:

```json
"brand": {
  "colors": {
    "primary": "#000000",
    "secondary": "#1B1B1B",
    "accent": "#6366F1",
    "background": "#FFFFFF",
    "text": "#000000"
  }
}
```

### Blog Settings

```json
"blog": {
  "article_count": 10,
  "locale": "en-US",
  "seo": {
    "primary_keyword": "your main keyword",
    "secondary_keywords": ["keyword 2", "keyword 3"]
  },
  "author": {
    "name": "Your Name",
    "role": "Your Title",
    "company": "Your Company"
  }
}
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate landing page and blog content |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npx vercel` | Deploy to Vercel |

## Troubleshooting

### "GEMINI_API_KEY not found"

Make sure you've set the environment variable:

```bash
export GEMINI_API_KEY=your-key-here
```

Or create a `.env.local` file:

```
GEMINI_API_KEY=your-key-here
```

### Generation fails with JSON errors

Some articles may fail due to Gemini output formatting. The generator will continue and create as many articles as possible. You can re-run `npm run generate` to try again.

### Build errors

Run these commands to check for issues:

```bash
npm run typecheck  # Check TypeScript
npm run lint       # Check code style
npm run build      # Test production build
```

## FAQ

**Q: How much does it cost?**
A: OpenVenture is free. You only pay for Gemini API usage (very low cost for generation).

**Q: Can I customize the design?**
A: Yes! The generated code is standard Next.js + Tailwind CSS. You can modify any component.

**Q: How long does generation take?**
A: Landing page: ~30 seconds. Blog articles: ~5-10 minutes for 10 articles.

**Q: Can I regenerate content?**
A: Yes! Just run `npm run generate` again. Previous content will be overwritten.

**Q: What if I want different content?**
A: Edit your `venture.config.json` to adjust your business description, keywords, etc., then regenerate.

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **AI**: Google Gemini
- **Deployment**: Vercel
- **Language**: TypeScript

## License

MIT

---

Built with OpenVenture - Launch your business in minutes, not months.
