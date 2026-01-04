# OpenVenture Web App - Comprehensive Build Plan

> **Vision**: Non-technical founders visit openventure.vercel.app, type their business idea, and get a complete venture (landing page + 20 blog articles) they can download and deploy.

> **Constraints**:
> - 10 generations per day per visitor (no auth)
> - ~20 minutes generation time
> - ZIP download for code handoff
> - Full preview (landing + blog)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     openventure.vercel.app                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Frontend   │───▶│   API Routes │───▶│   Inngest    │       │
│  │   (Next.js)  │    │   (Next.js)  │    │   (Jobs)     │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                   │                │
│         │                   ▼                   ▼                │
│         │            ┌──────────────┐    ┌──────────────┐       │
│         │            │   Upstash    │    │    Gemini    │       │
│         │            │   Redis      │    │    API       │       │
│         │            └──────────────┘    └──────────────┘       │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Preview    │    │  Rate Limit  │    │  Vercel Blob │       │
│  │   (iframe)   │    │  (10/day)    │    │  (Storage)   │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Install Dependencies
- [ ] Install Inngest SDK: `npm install inngest`
- [ ] Install Upstash Redis: `npm install @upstash/redis`
- [ ] Install Vercel Blob: `npm install @vercel/blob`
- [ ] Install JSZip for client-side ZIP: `npm install jszip file-saver`
- [ ] Install types: `npm install -D @types/file-saver`

### 1.2 Environment Variables
Create/update `.env.local`:
```env
# Existing
GEMINI_API_KEY=your_gemini_key

# New - Upstash Redis (for rate limiting + job status)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# New - Vercel Blob (for storing generated files)
BLOB_READ_WRITE_TOKEN=xxx

# New - Inngest
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://openventure.vercel.app
```

- [ ] Create Upstash Redis database at https://console.upstash.com
- [ ] Get Vercel Blob token from Vercel dashboard
- [ ] Create Inngest account at https://app.inngest.com
- [ ] Add all secrets to Vercel project settings

### 1.3 Project Structure
```
src/
├── app/
│   ├── page.tsx                      # Landing page with generate form
│   ├── layout.tsx                    # Update with web app meta
│   ├── generate/
│   │   └── [jobId]/
│   │       └── page.tsx              # Progress + preview page
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts              # POST: Start generation job
│   │   ├── jobs/
│   │   │   └── [jobId]/
│   │   │       └── status/
│   │   │           └── route.ts      # GET: Poll job status
│   │   ├── download/
│   │   │   └── [jobId]/
│   │   │       └── route.ts          # GET: Download ZIP
│   │   └── inngest/
│   │       └── route.ts              # Inngest webhook handler
│   └── preview/
│       └── [jobId]/
│           ├── page.tsx              # Full preview page
│           └── blog/
│               └── [slug]/
│                   └── page.tsx      # Blog article preview
├── components/
│   ├── webapp/
│   │   ├── GenerateForm.tsx          # Main input form
│   │   ├── ProgressTracker.tsx       # Progress bar + messages
│   │   ├── VenturePreview.tsx        # iframe preview container
│   │   ├── PreviewNav.tsx            # Navigation within preview
│   │   ├── DownloadSection.tsx       # Download ZIP button
│   │   └── RateLimitBanner.tsx       # Shows remaining generations
│   └── ... (existing components)
├── lib/
│   ├── inngest/
│   │   ├── client.ts                 # Inngest client setup
│   │   └── functions/
│   │       └── generate-venture.ts   # Main generation function
│   ├── redis/
│   │   └── client.ts                 # Upstash Redis client
│   ├── storage/
│   │   └── blob.ts                   # Vercel Blob helpers
│   ├── rate-limit/
│   │   └── index.ts                  # Rate limiting logic
│   └── zip/
│       └── generator.ts              # ZIP file generation
└── types/
    └── webapp.ts                     # Web app specific types
```

- [ ] Create directory structure
- [ ] Create placeholder files

---

## Phase 2: Rate Limiting System

### 2.1 Redis Client Setup
**File:** `src/lib/redis/client.ts`

