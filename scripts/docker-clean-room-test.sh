#!/bin/bash
#
# OpenVenture Clean-Room Docker Test
#
# This script tests the ENTIRE OpenVenture pipeline in a fresh Docker environment.
# It simulates what a new user would experience when cloning the repo.
#
# Usage:
#   ./scripts/docker-clean-room-test.sh
#   GEMINI_API_KEY=your_key ./scripts/docker-clean-room-test.sh
#   ./scripts/docker-clean-room-test.sh --venture="My Custom Venture"
#
# Requirements:
#   - Docker installed and running
#   - GEMINI_API_KEY environment variable (or in .env file)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║        OpenVenture Clean-Room Docker Test                            ║"
echo "║        Testing full pipeline in isolated environment                 ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Parse arguments
CUSTOM_VENTURE=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --venture=*)
            CUSTOM_VENTURE="${1#*=}"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

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

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERROR: Docker is not running"
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Random venture ideas for testing
VENTURE_IDEAS=(
    "AI-powered recipe generator that creates personalized meal plans based on dietary restrictions and available ingredients"
    "Smart home energy optimizer that learns usage patterns and reduces electricity bills by 30%"
    "Virtual fitness coach that creates adaptive workout plans using computer vision for form correction"
    "Automated podcast transcription and highlight clipper for social media content creators"
    "AI tutor platform that adapts teaching style to each student's learning pace and preferences"
    "Smart contract auditing tool that uses AI to detect vulnerabilities in blockchain code"
    "Mental health journaling app with AI-powered mood tracking and personalized wellness tips"
    "E-commerce inventory predictor that prevents stockouts using machine learning"
    "Language learning platform that uses AI to simulate real conversations with native speakers"
    "Resume optimization tool that tailors applications to specific job descriptions using AI"
)

VENTURE_NAMES=(
    "RecipeAI"
    "EcoWatt"
    "FitMirror"
    "PodClip"
    "LearnSmart"
    "AuditChain"
    "MindJournal"
    "StockSense"
    "ChatLingo"
    "ResumeBoost"
)

VENTURE_INDUSTRIES=(
    "food-tech"
    "green-tech"
    "health"
    "content"
    "education"
    "blockchain"
    "wellness"
    "ecommerce"
    "education"
    "hr-tech"
)

# Select random venture or use custom
if [ -n "$CUSTOM_VENTURE" ]; then
    VENTURE_IDEA="$CUSTOM_VENTURE"
    VENTURE_NAME="TestVenture"
    VENTURE_INDUSTRY="saas"
else
    RANDOM_INDEX=$((RANDOM % ${#VENTURE_IDEAS[@]}))
    VENTURE_IDEA="${VENTURE_IDEAS[$RANDOM_INDEX]}"
    VENTURE_NAME="${VENTURE_NAMES[$RANDOM_INDEX]}"
    VENTURE_INDUSTRY="${VENTURE_INDUSTRIES[$RANDOM_INDEX]}"
fi

echo "═══════════════════════════════════════════════════════════════════════"
echo "Test Venture Configuration"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "  Name:     $VENTURE_NAME"
echo "  Industry: $VENTURE_INDUSTRY"
echo "  Idea:     $VENTURE_IDEA"
echo ""

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
    "target_audience": "Tech-savvy professionals and early adopters looking for innovative solutions",
    "pain_points": [
      "Current solutions are too manual and time-consuming",
      "Existing tools lack AI-powered intelligence",
      "No unified platform for this specific need"
    ],
    "value_proposition": "The first AI-native solution that automates what was previously impossible",
    "unique_selling_points": [
      "AI-powered automation",
      "Real-time insights",
      "Seamless integration",
      "Enterprise-grade security"
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

# Build Docker image
echo "═══════════════════════════════════════════════════════════════════════"
echo "Building Docker Image"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

docker build -f Dockerfile.test -t openventure-test:latest .

echo ""
echo "✓ Docker image built successfully"
echo ""

# Run the test
echo "═══════════════════════════════════════════════════════════════════════"
echo "Running Clean-Room Test"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "Starting Docker container with isolated environment..."
echo "This will take 10-20 minutes for full generation..."
echo ""

# Run container with API key and test config
docker run --rm \
    -e GEMINI_API_KEY="$GEMINI_API_KEY" \
    -e TEST_CONFIG="/app/test-venture.config.json" \
    -v "$(pwd)/$TEST_CONFIG:/app/test-venture.config.json:ro" \
    -v "$(pwd)/test-results:/app/test-results" \
    openventure-test:latest

EXIT_CODE=$?

echo ""
echo "═══════════════════════════════════════════════════════════════════════"

if [ $EXIT_CODE -eq 0 ]; then
    echo "                    ✅ CLEAN-ROOM TEST PASSED"
    echo "═══════════════════════════════════════════════════════════════════════"
    echo ""
    echo "OpenVenture is ready for distribution!"
    echo ""
    echo "Test Results:"
    echo "  - Venture: $VENTURE_NAME"
    echo "  - Industry: $VENTURE_INDUSTRY"
    echo "  - All checks passed"
    echo ""
    echo "Reports saved to: ./test-results/"
else
    echo "                    ❌ CLEAN-ROOM TEST FAILED"
    echo "═══════════════════════════════════════════════════════════════════════"
    echo ""
    echo "Check the logs above for error details."
    echo "Reports may be available in: ./test-results/"
fi

# Cleanup test config
rm -f "$TEST_CONFIG"

exit $EXIT_CODE
