# OpenVenture Launch Plan

> Testing and validation plan before releasing to 1,000 users.

---

## Phase 1: Code Readiness (Today)

### 1.1 Commit Everything to GitHub
```bash
# Review what will be committed
git status

# Add all files
git add -A

# Commit with detailed message
git commit -m "feat: OpenVenture v1.0 - AI venture generator

Core Features:
- Landing page generation via Gemini API
- Blog article generation (10 articles, 2000+ words each)
- Superhuman-style design system
- Static site with Next.js 16

Quality:
- Lighthouse: SEO 100%, Accessibility 96%, Performance 91%
- TypeScript strict mode, ESLint clean
- URL validation, SEO scoring scripts

Testing:
- Docker clean room test
- Example configs (SaaS, ecommerce, service)
- Playwright browser tests

Documentation:
- Complete README with 6-step quickstart
- Troubleshooting guide
- Configuration reference"

# Push to GitHub
git push origin main
```

### 1.2 Verify GitHub Repository
- [ ] All files visible at https://github.com/simonwilhelmscaile/openventure
- [ ] README renders correctly
- [ ] Example configs accessible
- [ ] No secrets exposed in code

---

## Phase 2: Fresh Clone Testing

### 2.1 Test Matrix

| Test | Environment | Config | Expected Result |
|------|-------------|--------|-----------------|
| Fresh Clone #1 | macOS | SaaS example | Full site generates |
| Fresh Clone #2 | Linux | Ecommerce example | Full site generates |
| Fresh Clone #3 | Windows WSL | Service example | Full site generates |
| Fresh Clone #4 | Docker | Custom config | Full site generates |
| Fresh Clone #5 | GitHub Codespaces | Minimal config | Full site generates |

### 2.2 Fresh Clone Test Script

```bash
#!/bin/bash
# test-fresh-clone.sh

set -e

echo "=== OpenVenture Fresh Clone Test ==="

# 1. Clone to temp directory
TEST_DIR="/tmp/openventure-test-$(date +%s)"
git clone https://github.com/simonwilhelmscaile/openventure.git "$TEST_DIR"
cd "$TEST_DIR"

# 2. Install dependencies
echo "Installing dependencies..."
npm install

# 3. Copy example config
cp examples/saas-venture.config.json venture.config.json

# 4. Verify API key is set
if [ -z "$GEMINI_API_KEY" ]; then
  echo "ERROR: GEMINI_API_KEY not set"
  exit 1
fi

# 5. Generate content
echo "Generating content..."
npm run generate

# 6. Verify generation
echo "Verifying generation..."
[ -f content/landing/content.json ] || { echo "FAIL: No landing content"; exit 1; }
[ -f content/blog/manifest.json ] || { echo "FAIL: No blog manifest"; exit 1; }

ARTICLE_COUNT=$(ls content/blog/*.json 2>/dev/null | grep -v manifest | wc -l)
echo "Generated $ARTICLE_COUNT articles"
[ "$ARTICLE_COUNT" -ge 5 ] || { echo "FAIL: Too few articles"; exit 1; }

# 7. Build
echo "Building..."
npm run build

# 8. Start and test
echo "Starting server..."
npm run start &
SERVER_PID=$!
sleep 5

# 9. Test endpoints
echo "Testing endpoints..."
curl -sf http://localhost:3000 > /dev/null || { echo "FAIL: Homepage"; kill $SERVER_PID; exit 1; }
curl -sf http://localhost:3000/blog > /dev/null || { echo "FAIL: Blog"; kill $SERVER_PID; exit 1; }
curl -sf http://localhost:3000/about > /dev/null || { echo "FAIL: About"; kill $SERVER_PID; exit 1; }

# 10. Cleanup
kill $SERVER_PID
rm -rf "$TEST_DIR"

echo "=== ALL TESTS PASSED ==="
```

### 2.3 Manual Checklist Per Test

- [ ] `git clone` succeeds
- [ ] `npm install` completes without errors
- [ ] Config file is easy to understand
- [ ] `npm run generate` produces output
- [ ] Generation takes < 15 minutes
- [ ] `npm run dev` starts server
- [ ] Homepage loads with correct content
- [ ] All navigation links work
- [ ] Blog page shows articles
- [ ] Individual articles render correctly
- [ ] Mobile view works
- [ ] `npm run build` succeeds
- [ ] Vercel deployment works