```typescript
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

- [ ] Create Redis client
- [ ] Test connection

### 2.2 Rate Limiting Logic
**File:** `src/lib/rate-limit/index.ts`

```typescript
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(visitorId: string): Promise<RateLimitResult>;
export async function incrementUsage(visitorId: string): Promise<void>;
export async function getRemainingGenerations(visitorId: string): Promise<number>;
```

Implementation requirements:
- [ ] Use visitor ID from cookie (set if not exists)
- [ ] Key format: `ratelimit:{visitorId}:{YYYY-MM-DD}`
- [ ] Max 10 generations per day
- [ ] Auto-expire keys after 24 hours
- [ ] Return remaining count for UI display

### 2.3 Middleware for Rate Limit Cookie
**File:** `src/middleware.ts`

- [ ] Check for `vid` cookie on every request
- [ ] Generate UUID if not exists
- [ ] Set cookie with 1-year expiry
- [ ] Pass visitor ID to API routes via header

### 2.4 Rate Limit Banner Component
**File:** `src/components/webapp/RateLimitBanner.tsx`

- [ ] Fetch remaining generations on page load
- [ ] Display: "You have X generations remaining today"
- [ ] Show warning when < 3 remaining
- [ ] Show error state when limit reached

---

## Phase 3: Backend API Routes

### 3.1 Generate Endpoint
**File:** `src/app/api/generate/route.ts`

```typescript
// POST /api/generate
// Body: { description: string }
// Response: { jobId: string } | { error: string }
```

Implementation:
- [ ] Validate description (min 20 chars, max 5000 chars)
- [ ] Check rate limit
- [ ] Generate unique job ID (nanoid)
- [ ] Create job record in Redis with status 'pending'
- [ ] Trigger Inngest event `venture/generate`
- [ ] Increment rate limit counter
- [ ] Return job ID

### 3.2 Job Status Endpoint
**File:** `src/app/api/jobs/[jobId]/status/route.ts`

```typescript
// GET /api/jobs/:jobId/status
// Response: {
//   status: 'pending' | 'running' | 'completed' | 'failed',
//   progress: number (0-100),
//   currentStep: string,
//   result?: { previewUrl, downloadUrl },
//   error?: string
// }
```

Implementation:
- [ ] Fetch job from Redis
- [ ] Return 404 if not found
- [ ] Return current status and progress
- [ ] Include result URLs when completed

### 3.3 Download Endpoint
**File:** `src/app/api/download/[jobId]/route.ts`

```typescript
// GET /api/download/:jobId
// Response: ZIP file stream
```

Implementation:
- [ ] Verify job exists and is completed
- [ ] Fetch files from Vercel Blob
- [ ] Generate ZIP on-the-fly using JSZip
- [ ] Stream response with correct headers
- [ ] Include README.md with setup instructions

### 3.4 Inngest Webhook Handler
**File:** `src/app/api/inngest/route.ts`

- [ ] Set up Inngest serve handler
- [ ] Register all Inngest functions
- [ ] Configure for Vercel deployment

---

## Phase 4: Inngest Background Jobs

### 4.1 Inngest Client Setup
**File:** `src/lib/inngest/client.ts`

```typescript
import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'openventure',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
```

- [ ] Create Inngest client
- [ ] Configure event types

### 4.2 Main Generation Function
**File:** `src/lib/inngest/functions/generate-venture.ts`

```typescript
export const generateVenture = inngest.createFunction(
  {
    id: 'generate-venture',
    retries: 2,
  },
  { event: 'venture/generate' },
  async ({ event, step }) => {
    const { jobId, description, visitorId } = event.data;

    // Step 1: Generate venture config from description
    await step.run('generate-config', async () => { ... });

    // Step 2: Generate landing page content
    await step.run('generate-landing', async () => { ... });

    // Step 3: Generate blog topics
    await step.run('generate-topics', async () => { ... });

    // Step 4-23: Generate each of 20 articles (parallel batches)
    await step.run('generate-articles-batch-1', async () => { ... }); // 5 articles
    await step.run('generate-articles-batch-2', async () => { ... }); // 5 articles
    await step.run('generate-articles-batch-3', async () => { ... }); // 5 articles
    await step.run('generate-articles-batch-4', async () => { ... }); // 5 articles

    // Step 24: Validate all links
    await step.run('validate-links', async () => { ... });

    // Step 25: Generate preview HTML
    await step.run('generate-preview', async () => { ... });

    // Step 26: Bundle and upload to Blob storage
    await step.run('upload-bundle', async () => { ... });

    // Step 27: Update job status to completed
    await step.run('finalize', async () => { ... });
  }
);
```

Implementation requirements:
- [ ] Each step updates job progress in Redis
- [ ] Progress calculation: config (5%), landing (10%), topics (5%), articles (60%), validate (5%), preview (10%), upload (5%)
- [ ] Store intermediate results in Redis for recovery
- [ ] Handle Gemini rate limits with backoff
- [ ] Clean error messages for user display

### 4.3 Progress Update Helper
**File:** `src/lib/inngest/progress.ts`

```typescript
export async function updateJobProgress(
  jobId: string,
  progress: number,
  currentStep: string,
  details?: object
): Promise<void>;
```

- [ ] Update Redis job record
- [ ] Store timestamp for each update
- [ ] Log progress for debugging

### 4.4 Article Generation with Batching
- [ ] Generate articles in batches of 5
- [ ] Parallel generation within each batch
- [ ] 2-second delay between batches (rate limit)
- [ ] Update progress after each article: "Generating article X of 20"

---

## Phase 5: File Storage System

### 5.1 Vercel Blob Helpers
**File:** `src/lib/storage/blob.ts`

```typescript
export async function uploadVentureFiles(
  jobId: string,
  files: VentureFile[]
): Promise<string>; // Returns base URL

