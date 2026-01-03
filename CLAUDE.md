# CLAUDE.md - OpenVenture Development Rules

> Rules, patterns, and principles for Claude when building OpenVenture.

---

## Project Context

**OpenVenture** generates production-ready websites + SEO blog content from a business idea.

- **Input**: `venture.config.json` with business idea, name, audience
- **Output**: Superhuman-style landing page + 10 SEO blog articles
- **Deployment**: GitHub Actions -> Vercel

---

## Critical Rules

### 1. PRODUCTION-FIRST

Everything must work in production from day one:
- No placeholder content - generate real, usable output
- No mock data in final components - all dynamic
- No console.logs in production code
- All errors must be caught and handled gracefully
- Environment variables for ALL secrets

### 2. TYPE SAFETY

TypeScript strict mode. No `any` types.

```typescript
// BAD
const data: any = await generateContent();

// GOOD
const data: LandingPageContent = await generateContent();
```

Always define interfaces before implementation:
```typescript
// 1. Define type
interface ArticleSection {
  title: string;
  content: string;
  order: number;
}

// 2. Then implement
function generateSection(): ArticleSection {
  return { title, content, order };
}
```

### 3. FILE STRUCTURE

Follow the established structure exactly:
```
src/
├── app/           # Next.js App Router pages ONLY
├── components/    # React components ONLY
├── lib/           # Business logic, utilities, API clients
├── types/         # TypeScript interfaces and types
└── styles/        # CSS files
```

Never put:
- Business logic in components
- API calls directly in components (use lib/)
- Types scattered across files (centralize in types/)

### 4. COMPONENT PATTERNS

```typescript
// All components must:
// 1. Be typed with explicit props interface
// 2. Use destructuring
// 3. Handle loading/error states
// 4. Be exportable

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export function FeatureCard({
  icon,
  title,
  description,
  features
}: FeatureCardProps) {
  return (
    // JSX
  );
}
```

### 5. STYLING RULES

Use Tailwind CSS with these patterns:

```tsx
// Use CSS variables for theme colors
<div className="bg-[var(--color-primary)]">

// Group related classes
<div className="
  flex items-center justify-between
  p-4 md:p-6 lg:p-8
  bg-white rounded-xl
  border border-[var(--color-border)]
">

// Extract repeated patterns to @apply in CSS
```

**Never inline styles** except for dynamic values:
```tsx
// BAD
<div style={{ backgroundColor: '#6219FF' }}>

// GOOD
<div className="bg-[var(--color-accent)]">

// OK for dynamic values
<div style={{ backgroundColor: brand.primary }}>
```

---

## Anti-Patterns to Avoid

### 1. Over-Engineering

**Don't create abstractions prematurely:**
```typescript
// BAD - unnecessary abstraction
const useArticleGenerator = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const generate = async () => { ... };
  return { article, loading, generate };
};

// GOOD - simple and direct
async function generateArticle(topic: string): Promise<Article> {
  return await gemini.generate(prompt);
}
```

### 2. Premature Optimization

Don't optimize before measuring:
```typescript
// BAD - premature memoization
const MemoizedCard = React.memo(({ data }) => <Card {...data} />);

// GOOD - only optimize when needed
export function Card({ data }) { return <div>...</div>; }
```

### 3. Deeply Nested Conditionals

```typescript
// BAD
if (user) {
  if (user.subscription) {
    if (user.subscription.active) {
      if (user.subscription.tier === 'pro') {
        // do thing
      }
    }
  }
}

// GOOD - early returns
if (!user) return null;
if (!user.subscription?.active) return <Upgrade />;
if (user.subscription.tier !== 'pro') return <UpgradeToPro />;
return <ProFeature />;
```

### 4. Magic Strings

```typescript
// BAD
if (status === 'completed') { ... }

// GOOD
const STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

if (status === STATUS.COMPLETED) { ... }
```

### 5. Ignoring Errors

```typescript
// BAD
try {
  await generateContent();
} catch (e) {
  console.log(e); // Silent failure
}

// GOOD
try {
  await generateContent();
} catch (error) {
  logger.error('Content generation failed', { error });
  throw new GenerationError('Failed to generate content', { cause: error });
}
```

---

## Gemini API Patterns

### Prompt Structure

Always use structured prompts:
```typescript
const prompt = `
You are an expert copywriter creating content for a ${industry} company.