---

## Phase 3: Stress Testing for 1K Users

### 3.1 Gemini API Rate Limits

**Current Gemini Free Tier Limits:**
- 15 requests per minute (RPM)
- 1 million tokens per minute
- 1,500 requests per day

**Per Venture Generation:**
- Landing page: ~5-10 API calls
- 10 Blog articles: ~30-50 API calls
- Total: ~40-60 API calls per venture

**Impact at Scale:**
| Users | API Calls | Time (sequential) | Notes |
|-------|-----------|-------------------|-------|
| 1 | 50 | ~5-10 min | Works fine |
| 10 | 500 | ~50-100 min | May hit daily limit |
| 100 | 5,000 | Blocked | Exceeds daily limit |
| 1,000 | 50,000 | Blocked | Way over limit |

**Solutions:**
1. **User brings own API key** (current approach) - Each user has own limits
2. **Paid Gemini tier** - Higher limits for shared key
3. **Queue system** - Throttle generation requests
4. **Caching** - Cache common prompts/responses

### 3.2 Recommended Approach for 1K Users

```
Each user must provide their own GEMINI_API_KEY
This distributes API load across 1,000 separate quotas
```

**User Instructions:**
1. Get free Gemini API key (takes 2 minutes)
2. Clone repo
3. Set their key
4. Generate their venture

### 3.3 Unique Venture Validation

Test that different configs produce unique content:

```bash
# Generate 10 different ventures and compare
for i in {1..10}; do
  CONFIG="test-config-$i.json"
  # Create unique config
  cat > "$CONFIG" << EOF
{
  "name": "TestVenture$i",
  "idea": "Unique business idea number $i about $(shuf -n1 /usr/share/dict/words)",
  "tagline": "Tagline for venture $i",
  "business": {
    "industry": "saas",
    "target_audience": "Test audience $i"
  }
}
EOF

  npm run generate -- --config="$CONFIG"
  mv content/landing/content.json "output/landing-$i.json"
  mv content/blog "output/blog-$i"
done

# Compare outputs - should all be different
md5sum output/landing-*.json
```

---

## Phase 4: Error Handling Validation

### 4.1 Error Scenarios to Test

| Scenario | Expected Behavior | Test Command |
|----------|-------------------|--------------|
| No API key | Clear error message | `unset GEMINI_API_KEY && npm run generate` |
| Invalid API key | Clear error message | `GEMINI_API_KEY=invalid npm run generate` |
| Empty config | Validation error | Create empty venture.config.json |
| Missing required fields | Validation error | Remove "name" from config |
| API rate limit | Retry with backoff | Generate many articles rapidly |
| Network failure | Graceful failure | Disconnect network mid-generation |
| Disk full | Clear error | Fill disk before generation |
| Invalid JSON in config | Parse error | Add syntax error to config |

### 4.2 Error Message Quality Checklist

- [ ] Error messages are user-friendly (not stack traces)
- [ ] Errors suggest how to fix the problem
- [ ] Partial generation saves progress (doesn't lose all work)
- [ ] Failed articles can be regenerated individually

---

## Phase 5: Documentation Validation

### 5.1 README Testing

Have 3 people who haven't seen the project follow the README:

**Tester Profile:**
1. Technical founder (can use terminal)
2. Non-technical founder (basic terminal)
3. Developer (experienced)

**Questions to Answer:**
- [ ] Can they complete setup in < 30 minutes?
- [ ] Where did they get stuck?
- [ ] What was confusing?
- [ ] What questions did they have?

### 5.2 Documentation Gaps to Check

- [ ] Gemini API key creation has screenshots?
- [ ] All npm commands are explained?
- [ ] Config file options are documented?
- [ ] Troubleshooting covers common errors?
- [ ] Vercel deployment steps are clear?

---

## Phase 6: Pre-Launch Checklist

### 6.1 Code Quality
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] No console.logs in production code
- [ ] No hardcoded secrets
- [ ] No sensitive data in git history

