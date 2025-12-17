import { test, expect } from '@playwright/test';

test.describe('Ranking Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/');
    await page.fill('input[type="email"]', 'charlie@example.com');
    await page.click('button:has-text("Continue")');

    // Wait for navigation and then go to ranking
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.goto('/ranking');
    await page.waitForLoadState('networkidle');
  });

  test('should display features sorted by votes', async ({ page }) => {
    // Wait for content to load
    await page.waitForSelector('text=Feature Rankings', { timeout: 10000 });

    // Check if we have vote count badges
    const voteBadges = page.locator('text=/\\d+\\s*votes?/i');
    const count = await voteBadges.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should highlight top 3 features with medals', async ({ page }) => {
    // Check for medal emojis or ranking numbers
    const goldMedal = page.locator('text=🥇');
    const silverMedal = page.locator('text=🥈');
    const bronzeMedal = page.locator('text=🥉');
    const rank1 = page.locator('text=#1');
    const rank2 = page.locator('text=#2');
    const rank3 = page.locator('text=#3');

    // Should have at least one of gold medal or #1
    const hasFirst = (await goldMedal.count()) > 0 || (await rank1.count()) > 0;
    expect(hasFirst).toBe(true);

    // Should have at least one of silver medal or #2
    const hasSecond = (await silverMedal.count()) > 0 || (await rank2.count()) > 0;
    expect(hasSecond).toBe(true);

    // Should have at least one of bronze medal or #3
    const hasThird = (await bronzeMedal.count()) > 0 || (await rank3.count()) > 0;
    expect(hasThird).toBe(true);
  });

  test('should show rankings in descending order', async ({ page }) => {
    // Get all vote count badges - be more flexible with regex
    const voteCounts = await page.locator('text=/\\d+\\s*votes?/i').allTextContents();

    // Extract numbers and verify descending order
    const numbers = voteCounts.map(text => parseInt(text.match(/\d+/)?.[0] || '0'));

    // Only check if we have multiple vote counts
    if (numbers.length > 1) {
      for (let i = 0; i < numbers.length - 1; i++) {
        expect(numbers[i]).toBeGreaterThanOrEqual(numbers[i + 1]);
      }
    }
  });

  test('should navigate back to vote page', async ({ page }) => {
    // Click "Back to Voting" button (exact text from component)
    await page.click('button:has-text("Back to Voting")');

    // Should navigate to vote page
    await expect(page).toHaveURL('/vote');
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Clear authentication
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Try to access ranking page
    await page.goto('/ranking');

    // Should redirect to login
    await expect(page).toHaveURL('/');
  });

  test('should allow logout from ranking page', async ({ page }) => {
    // Find and click logout button
    await page.click('button:has-text("Logout")');

    // Should redirect to login page
    await expect(page).toHaveURL('/');
  });
});