export async function getVentureFiles(
  jobId: string
): Promise<VentureFile[]>;

export async function deleteVentureFiles(
  jobId: string
): Promise<void>;
```

- [ ] Implement file upload to Blob
- [ ] Organize files: `ventures/{jobId}/...`
- [ ] Set appropriate content types
- [ ] Handle large files (blog content)

### 5.2 File Structure in Blob Storage
```
ventures/
└── {jobId}/
    ├── config.json              # Venture configuration
    ├── content/
    │   ├── landing/
    │   │   └── content.json     # Landing page content
    │   └── blog/
    │       ├── manifest.json    # Blog manifest
    │       └── {slug}.json      # Individual articles
    ├── preview/
    │   ├── index.html           # Landing page preview
    │   └── blog/
    │       └── {slug}.html      # Article previews
    └── metadata.json            # Job metadata, timestamps
```

- [ ] Create upload function for each file type
- [ ] Generate preview HTML during upload
- [ ] Store metadata for cleanup scheduling

### 5.3 Cleanup Job (Optional - Phase 2)
- [ ] Delete files older than 7 days
- [ ] Run daily via Inngest cron
- [ ] Log deletions for monitoring

---

## Phase 6: Preview System

### 6.1 Preview HTML Generator
**File:** `src/lib/preview/generator.ts`

```typescript
export function generateLandingPreviewHTML(
  content: LandingPageContent,
  config: VentureConfig
): string;

export function generateArticlePreviewHTML(
  article: Article,
  config: VentureConfig
): string;