### 6.2 Security
- [ ] API keys only from environment variables
- [ ] No secrets in example configs
- [ ] .gitignore covers sensitive files
- [ ] No SQL injection (N/A - no database)
- [ ] No XSS in generated content

### 6.3 User Experience
- [ ] Clear value proposition on GitHub README
- [ ] Time to first success < 30 minutes
- [ ] Error messages are helpful
- [ ] Generated sites look professional
- [ ] Generated content is high quality

### 6.4 Support Readiness
- [ ] GitHub Issues enabled
- [ ] Issue templates for bugs/features
- [ ] FAQ in README
- [ ] Contact method for urgent issues

---

## Phase 7: Soft Launch (100 Users)

### 7.1 Invite Strategy
1. Share with 100 beta users
2. Provide feedback form
3. Monitor GitHub Issues
4. Track completion rate

### 7.2 Metrics to Track

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Clone to generation success | > 80% | User survey |
| Generation completion | > 95% | User survey |
| Time to first site | < 30 min | User survey |
| User satisfaction | > 4/5 | Survey rating |
| GitHub stars | 50+ | GitHub |
| Issues reported | < 20 | GitHub Issues |

### 7.3 Feedback Form Questions

1. How long did it take to get your site running?
2. What was the hardest part?
3. Rate the quality of generated content (1-5)
4. Rate the design of your site (1-5)
5. Would you recommend this to a friend?
6. What features are missing?
7. Any bugs encountered?

---

## Phase 8: Full Launch (1,000 Users)

### 8.1 Prerequisites
- [ ] All Phase 1-6 complete
- [ ] Soft launch feedback addressed
- [ ] Critical bugs fixed
- [ ] Documentation updated based on feedback

### 8.2 Launch Channels
1. Product Hunt
2. Hacker News (Show HN)
3. Reddit (r/SideProject, r/startups)
4. Twitter/X
5. LinkedIn
6. Indie Hackers

### 8.3 Launch Day Monitoring
- [ ] Monitor GitHub Issues every hour
- [ ] Respond to questions within 2 hours
- [ ] Track GitHub stars/forks
- [ ] Monitor social media mentions

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Code Readiness | 1 hour | Not started |
| Phase 2: Fresh Clone Testing | 1 day | Not started |
| Phase 3: Stress Testing | 1 day | Not started |
| Phase 4: Error Handling | 1 day | Not started |
| Phase 5: Documentation | 1 day | Not started |
| Phase 6: Pre-Launch | 1 day | Not started |
| Phase 7: Soft Launch (100) | 1 week | Not started |
| Phase 8: Full Launch (1000) | After soft launch | Not started |

**Estimated Total: 2-3 weeks**

---

## Quick Start: What to Do Right Now

### Step 1: Push to GitHub (5 minutes)
```bash
git add -A
git commit -m "feat: OpenVenture v1.0"
git push origin main
```

### Step 2: Fresh Clone Test (30 minutes)
```bash
cd /tmp
git clone https://github.com/simonwilhelmscaile/openventure.git
cd openventure
npm install
cp examples/saas-venture.config.json venture.config.json
export GEMINI_API_KEY=your-key
npm run generate
npm run dev
# Open http://localhost:3000
```

### Step 3: Test Different Config (30 minutes)
```bash
cp examples/ecommerce-venture.config.json venture.config.json
rm -rf content/blog/*.json content/landing/content.json
npm run generate
npm run dev
```

### Step 4: Verify Vercel Deploy (15 minutes)
```bash
npx vercel
# Check preview URL works
npx vercel --prod
# Check production URL works
```

If all 4 steps pass, you're ready for soft launch.

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini API changes | Medium | High | Pin API version, monitor changelog |
| Rate limiting | High | Medium | Users bring own keys |
| Poor content quality | Medium | High | SEO scoring, manual review |
| Vercel deployment fails | Low | Medium | Document alternative (Netlify) |
| Users can't follow docs | Medium | High | Video tutorial backup |
| Generated sites look bad | Low | High | Lighthouse CI gates |

---

## Success Criteria

**Launch is successful if:**
1. 80%+ of users successfully generate a site
2. Average time to success < 30 minutes
3. < 10 critical bugs reported
4. User satisfaction > 4/5
5. 50+ GitHub stars in first week
