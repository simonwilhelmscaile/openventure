# OpenVenture

[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse%20SEO-100%25-brightgreen)](https://openventure.vercel.app)
[![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-96%25-brightgreen)](https://openventure.vercel.app)
[![Lighthouse Performance](https://img.shields.io/badge/Performance-92%25-green)](https://openventure.vercel.app)
[![Lighthouse Best Practices](https://img.shields.io/badge/Best%20Practices-96%25-brightgreen)](https://openventure.vercel.app)

> Generate a production-ready website + 20 SEO blog articles from just a business description.
> No coding required. Deploy in minutes.

## What You Get

- **Professional Landing Page** - Superhuman-style design with hero, features, pricing, FAQ
- **20 SEO-Optimized Blog Articles** - 2000+ words each, ready to drive organic traffic
- **Production-Ready Code** - Built on Next.js, deployable to Vercel
- **One-Click Deployment** - From idea to live website in under an hour

## Quick Start (5 Minutes)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### Step 2: Clone & Setup

```bash
git clone https://github.com/simonwilhelmscaile/openventure.git
cd openventure
npm install
```

### Step 3: Describe Your Business

Just run this command - it will ask for your API key if needed:

```bash
npm run create-venture
```

The script will:
1. Prompt for your Gemini API key (and save it for future use)
2. Ask you to describe your business
3. Generate your complete configuration

**Example input:**
```
We are building AI models that assess and forecast structural integrity from images.
We combine context aware image analysis with deep learning models, powered by a
proprietary large scale corrosion and integrity image database. Alex developed the
model during his PhD and we're exploring commercialization. We're interviewing
stakeholders and planning outreach for POCs next year.
```

**Gemini will automatically generate:**
- Company name, tagline, and brand colors
- Target audience and pain points
- SEO keywords for your niche
- Complete configuration for your website

### Step 4: Generate Your Venture

```bash
npm run generate -- --config=./venture.config.json
```

This creates your landing page and 20 blog articles (takes 15-20 minutes).

### Step 5: Preview & Deploy

```bash
# Preview locally
npm run build && npm run start
# Open http://localhost:3000

# Deploy to Vercel
npx vercel --prod
```

Your site will be live at `https://your-project.vercel.app`!

**Live Demo:** https://openventure.vercel.app

---

## Alternative: Manual Configuration

If you prefer to configure everything yourself, edit `venture.config.json` directly:

```json
{
  "name": "Your Company Name",
  "idea": "One sentence describing your business",
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

See `examples/petpal-venture.config.json` for a complete example.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run create-venture` | Create config from business description (AI-powered) |
| `npm run generate -- --config=./venture.config.json` | Generate landing page and blog content |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run validate-links` | Validate all links in generated content |
| `npx vercel --prod` | Deploy to Vercel |

### Create Venture Options

```bash
# Interactive mode (default)
npm run create-venture

# From command line
npm run create-venture -- --prompt="Your business description here"

# From file
npm run create-venture -- --file=./my-idea.txt

# Custom output path
npm run create-venture -- --file=./idea.txt --output=./my-config.json
```

---

## Configuration Reference

### Business Section

| Field | Description |
|-------|-------------|
| `industry` | One of: `saas`, `ai`, `fintech`, `health`, `deeptech`, `industrial`, `construction`, `energy`, `logistics`, `enterprise`, `ecommerce`, `education` |
| `target_audience` | Who you're selling to |
| `pain_points` | 3-5 problems you solve |
| `value_proposition` | Your core value statement |
| `unique_selling_points` | What makes you different |

### Blog Settings

```json
"blog": {
  "article_count": 20,
  "locale": "en-US",
  "seo": {
    "primary_keyword": "your main keyword",
    "secondary_keywords": ["keyword 2", "keyword 3"]
  },
  "author": {
    "name": "Your Name",
    "role": "Your Title"
  }
}
```

### Brand Colors

```json
"brand": {
  "colors": {
    "primary": "#4F46E5",
    "secondary": "#1E1B4B",
    "accent": "#A5B4FC",
    "background": "#FFFFFF",
    "text": "#111827"
  }
}
```

---

## Troubleshooting

### "GEMINI_API_KEY not found"

Make sure you've created a `.env` file:

```bash
echo "GEMINI_API_KEY=your-key-here" > .env
```

### Rate limit errors during generation

Gemini has rate limits. The generator automatically retries with backoff. If you hit limits, wait a few minutes and run again:

```bash
npm run generate -- --config=./venture.config.json
```

### Build errors

```bash
npm run typecheck  # Check TypeScript
npm run lint       # Check code style
npm run build      # Test production build
```

---

## FAQ

**Q: How much does it cost?**
A: OpenVenture is free. You only pay for Gemini API usage (very low cost).

**Q: Can I customize the design?**
A: Yes! The generated code is standard Next.js + Tailwind CSS.

**Q: How long does generation take?**
A: ~15-20 minutes for landing page + 20 blog articles.

**Q: Can I regenerate content?**
A: Yes! Run `npm run generate` again. Previous content will be backed up.

---

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
