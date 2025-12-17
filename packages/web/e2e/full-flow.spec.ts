import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('should complete full voting flow', async ({ page }) => {
    // Step 1: Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'diana@example.com');
    await page.click('button:has-text("Continue")');
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Step 2: Vote on a feature
    const dropdown = page.getByTestId('feature-select');
    await dropdown.selectOption({ index: 1 });

    await page.getByTestId('submit-vote-button').click();
    await expect(page.locator('text=Thank you for voting')).toBeVisible({ timeout: 10000 });

    // Verify dropdown and submit button are hidden
    await expect(dropdown).not.toBeVisible();
    await expect(page.getByTestId('submit-vote-button')).not.toBeVisible();

    // Step 3: View Rankings via button
    await page.getByTestId('view-rankings-button').click();
    await page.waitForURL('/ranking', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Check for medal or rank indicator
    const goldMedal = page.locator('text=🥇');
    const rank1 = page.locator('text=#1');
    const hasFirst = (await goldMedal.count()) > 0 || (await rank1.count()) > 0;
    expect(hasFirst).toBe(true);

    // Step 4: Back to Vote
    await page.click('button:has-text("Back to Voting")');
    await page.waitForURL('/vote', { timeout: 10000 });

    // Step 5: Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/', { timeout: 10000 });
  });
});
