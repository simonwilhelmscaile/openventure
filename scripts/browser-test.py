#!/usr/bin/env python3
"""
Browser-Use Live Site Testing Script

Uses browser-use with Gemini to test the live OpenVenture site.
Run: .venv/bin/python scripts/browser-test.py
"""

import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")
load_dotenv(".env")

# Ensure Gemini API key is available
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not found in environment")
    print("Please set it in .env.local or export it")
    sys.exit(1)

# Set environment for Google AI
os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

from browser_use import Agent, Browser, BrowserProfile, ChatGoogle


async def test_site_navigation(base_url: str = "https://openventure.vercel.app"):
    """Test basic site navigation and check for 404s."""

    print(f"\n{'='*60}")
    print(f"Testing: {base_url}")
    print(f"{'='*60}\n")

    browser = Browser(
        browser_profile=BrowserProfile(
            headless=True,
        )
    )

    llm = ChatGoogle(model="gemini-2.0-flash-exp")

    agent = Agent(
        task=f"""
        Navigate to {base_url} and test the website thoroughly.

        Do the following:
        1. Visit the homepage and verify it loads correctly
        2. Click on the Blog link in the navigation
        3. Verify the blog page loads (not a 404)
        4. Click on the first blog article
        5. Verify the article loads (not a 404)
        6. Go back to homepage
        7. Scroll down to find the pricing section
        8. Click on any navigation links in the footer

        Report any 404 errors or broken links you encounter.
        Report the overall status of each page visited.
        """,
        llm=llm,
        browser=browser,
    )

    try:
        result = await agent.run()
        print("\n--- Test Results ---")
        print(result)
        return result
    except Exception as e:
        print(f"\nERROR during test: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        pass  # BrowserSession handles cleanup automatically


async def crawl_all_links(base_url: str = "https://openventure.vercel.app"):
    """Crawl all links on the site and check for 404s."""

    print(f"\n{'='*60}")
    print(f"Crawling all links: {base_url}")
    print(f"{'='*60}\n")

    browser = Browser(
        browser_profile=BrowserProfile(
            headless=True,
        )
    )

    llm = ChatGoogle(model="gemini-2.0-flash-exp")

    agent = Agent(
        task=f"""
        Go to {base_url} and systematically test all links on the site.

        Instructions:
        1. Navigate to the homepage
        2. Find and list ALL links on the page (navigation, footer, buttons, CTAs)
        3. Visit each internal link and verify it loads (HTTP 200, not 404)
        4. Report the following for each link:
           - Link text
           - URL
           - Status: OK or 404 or ERROR

        Be thorough. Check:
        - Main navigation links
        - Footer links
        - CTA buttons that link to pages
        - Blog article links
        - Any other clickable elements

        Compile a final report listing all links and their status.
        """,
        llm=llm,
        browser=browser,
    )

    try:
        result = await agent.run()
        print("\n--- Crawl Results ---")
        print(result)
        return result
    except Exception as e:
        print(f"\nERROR during crawl: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        pass  # BrowserSession handles cleanup automatically


async def test_buttons_and_interactions(base_url: str = "https://openventure.vercel.app"):
    """Test all buttons and interactive elements."""

    print(f"\n{'='*60}")
    print(f"Testing buttons and interactions: {base_url}")
    print(f"{'='*60}\n")

    browser = Browser(
        browser_profile=BrowserProfile(
            headless=True,
        )
    )

    llm = ChatGoogle(model="gemini-2.0-flash-exp")

    agent = Agent(
        task=f"""
        Go to {base_url} and test all interactive elements.

        Test the following:
        1. "Get Started" button in hero section
        2. "Learn more" button in hero section
        3. Navigation links (About, Pricing, Blog)
        4. Any dropdown menus
        5. Mobile hamburger menu (resize viewport to mobile)
        6. Pricing tier buttons
        7. FAQ accordion (if expandable)
        8. Footer links
        9. Contact form (if present)

        For each element:
        - Click/interact with it
        - Report what happens
        - Note if anything is broken

        Provide a summary of all interactions and their status.
        """,
        llm=llm,
        browser=browser,
    )

    try:
        result = await agent.run()
        print("\n--- Interaction Test Results ---")
        print(result)
        return result
    except Exception as e:
        print(f"\nERROR during interaction test: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        pass  # BrowserSession handles cleanup automatically


async def check_article_rendering(base_url: str = "https://openventure.vercel.app"):
    """Check that blog articles render properly (no raw markdown)."""

    print(f"\n{'='*60}")
    print(f"Checking article rendering: {base_url}/blog")
    print(f"{'='*60}\n")

    browser = Browser(
        browser_profile=BrowserProfile(
            headless=True,
        )
    )

    llm = ChatGoogle(model="gemini-2.0-flash-exp")

    agent = Agent(
        task=f"""
        Go to {base_url}/blog and check how articles render.

        Steps:
        1. Navigate to {base_url}/blog
        2. Click on the first article
        3. Carefully examine the article content for:
           - Raw markdown syntax like **bold** or *italic* (should NOT be visible)
           - Unrendered [links](url) (should be clickable links)
           - Raw markdown tables (should be proper HTML tables)
           - Unrendered bullet points (should be proper lists)
        4. Look for:
           - Proper headings (H1, H2, H3)
           - Images with alt text
           - Internal links to other pages
           - External links to sources
           - Tables displaying correctly
        5. Go back and check 2 more articles

        Report:
        - Are articles rendering correctly (no raw markdown)?
        - Are tables present and formatted?
        - Are images present?
        - Are there internal/external links?
        """,
        llm=llm,
        browser=browser,
    )

    try:
        result = await agent.run()
        print("\n--- Article Rendering Results ---")
        print(result)
        return result
    except Exception as e:
        print(f"\nERROR during article check: {e}")
        import traceback
        traceback.print_exc()
        return None
    finally:
        pass  # BrowserSession handles cleanup automatically


async def run_full_test_suite(base_url: str = "https://openventure.vercel.app"):
    """Run all tests and compile results."""

    print("\n" + "="*60)
    print("OPENVENTURE FULL TEST SUITE")
    print("="*60)
    print(f"Target: {base_url}")
    print("="*60 + "\n")

    results = {}

    # Test 1: Basic Navigation
    print("\n[1/4] Running Navigation Test...")
    results["navigation"] = await test_site_navigation(base_url)

    # Test 2: Link Crawl
    print("\n[2/4] Running Link Crawl...")
    results["crawl"] = await crawl_all_links(base_url)

    # Test 3: Buttons/Interactions
    print("\n[3/4] Running Interaction Test...")
    results["interactions"] = await test_buttons_and_interactions(base_url)

    # Test 4: Article Rendering
    print("\n[4/4] Running Article Rendering Check...")
    results["articles"] = await check_article_rendering(base_url)

    # Summary
    print("\n" + "="*60)
    print("TEST SUITE COMPLETE")
    print("="*60)

    return results


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Browser-Use Live Site Testing")
    parser.add_argument(
        "--url",
        default="https://openventure.vercel.app",
        help="Base URL to test"
    )
    parser.add_argument(
        "--test",
        choices=["navigation", "crawl", "interactions", "articles", "full"],
        default="full",
        help="Which test to run"
    )

    args = parser.parse_args()

    if args.test == "navigation":
        asyncio.run(test_site_navigation(args.url))
    elif args.test == "crawl":
        asyncio.run(crawl_all_links(args.url))
    elif args.test == "interactions":
        asyncio.run(test_buttons_and_interactions(args.url))
    elif args.test == "articles":
        asyncio.run(check_article_rendering(args.url))
    else:
        asyncio.run(run_full_test_suite(args.url))
