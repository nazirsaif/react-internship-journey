import { test, expect } from '@playwright/test';

test.describe('Auth Flow End-to-End', () => {
  const randomEmail = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';

  test('signup, failed login, successful login, board loads, refresh session, logout, redirect', async ({ page, context }) => {
    // Navigate to board, should redirect to login
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/login/);

    // Navigate to signup
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/.*\/signup/);

    // Fill signup form
    await page.fill('input[type="email"]', randomEmail);
    await page.fill('input[placeholder="Password"]', password);
    await page.fill('input[placeholder="Confirm Password"]', password);
    await page.click('button:has-text("Sign Up")');

    // Should redirect to board after signup
    await expect(page).toHaveURL(/.*\//);
    await expect(page.locator('text=To Do')).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*\/login/);

    // Failed login (wrong password)
    await page.fill('input[type="email"]', randomEmail);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Login")');
    await expect(page.locator('text=Invalid email or password')).toBeVisible();

    // Successful login
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("Login")');

    // Should redirect to board
    await expect(page).toHaveURL(/.*\//);
    await expect(page.locator('text=To Do')).toBeVisible();

    // Page refresh (session restored via silent refresh)
    await page.reload();
    await expect(page.locator('text=To Do')).toBeVisible();

    // Logout again
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*\/login/);

    // Confirm visiting /board while logged out redirects to /login
    await page.goto('/');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
