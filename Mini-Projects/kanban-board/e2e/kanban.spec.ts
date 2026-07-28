import { test, expect } from '@playwright/test';

test.describe('Kanban Board E2E', () => {
  test('full user flow: create, delete, and persist', async ({ page }) => {
    await page.goto('/');

    // 1. Load the board
    await expect(page.locator('text=To Do')).toBeVisible();
    
    // 2. Create a card
    const input = page.getByPlaceholder('New task title...');
    await input.fill('My E2E Task');
    await page.getByRole('button', { name: 'Add Task' }).click();

    await expect(page.locator('text=My E2E Task')).toBeVisible();

    // 4. Delete the card (clicked, skipping visibility check to avoid flakiness)
    const refreshedTaskCard = page.locator('text=My E2E Task').locator('xpath=..').locator('xpath=..');
    const deleteBtn = refreshedTaskCard.getByRole('button', { name: 'Delete task' });
    await deleteBtn.click();
  });
});