export function generateBlogIndexPreviewHTML(
  articles: Article[],
  config: VentureConfig
): string;
```

Implementation:
- [ ] Generate standalone HTML with inline CSS
- [ ] Include all Tailwind styles needed
- [ ] Use CSS variables for brand colors
- [ ] Make links work within preview (relative paths)
- [ ] Include Inter font from Google Fonts

### 6.2 Preview Page Component
**File:** `src/app/preview/[jobId]/page.tsx`

- [ ] Fetch preview HTML from Blob storage
- [ ] Render in sandboxed iframe
- [ ] Add navigation: Landing | Blog | Articles
- [ ] Show venture name in header
- [ ] "Download Code" button fixed at bottom

### 6.3 Preview Navigation
**File:** `src/components/webapp/PreviewNav.tsx`

```typescript
interface PreviewNavProps {
  jobId: string;
  currentPage: 'landing' | 'blog' | 'article';
  articleSlug?: string;
  articles: Array<{ slug: string; title: string }>;
}
```

- [ ] Tab navigation: Landing Page | Blog
- [ ] Dropdown for individual articles
- [ ] Mobile-responsive design
- [ ] Highlight current page

### 6.4 iframe Preview Component
**File:** `src/components/webapp/VenturePreview.tsx`

- [ ] Sandboxed iframe with `allow-scripts`
- [ ] Loading state while HTML loads
- [ ] Error state if preview fails
- [ ] Responsive height adjustment
- [ ] Desktop/mobile preview toggle (stretch goal)

---

## Phase 7: Frontend Pages & Components

### 7.1 Landing Page Redesign
**File:** `src/app/page.tsx`

New sections:
- [ ] Hero: "Launch Your Venture in 20 Minutes"
- [ ] Single large text input with placeholder
- [ ] "Generate My Venture" button
- [ ] Rate limit indicator
- [ ] How it works (3 steps)
- [ ] Example ventures gallery (stretch goal)

Design requirements:
- [ ] Clean, minimal design
- [ ] Mobile-first responsive
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Fast loading (no heavy images)

### 7.2 Generate Form Component
**File:** `src/components/webapp/GenerateForm.tsx`

```typescript
interface GenerateFormProps {
  remainingGenerations: number;
  onSubmit: (description: string) => Promise<void>;
}
```

- [ ] Textarea with character count
- [ ] Min 50 chars, max 5000 chars
- [ ] Placeholder with example description
- [ ] Submit button with loading state
- [ ] Error display for validation/rate limit
- [ ] Disable when limit reached

### 7.3 Progress Page
**File:** `src/app/generate/[jobId]/page.tsx`

- [ ] Poll job status every 3 seconds
- [ ] Display progress bar (0-100%)
- [ ] Show current step message
- [ ] Estimated time remaining
- [ ] Cancel button (marks job as cancelled)
- [ ] Redirect to preview when complete
- [ ] Error state with retry option

### 7.4 Progress Tracker Component
**File:** `src/components/webapp/ProgressTracker.tsx`

```typescript
interface ProgressTrackerProps {
  progress: number;
  currentStep: string;
  startedAt: Date;
}
```

- [ ] Animated progress bar
- [ ] Step indicator with checkmarks
- [ ] Current action message
- [ ] Elapsed time display
- [ ] Fun loading messages rotation

Progress steps to display:
1. "Analyzing your business idea..."
2. "Creating your brand identity..."
3. "Designing your landing page..."
4. "Planning your content strategy..."
5. "Writing blog article X of 20..."
6. "Optimizing for search engines..."
7. "Building your preview..."
8. "Packaging your code..."

### 7.5 Download Section Component
**File:** `src/components/webapp/DownloadSection.tsx`

- [ ] "Download Your Code" heading
- [ ] ZIP download button (primary)
- [ ] File size indicator
- [ ] "What's included" expandable list
- [ ] Setup instructions summary
- [ ] Link to full documentation

---

## Phase 8: ZIP Generation

### 8.1 ZIP Generator
**File:** `src/lib/zip/generator.ts`

```typescript
export async function generateVentureZip(
  jobId: string,
  config: VentureConfig,
  content: VentureContent
): Promise<Blob>;
```

ZIP structure:
```
{venture-name}/
├── README.md                    # Quick start guide
├── package.json                 # Dependencies
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── venture.config.json         # Generated config
├── .env.example                # Environment template
├── .gitignore
├── src/
│   ├── app/                    # All pages
│   ├── components/             # All components
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript types
│   └── styles/                 # CSS files
├── content/
│   ├── landing/
│   │   └── content.json
│   └── blog/
│       ├── manifest.json
│       └── *.json              # All articles
└── public/
    └── ...                     # Static assets
