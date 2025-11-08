import { test, expect } from '@playwright/test';
import { setupAutoHealing } from 'playwright-auto-healer';

test.describe('Auto-Healing Demo - Realistic Selectors', () => {
  test.beforeEach(async ({ page }) => {
    // Enable auto-healing for this page
    setupAutoHealing(page);
    await page.goto('https://www.saucedemo.com/');
  });

  test('should auto-heal slightly broken username selector', async ({ page }) => {
    // This selector is close to the real one, so AI might find the correct one
    await page.locator('#user-name-field').fill('standard_user'); // Real: #user-name
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should auto-heal data-test attribute selector', async ({ page }) => {
    // Using a similar but wrong data-test attribute
    await page.locator('[data-test="username-input"]').fill('standard_user'); // Real: [data-test="username"]
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should auto-heal class-based selector', async ({ page }) => {
    // Using a slightly wrong class name
    await page.locator('.username-input').fill('standard_user'); // Real selectors don't use this
    await page.locator('.password-input').fill('secret_sauce');
    await page.locator('.login-btn').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should auto-heal name attribute selector', async ({ page }) => {
    // Using name attributes instead of IDs
    await page.locator('[name="username"]').fill('standard_user'); // Real elements don't have name attrs
    await page.locator('[name="password"]').fill('secret_sauce');
    await page.locator('[name="login"]').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });
});