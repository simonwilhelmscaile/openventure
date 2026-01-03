import { test, expect } from '@playwright/test';

test.describe('Full Site Walkthrough', () => {
  test('should navigate through all pages without 404s', async ({ page }) => {
    // Landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/OpenVenture/);

    // Check navigation exists
    await expect(page.locator('nav')).toBeVisible();

    // Blog page
    await page.goto('/blog');
    await expect(page.locator('h1')).toContainText('Blog');

    // Blog article page
    await page.goto('/blog/01-launch-your-business-faster');
    await expect(page.locator('h1')).toBeVisible();

    // About page
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText('About');

    // Privacy page
    await page.goto('/privacy');
    await expect(page.locator('h1')).toContainText('Privacy');

    // Terms page
    await page.goto('/terms');
    await expect(page.locator('h1')).toContainText('Terms');

    // Careers page
    await page.goto('/careers');
    await expect(page.locator('h1')).toContainText('Careers');

    // Contact page
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('should have working navigation links on landing page', async ({ page }) => {
    await page.goto('/');

    // Click Blog link in navigation
    await page.click('nav >> text=Blog');
    await expect(page).toHaveURL('/blog');

    // Go back to landing
    await page.goto('/');

    // Check CTA buttons exist (text may vary with generated content)
    await expect(page.locator('.btn-primary').first()).toBeVisible();
    await expect(page.locator('.btn-secondary').first()).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check footer links exist (use first() for links that appear multiple times)
    const footer = page.locator('footer');
    await expect(footer.locator('text=About').first()).toBeVisible();
    await expect(footer.locator('text=Privacy').first()).toBeVisible();
    await expect(footer.locator('text=Terms').first()).toBeVisible();
  });

  test('should display blog articles correctly', async ({ page }) => {
    await page.goto('/blog');

    // Check featured article exists
    await expect(page.locator('text=Featured')).toBeVisible();

    // Check article cards exist
    const articleCards = page.locator('[href^="/blog/"]');
    await expect(articleCards.first()).toBeVisible();
  });

  test('should display article content on blog article page', async ({ page }) => {
    await page.goto('/blog/01-launch-your-business-faster');

    // Check article elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=TL;DR')).toBeVisible();
    await expect(page.locator('text=Key Takeaways')).toBeVisible();

    // Check back to blog link
    await expect(page.locator('text=Back to all articles')).toBeVisible();
  });

  test('should have product preview images, not placeholder text', async ({ page }) => {
    await page.goto('/');

    // Scroll to showcase section
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check that "Preview" placeholder text is NOT visible
    const showcaseSection = page.locator('#showcase');
    const previewPlaceholder = showcaseSection.locator('text="Preview"');
    await expect(previewPlaceholder).not.toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile menu button exists
    const mobileMenuButton = page.locator('[aria-label*="menu"], button:has(svg)').first();
    await expect(mobileMenuButton).toBeVisible();

    // Check content is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact form should work', async ({ page }) => {
    await page.goto('/contact');

    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');

    // Submit
    await page.click('button[type="submit"]');

    // Check success message
    await expect(page.locator('text=Message Sent')).toBeVisible();
  });
});