```

- [ ] Include all source files from repo
- [ ] Include generated content
- [ ] Generate customized README.md
- [ ] Set correct file permissions
- [ ] Exclude unnecessary files (.git, node_modules, etc.)

### 8.2 README Generator
**File:** `src/lib/zip/readme.ts`

Generate README with:
- [ ] Venture name and description
- [ ] Quick start commands
- [ ] Prerequisites (Node.js, npm)
- [ ] Environment setup instructions
- [ ] Development commands
- [ ] Deployment guide (Vercel)
- [ ] Customization tips
- [ ] Link to full documentation

### 8.3 Client-Side ZIP Assembly
**File:** `src/components/webapp/DownloadButton.tsx`

For faster downloads, assemble ZIP client-side:
- [ ] Fetch file list from API
- [ ] Download files in parallel
- [ ] Assemble ZIP using JSZip
- [ ] Trigger download with FileSaver
- [ ] Show progress during assembly

---

## Phase 9: Error Handling & Edge Cases

### 9.1 Error Types
```typescript
enum GenerationError {
  RATE_LIMITED = 'RATE_LIMITED',
  INVALID_INPUT = 'INVALID_INPUT',
  GEMINI_ERROR = 'GEMINI_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}
```

### 9.2 Error Handling Requirements
- [ ] Graceful Gemini API failures (retry 3x)
- [ ] Handle rate limits from Gemini (exponential backoff)
- [ ] Partial generation recovery (resume from last step)
- [ ] User-friendly error messages
- [ ] Error logging for debugging
- [ ] Slack/email alerts for critical failures (stretch goal)

### 9.3 Edge Cases to Handle
- [ ] User closes browser during generation → job continues
- [ ] User returns to in-progress job → show current progress
- [ ] Job fails midway → show partial results if available
- [ ] Storage quota exceeded → alert and cleanup old jobs
- [ ] Concurrent generation attempts → queue or reject
- [ ] Invalid/malicious input → sanitize and validate
- [ ] Very long descriptions → truncate appropriately

### 9.4 Timeout Handling
- [ ] Individual step timeout: 5 minutes
- [ ] Total job timeout: 30 minutes
- [ ] Mark job as failed on timeout
- [ ] Notify user with retry option

---

## Phase 10: Testing

### 10.1 Unit Tests
- [ ] Rate limiting logic
- [ ] ZIP generation
- [ ] Preview HTML generation
- [ ] Input validation
- [ ] Progress calculation

### 10.2 Integration Tests
- [ ] Full generation flow (use mock Gemini)
- [ ] API endpoints
- [ ] Inngest function execution
- [ ] Blob storage operations

### 10.3 E2E Tests (Playwright)
- [ ] Submit generation form
- [ ] View progress page
- [ ] Preview generated venture
- [ ] Download ZIP file
- [ ] Rate limit enforcement

### 10.4 Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test with slow network (3G simulation)
- [ ] Test rate limit at exactly 10 generations
- [ ] Test with minimum input (50 chars)
- [ ] Test with maximum input (5000 chars)
- [ ] Test job recovery after browser close
- [ ] Test concurrent users

---

## Phase 11: Deployment & Monitoring

### 11.1 Vercel Configuration
**File:** `vercel.json`

```json
{
  "functions": {
    "src/app/api/inngest/route.ts": {
      "maxDuration": 300
    }
  }
}
```

- [ ] Configure function timeouts
- [ ] Set up environment variables
- [ ] Configure Inngest integration
- [ ] Set up Vercel Blob storage

### 11.2 Inngest Dashboard Setup
- [ ] Connect Inngest to Vercel project
- [ ] Configure retry policies
- [ ] Set up failure alerts
- [ ] Monitor job queue depth

### 11.3 Monitoring & Analytics
- [ ] Track generations per day
- [ ] Track success/failure rates
- [ ] Track average generation time
- [ ] Track popular business categories
- [ ] Track download counts

### 11.4 Logging
- [ ] Structured logging for all API routes
- [ ] Log job progress updates
- [ ] Log errors with context
- [ ] Log rate limit events

---

## Phase 12: Documentation

### 12.1 User Documentation
- [ ] Landing page "How it Works" section
- [ ] FAQ section
- [ ] Video walkthrough (stretch goal)
- [ ] Example ventures showcase

### 12.2 Developer Documentation
- [ ] Architecture overview
- [ ] API documentation
- [ ] Deployment guide
- [ ] Contributing guidelines

### 12.3 In-App Help
- [ ] Tooltips on form fields
- [ ] Error message explanations
- [ ] Progress step descriptions
- [ ] Post-download instructions

---

## Implementation Order

### Week 1: Foundation
1. [ ] Project setup (dependencies, env vars)
2. [ ] Redis client + rate limiting
3. [ ] Basic API routes (generate, status)
4. [ ] Inngest setup + basic job function

### Week 2: Generation Pipeline
5. [ ] Full Inngest generation function
6. [ ] Progress updates to Redis
7. [ ] Vercel Blob storage integration
8. [ ] Link validation integration

### Week 3: Frontend
9. [ ] Landing page with form
10. [ ] Progress page with polling
11. [ ] Preview HTML generation
12. [ ] Preview page with iframe

### Week 4: Polish & Launch
13. [ ] ZIP generation + download
14. [ ] Error handling
15. [ ] Testing
16. [ ] Deployment + monitoring

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Generation success rate | > 95% |
| Average generation time | < 25 minutes |
| User completes download | > 80% of completions |
| Daily active generations | Track growth |
| Error rate | < 5% |

---

## Future Enhancements (Post-Launch)

- [ ] User accounts for generation history
- [ ] Custom domain support
- [ ] Template selection (different styles)
- [ ] One-click Vercel deploy button
- [ ] GitHub repo creation
- [ ] Real-time collaboration
- [ ] A/B testing for landing pages
- [ ] Analytics dashboard for users
- [ ] API access for developers
- [ ] White-label option

---

*Created: 2026-01-04*
*Status: Planning*
*Owner: OpenVenture Team*
