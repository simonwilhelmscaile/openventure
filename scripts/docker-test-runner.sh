#!/bin/bash
#
# OpenVenture Docker Test Runner
# This script runs INSIDE the Docker container
#

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║          OpenVenture Clean-Room Test Runner                      ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check for required environment variable
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ ERROR: GEMINI_API_KEY environment variable is required"
    exit 1
fi

echo "✓ GEMINI_API_KEY is set"
echo ""

# Use test config if provided, otherwise use the random one
CONFIG_FILE="${TEST_CONFIG:-/app/test-venture.config.json}"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ ERROR: Config file not found: $CONFIG_FILE"
    exit 1
fi

echo "📋 Using config: $CONFIG_FILE"
echo ""

# Display venture info
VENTURE_NAME=$(node -e "console.log(require('$CONFIG_FILE').name)")
VENTURE_IDEA=$(node -e "console.log(require('$CONFIG_FILE').idea)")
echo "   Name: $VENTURE_NAME"
echo "   Idea: $VENTURE_IDEA"
echo ""

# Step 1: TypeScript check
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 1/6: TypeScript Check"
echo "═══════════════════════════════════════════════════════════════════"
npm run typecheck
echo "✓ TypeScript check passed"
echo ""

# Step 2: Lint check
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 2/6: ESLint Check"
echo "═══════════════════════════════════════════════════════════════════"
npm run lint
echo "✓ Lint check passed"
echo ""

# Step 3: Generate content
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 3/6: Generate Content"
echo "═══════════════════════════════════════════════════════════════════"
echo "This may take 10-20 minutes for 20 articles..."
echo ""

# Run generation with the test config
npm run generate -- --config="$CONFIG_FILE"

echo ""
echo "✓ Content generation completed"
echo ""

# Step 4: Validate links
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 4/6: Link Validation"
echo "═══════════════════════════════════════════════════════════════════"

# First run with --fix to auto-correct any issues
npm run validate-links -- --fix --skip-external

# Then run strict validation
npm run validate-links -- --strict --skip-external

echo "✓ Link validation passed"
echo ""

# Step 5: Production build
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 5/6: Production Build"
echo "═══════════════════════════════════════════════════════════════════"
npm run build

echo ""
echo "✓ Production build completed"
echo ""

# Step 6: Verify output
echo "═══════════════════════════════════════════════════════════════════"
echo "Step 6/6: Output Verification"
echo "═══════════════════════════════════════════════════════════════════"

# Check content directory exists
if [ ! -d "/app/content" ]; then
    echo "❌ ERROR: content directory not found"
    exit 1
fi

# Check landing page content
if [ ! -f "/app/content/landing/content.json" ]; then
    echo "❌ ERROR: Landing page content not found"
    exit 1
fi
echo "✓ Landing page content exists"

# Check blog manifest
if [ ! -f "/app/content/blog/manifest.json" ]; then
    echo "❌ ERROR: Blog manifest not found"
    exit 1
fi

# Count articles
ARTICLE_COUNT=$(node -e "console.log(require('/app/content/blog/manifest.json').articles.length)")
echo "✓ Found $ARTICLE_COUNT blog articles"

if [ "$ARTICLE_COUNT" -lt 5 ]; then
    echo "⚠️  WARNING: Less than 5 articles generated (possibly due to rate limiting)"
fi

# Check .next build directory
if [ ! -d "/app/.next" ]; then
    echo "❌ ERROR: .next build directory not found"
    exit 1
fi
echo "✓ Next.js build directory exists"

# Check for static pages
if [ -d "/app/.next/server/app" ]; then
    echo "✓ Static pages generated"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "                    ✅ ALL TESTS PASSED"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "Summary:"
echo "  - TypeScript: ✓"
echo "  - ESLint: ✓"
echo "  - Content Generation: ✓ ($ARTICLE_COUNT articles)"
echo "  - Link Validation: ✓"
echo "  - Production Build: ✓"
echo ""
echo "The venture is ready for deployment!"
echo ""
