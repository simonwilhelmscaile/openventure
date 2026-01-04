#!/bin/bash
#
# OpenVenture Local Clean-Room Test
#
# This script tests the ENTIRE OpenVenture pipeline locally.
# Use this when Docker is not available.
#
# Usage:
#   ./scripts/local-clean-room-test.sh
#   GEMINI_API_KEY=your_key ./scripts/local-clean-room-test.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║        OpenVenture Local Clean-Room Test                             ║"
echo "║        Testing full pipeline                                         ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check for GEMINI_API_KEY
if [ -z "$GEMINI_API_KEY" ]; then
    # Try to load from .env
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ ERROR: GEMINI_API_KEY not found"
    echo ""
    echo "Please set it:"
    echo "  export GEMINI_API_KEY=your_key"
    echo "  # or"
    echo "  echo 'GEMINI_API_KEY=your_key' > .env"
    exit 1
fi

echo "✓ GEMINI_API_KEY found"
echo ""

# Random venture ideas for testing
VENTURE_IDEAS=(
    "AI-powered recipe generator that creates personalized meal plans based on dietary restrictions"
    "Smart home energy optimizer that reduces electricity bills using ML"
    "Virtual fitness coach with computer vision for form correction"
    "Automated podcast transcription and highlight clipper"
    "AI tutor that adapts to each student's learning style"
)

VENTURE_NAMES=(
    "RecipeAI"
    "EcoWatt"
    "FitMirror"
    "PodClip"
    "LearnSmart"
)

VENTURE_INDUSTRIES=(
    "food-tech"
    "green-tech"
    "health"
    "content"
    "education"
)

# Select random venture
RANDOM_INDEX=$((RANDOM % ${#VENTURE_IDEAS[@]}))
VENTURE_IDEA="${VENTURE_IDEAS[$RANDOM_INDEX]}"
VENTURE_NAME="${VENTURE_NAMES[$RANDOM_INDEX]}"
VENTURE_INDUSTRY="${VENTURE_INDUSTRIES[$RANDOM_INDEX]}"

echo "═══════════════════════════════════════════════════════════════════════"
echo "Test Venture Configuration"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "  Name:     $VENTURE_NAME"
echo "  Industry: $VENTURE_INDUSTRY"
echo "  Idea:     $VENTURE_IDEA"
echo ""

# Backup existing content
if [ -d "content" ]; then
    echo "⚠️  Backing up existing content to content.backup"
    rm -rf content.backup 2>/dev/null || true
    mv content content.backup
fi

# Create test venture config
TEST_CONFIG="test-venture.config.json"
cat > "$TEST_CONFIG" << EOF
{
  "\$schema": "./venture.schema.json",
  "idea": "$VENTURE_IDEA",
  "name": "$VENTURE_NAME",
  "tagline": "Powered by AI, Built for You",
  "domain": "${VENTURE_NAME,,}.vercel.app",

  "business": {
    "industry": "$VENTURE_INDUSTRY",
    "category": "AI Platform",
    "target_audience": "Tech-savvy professionals and early adopters",
    "pain_points": [
      "Current solutions are too manual",
      "Existing tools lack AI intelligence",
      "No unified platform exists"
    ],
    "value_proposition": "The first AI-native solution for this need",
    "unique_selling_points": [
      "AI-powered automation",
      "Real-time insights",
      "Seamless integration",
      "Enterprise security"
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
    "personality": ["innovative", "trustworthy", "efficient"],
    "colors": {
      "primary": "#6366F1",
      "secondary": "#1E1B4B",
      "accent": "#A5B4FC",
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
    "article_count": 5,
    "locale": "en-US",
    "author": {
      "name": "$VENTURE_NAME Team",
      "role": "Content Team",
      "company": "$VENTURE_NAME",
      "image_url": ""
    },
    "seo": {
      "primary_keyword": "$VENTURE_NAME AI",
      "secondary_keywords": ["AI automation", "machine learning", "smart solutions"],
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
    "rate_limit_delay_ms": 2000,
    "enable_competitor_analysis": false,
    "enable_seo_optimization": true
  }
}
EOF

echo "✓ Created test config: $TEST_CONFIG"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Cleaning up..."
    rm -f "$TEST_CONFIG"

    # Restore original content if it exists
    if [ -d "content.backup" ]; then
        rm -rf content 2>/dev/null || true
        mv content.backup content
        echo "✓ Restored original content"
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Step 1: TypeScript check
echo "═══════════════════════════════════════════════════════════════════════"
echo "Step 1/6: TypeScript Check"
echo "═══════════════════════════════════════════════════════════════════════"
npm run typecheck
echo "✓ TypeScript check passed"
echo ""

# Step 2: Lint check
echo "═══════════════════════════════════════════════════════════════════════"
echo "Step 2/6: ESLint Check"
echo "═══════════════════════════════════════════════════════════════════════"
npm run lint
echo "✓ Lint check passed"
echo ""

# Step 3: Generate content
echo "═══════════════════════════════════════════════════════════════════════"
echo "Step 3/6: Generate Content"
echo "═══════════════════════════════════════════════════════════════════════"
echo "Generating landing page + 5 blog articles..."
echo "This may take 5-10 minutes..."
echo ""

npm run generate -- --config="$TEST_CONFIG"

echo ""
echo "✓ Content generation completed"
echo ""

# Step 4: Validate links
echo "═══════════════════════════════════════════════════════════════════════"
echo "Step 4/6: Link Validation"
echo "═══════════════════════════════════════════════════════════════════════"

# First run with --fix to auto-correct any issues
npm run validate-links -- --fix --skip-external

# Then run strict validation
npm run validate-links -- --strict --skip-external

echo "✓ Link validation passed"
echo ""

# Step 5: Production build
echo "═══════════════════════════════════════════════════════════════════════"
echo "Step 5/6: Production Build"
echo "═══════════════════════════════════════════════════════════════════════"
npm run build

echo ""
echo "✓ Production build completed"
echo ""

# Step 6: Verify output
echo "═══════════════════════════════════════════════════════════════════════"
echo "Step 6/6: Output Verification"
echo "═══════════════════════════════════════════════════════════════════════"

# Check content directory exists
if [ ! -d "content" ]; then
    echo "❌ ERROR: content directory not found"
    exit 1
fi

# Check landing page content
if [ ! -f "content/landing/content.json" ]; then
    echo "❌ ERROR: Landing page content not found"
    exit 1
fi
echo "✓ Landing page content exists"

# Check blog manifest
if [ ! -f "content/blog/manifest.json" ]; then
    echo "❌ ERROR: Blog manifest not found"
    exit 1
fi

# Count articles
ARTICLE_COUNT=$(node -e "console.log(require('./content/blog/manifest.json').articles.length)")
echo "✓ Found $ARTICLE_COUNT blog articles"

# Check .next build directory
if [ ! -d ".next" ]; then
    echo "❌ ERROR: .next build directory not found"
    exit 1
fi
echo "✓ Next.js build directory exists"

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "                    ✅ ALL TESTS PASSED"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "Summary:"
echo "  - Venture: $VENTURE_NAME ($VENTURE_INDUSTRY)"
echo "  - TypeScript: ✓"
echo "  - ESLint: ✓"
echo "  - Content Generation: ✓ ($ARTICLE_COUNT articles)"
echo "  - Link Validation: ✓"
echo "  - Production Build: ✓"
echo ""
echo "OpenVenture is ready for distribution!"
echo ""
