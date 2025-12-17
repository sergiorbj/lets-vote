import { test, expect } from '@playwright/test';

test.describe('Vote Page', () => {
  test('should display dropdown with features', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'charlie@example.com');
    await page.click('button:has-text("Continue")');
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const dropdown = page.getByTestId('feature-select');
    await expect(dropdown).toBeVisible();

    const options = page.locator('select option');
    const count = await options.count();
    expect(count).toBeGreaterThan(1);

    await expect(page.locator('text=AI Studies Manager')).toBeVisible();
  });

  test('should show feature description when selected', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'bob@example.com');
    await page.click('button:has-text("Continue")');
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const dropdown = page.getByTestId('feature-select');
    await dropdown.selectOption({ index: 1 });

    await expect(page.locator('.bg-gray-50').last()).toBeVisible();
  });

  test('should hide dropdown and show only View Rankings button after voting', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'charlie@example.com');
    await page.click('button:has-text("Continue")');
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const dropdown = page.getByTestId('feature-select');
    const submitButton = page.getByTestId('submit-vote-button');

    await expect(dropdown).toBeVisible();
    await expect(submitButton).toBeVisible();

    await dropdown.selectOption({ index: 1 });
    await submitButton.click();

    await expect(page.locator('text=Thank you for voting')).toBeVisible();

    await expect(dropdown).not.toBeVisible();
    await expect(submitButton).not.toBeVisible();

    const viewRankingsButton = page.getByTestId('view-rankings-button');
    await expect(viewRankingsButton).toBeVisible();

    const allButtons = await page.locator('button').count();
    expect(allButtons).toBe(2); // Header logout + View Rankings
  });

  test('should navigate to rankings after clicking View Rankings', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'diana@example.com');
    await page.click('button:has-text("Continue")');
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const dropdown = page.getByTestId('feature-select');
    await dropdown.selectOption({ index: 1 });

    await page.getByTestId('submit-vote-button').click();
    await expect(page.locator('text=Thank you for voting')).toBeVisible();

    await page.getByTestId('view-rankings-button').click();
    await expect(page).toHaveURL('/ranking');
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Start fresh without any stored auth
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/vote');
    await expect(page).toHaveURL('/');
  });

  test('should disable submit button when selecting empty option', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'eve@example.com');
    await page.click('button:has-text("Continue")');
    await page.waitForURL('/vote', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    const dropdown = page.getByTestId('feature-select');
    const submitButton = page.getByTestId('submit-vote-button');

    await dropdown.selectOption({ value: '' });
    await expect(submitButton).toBeDisabled();

    await dropdown.selectOption({ index: 1 });
    await expect(submitButton).toBeEnabled();
  });
});
