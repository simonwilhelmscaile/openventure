#!/usr/bin/env python3
"""
Visual Regression Testing Script

Takes screenshots of key pages and compares against baselines.
Run: .venv/bin/python scripts/visual-test.py
"""

import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime

# Try to import playwright
try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: playwright not installed")
    print("Run: pip install playwright && playwright install chromium")
    sys.exit(1)


# Configuration
BASE_URL = os.getenv("TEST_URL", "http://localhost:3000")
SCREENSHOT_DIR = Path("./test-results/screenshots")
BASELINE_DIR = Path("./test-results/baselines")

# Pages to capture
PAGES = [
    {"name": "homepage", "path": "/", "wait_for": "networkidle"},
    {"name": "blog", "path": "/blog", "wait_for": "networkidle"},
    {"name": "about", "path": "/about", "wait_for": "networkidle"},
    {"name": "contact", "path": "/contact", "wait_for": "networkidle"},
    {"name": "pricing", "path": "/#pricing", "wait_for": "networkidle"},
]

# Viewport sizes to test
VIEWPORTS = [
    {"name": "desktop", "width": 1920, "height": 1080},
    {"name": "tablet", "width": 768, "height": 1024},
    {"name": "mobile", "width": 375, "height": 812},
]


async def capture_screenshots(update_baselines: bool = False):
    """Capture screenshots of all pages at all viewport sizes."""

    # Create directories
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    if update_baselines:
        BASELINE_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        for viewport in VIEWPORTS:
            context = await browser.new_context(
                viewport={"width": viewport["width"], "height": viewport["height"]}
            )
            page = await context.new_page()

            for page_config in PAGES:
                url = f"{BASE_URL}{page_config['path']}"
                filename = f"{page_config['name']}_{viewport['name']}.png"

                try:
                    print(f"Capturing: {page_config['name']} @ {viewport['name']}...")

                    await page.goto(url, wait_until=page_config.get("wait_for", "load"))
                    await page.wait_for_timeout(1000)  # Wait for animations

                    # Capture screenshot
                    screenshot_path = SCREENSHOT_DIR / f"{timestamp}_{filename}"
                    await page.screenshot(path=str(screenshot_path), full_page=True)

                    # Update baseline if requested
                    if update_baselines:
                        baseline_path = BASELINE_DIR / filename
                        await page.screenshot(path=str(baseline_path), full_page=True)
                        print(f"  Updated baseline: {baseline_path}")

                    results.append({
                        "page": page_config["name"],
                        "viewport": viewport["name"],
                        "status": "captured",
                        "path": str(screenshot_path),
                    })

                except Exception as e:
                    print(f"  ERROR: {e}")
                    results.append({
                        "page": page_config["name"],
                        "viewport": viewport["name"],
                        "status": "error",
                        "error": str(e),
                    })

            await context.close()

        await browser.close()

    return results


def compare_screenshots():
    """Compare current screenshots against baselines."""

    if not BASELINE_DIR.exists():
        print("No baselines found. Run with --update-baselines first.")
        return []

    results = []

    for baseline_file in BASELINE_DIR.glob("*.png"):
        # Find corresponding current screenshot
        current_files = list(SCREENSHOT_DIR.glob(f"*_{baseline_file.name}"))

        if not current_files:
            results.append({
                "file": baseline_file.name,
                "status": "missing",
                "message": "No current screenshot found",
            })
            continue

        # Use most recent screenshot
        current_file = max(current_files, key=lambda f: f.stat().st_mtime)

        # Basic file size comparison (simple heuristic)
        baseline_size = baseline_file.stat().st_size
        current_size = current_file.stat().st_size

        size_diff = abs(baseline_size - current_size) / baseline_size * 100

        if size_diff < 5:  # Less than 5% difference
            results.append({
                "file": baseline_file.name,
                "status": "pass",
                "message": f"Size difference: {size_diff:.1f}%",
            })
        else:
            results.append({
                "file": baseline_file.name,
                "status": "changed",
                "message": f"Size difference: {size_diff:.1f}% (may need review)",
            })

    return results


def print_results(results, title):
    """Print results in a formatted table."""
    print(f"\n{'='*60}")
    print(title)
    print("="*60)

    for result in results:
        status = result.get("status", "unknown")
        icon = "✅" if status in ["captured", "pass"] else "⚠️" if status == "changed" else "❌"

        if "page" in result:
            print(f"{icon} {result['page']} @ {result['viewport']}: {status}")
        else:
            print(f"{icon} {result['file']}: {result['status']} - {result.get('message', '')}")

    print("="*60)


async def main():
    import argparse

    global BASE_URL

    parser = argparse.ArgumentParser(description="Visual Regression Testing")
    parser.add_argument("--update-baselines", action="store_true",
                        help="Update baseline screenshots")
    parser.add_argument("--compare", action="store_true",
                        help="Compare against baselines")
    parser.add_argument("--url", default=None,
                        help="Base URL to test")

    args = parser.parse_args()

    if args.url:
        BASE_URL = args.url

    print(f"Visual Testing: {BASE_URL}")

    # Capture screenshots
    capture_results = await capture_screenshots(update_baselines=args.update_baselines)
    print_results(capture_results, "Screenshot Capture Results")

    # Compare if requested
    if args.compare:
        compare_results = compare_screenshots()
        print_results(compare_results, "Comparison Results")

        # Exit with error if any changes detected
        changed = [r for r in compare_results if r["status"] == "changed"]
        if changed:
            print(f"\n⚠️  {len(changed)} visual changes detected!")
            sys.exit(1)

    print("\n✅ Visual testing complete!")


if __name__ == "__main__":
    asyncio.run(main())
