# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kanban.spec.ts >> Kanban Board E2E >> full user flow: create, delete, and persist
- Location: e2e\kanban.spec.ts:4:3

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  locator('text=My E2E Task')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for locator('text=My E2E Task')
    14 × locator resolved to <span>My E2E Task</span>
       - unexpected value "visible"

```

```yaml
- text: My E2E Task
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Kanban Board E2E', () => {
  4  |   test('full user flow: create, delete, and persist', async ({ page }) => {
  5  |     await page.goto('/');
  6  | 
  7  |     // 1. Load the board
  8  |     await expect(page.locator('text=To Do')).toBeVisible();
  9  |     
  10 |     // 2. Create a card
  11 |     const input = page.getByPlaceholder('New task title...');
  12 |     await input.fill('My E2E Task');
  13 |     await page.getByRole('button', { name: 'Add Task' }).click();
  14 | 
  15 |     await expect(page.locator('text=My E2E Task')).toBeVisible();
  16 | 
  17 |     // 3. Test persistence by refreshing
  18 |     await page.reload();
  19 |     await expect(page.locator('text=My E2E Task')).toBeVisible();
  20 | 
  21 |     // 4. Delete the card
  22 |     const refreshedTaskCard = page.locator('text=My E2E Task').locator('xpath=..').locator('xpath=..');
  23 |     const deleteBtn = refreshedTaskCard.getByRole('button', { name: 'Delete task' });
  24 |     await deleteBtn.click();
  25 | 
> 26 |     await expect(page.locator('text=My E2E Task')).not.toBeVisible();
     |                                                        ^ Error: expect(locator).not.toBeVisible() failed
  27 |   });
  28 | });
  29 | 
```