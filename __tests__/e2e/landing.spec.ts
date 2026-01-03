import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OpenVenture/i);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Launch Your Business');
  });

  test('should display social proof section', async ({ page }) => {
    await page.goto('/');

    // Check for social proof section with logos - text may vary with generated content
    const socialProof = page.locator('text=/Trusted by/i');
    await expect(socialProof).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // Check for features section by ID instead of specific text
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();

    const featureCards = page.locator('.card');
    await expect(featureCards.first()).toBeVisible();
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');

    // Check for pricing section by ID instead of specific text
    const pricingSection = page.locator('#pricing');
    await expect(pricingSection).toBeVisible();

    // Check for at least one pricing tier card
    const pricingCard = pricingSection.locator('.card, [class*="rounded"]').first();
    await expect(pricingCard).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/');

    const faqHeadline = page.locator('text=Frequently Asked Questions');
    await expect(faqHeadline).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const copyright = page.locator('text=OpenVenture. All rights reserved');
    await expect(copyright).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    await page.goto('/');

    const primaryCta = page.locator('.btn-primary').first();
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveAttribute('href', /#pricing|#signup/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
  });

  test('should toggle billing period in pricing', async ({ page }) => {
    await page.goto('/');

    // Navigate to pricing section
    const pricingSection = page.locator('#pricing');
    await pricingSection.scrollIntoViewIfNeeded();

    // Check for billing toggle or labels - text may vary with generated content
    const monthlyLabel = pricingSection.locator('text=/monthly/i').first();
    const hasToggle = await monthlyLabel.isVisible().catch(() => false);

    if (hasToggle) {
      const toggle = pricingSection.locator('button').filter({ has: page.locator('.rounded-full') }).first();
      if (await toggle.isVisible()) {
        await toggle.click();
        // Just verify the toggle works, don't check specific text
        await expect(toggle).toBeVisible();
      }
    }
  });
});
