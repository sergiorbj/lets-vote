import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should successfully log in with valid email', async ({ page }) => {
    await page.goto('/');

    // Fill in email
    await page.fill('input[type="email"]', 'alice@example.com');

    // Click continue button
    await page.click('button:has-text("Continue")');

    // Should redirect to vote page
    await expect(page).toHaveURL('/vote');

    // Should display welcome message with user name
    await expect(page.locator('text=Welcome, Alice')).toBeVisible();
  });

  test('should show error for non-existent user', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.click('button:has-text("Continue")');

    // Should show error message
    await expect(page.locator('text=User not found')).toBeVisible();

    // Should remain on login page
    await expect(page).toHaveURL('/');
  });

  test('should show error for empty email', async ({ page }) => {
    await page.goto('/');

    // Try to submit without entering email
    await page.click('button:has-text("Continue")');

    // Should show error - match exact error text
    await expect(page.locator('text=Please enter your email')).toBeVisible();
  });
});