CONTEXT:
- Company: ${name}
- Target Audience: ${audience}
- Tone: ${tone}

TASK:
Generate a hero section headline and subheadline.

REQUIREMENTS:
- Headline: 5-10 words, convey primary value proposition
- Subheadline: 15-25 words, explain how the product delivers value
- Use active voice
- No jargon

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "headline": "...",
  "subheadline": "..."
}
`;
```

### Response Parsing

```typescript
async function parseGeminiResponse<T>(response: string, schema: z.ZodSchema<T>): Promise<T> {
  // Extract JSON from response (Gemini sometimes adds markdown)
  const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) ||
                    response.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new ParseError('No JSON found in response');
  }

  const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  return schema.parse(parsed);
}
```

### Rate Limiting

```typescript
// Use exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(baseDelay * Math.pow(2, i));
    }
  }
  throw new Error('Unreachable');
}
```

---

## Content Generation Guidelines

### Blog Articles

Each article MUST have:
1. **Meta Title** (50-60 chars) - Include primary keyword
2. **Meta Description** (150-160 chars) - Compelling, includes keyword
3. **Headline** (H1) - Unique, attention-grabbing
4. **Subtitle** - Expand on headline
5. **TLDR** (50 words) - Executive summary
6. **7-9 Sections** with H2 titles
7. **FAQ Section** (5-8 questions)
8. **At least 1 comparison table**

Word count targets:
- Minimum: 2,000 words
- Target: 2,500-3,500 words
- Maximum: 5,000 words

### Landing Page

Must include:
1. **Hero** - Headline + subheadline + 2 CTAs
2. **Social Proof** - 6 logo placeholders
3. **3 Feature Sections** - Alternating layout
4. **Pricing** - 3 tiers
5. **FAQ** - 6-8 questions
6. **CTA Section** - Final conversion push
7. **Footer** - 4-column layout

---

## Testing Requirements

Before marking any phase complete:

```bash
# Must pass
npm run typecheck   # No TypeScript errors
npm run lint        # No ESLint errors
npm run build       # Production build succeeds
npm run test        # All tests pass
```

### Component Testing

```typescript
// Every component needs at least:
// 1. Render test
// 2. Props variation test

describe('FeatureCard', () => {
  it('renders without crashing', () => {
    render(<FeatureCard {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('displays all features', () => {
    render(<FeatureCard {...mockProps} />);
    mockProps.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });
});
```

---

## GitHub Actions Requirements

All workflows must:
1. Use `ubuntu-latest`
2. Cache `node_modules`
3. Set timeout limits
4. Have proper error handling
5. Upload artifacts on success

```yaml
jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run generate
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      - uses: actions/upload-artifact@v4
        if: success()
        with:
          name: output
          path: output/
          retention-days: 7
```

---

## Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(generator): add article section generator
fix(gemini): handle rate limit errors with retry
refactor(components): extract shared button styles
docs(readme): add deployment instructions
```

---

## Performance Targets

- **Lighthouse Performance**: > 90
- **Lighthouse Accessibility**: > 90
- **Lighthouse Best Practices**: > 90
- **Lighthouse SEO**: > 90
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size** (main): < 100KB gzipped

---

## Security Checklist

- [ ] All API keys in environment variables
- [ ] No secrets in git history
- [ ] Input sanitization on all user inputs
- [ ] HTTPS everywhere
- [ ] CSP headers configured
- [ ] No inline scripts

---

## When Stuck

1. **Check the TODO.md** - Is there a prerequisite step missing?
2. **Check SUPERHUMAN_STYLE.md** - For design decisions
3. **Check aeo-blogs repo** - For article format reference
4. **Run the FACT-CHECK** - Identify what's actually broken
5. **Simplify** - Can the feature be implemented simpler?

---

## Quick Commands

```bash
# Start development
npm run dev

# Generate content
npm run generate -- --config=./venture.config.json

# Type check
npm run typecheck

# Build for production
npm run build

# Deploy
npm run deploy
```

---

## Reference Files

| File | Purpose |
|------|---------|
| `SUPERHUMAN_STYLE.md` | Design system reference |
| `TODO.md` | Implementation checklist |
| `venture.config.json` | Configuration template |
| `aeo-blogs/components/ArticleRenderer.tsx` | Article rendering reference |
| `aeo-blogs/lib/content.ts` | Content types reference |
