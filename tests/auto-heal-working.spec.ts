import { test, expect } from '@playwright/test';
import { setupAutoHealing } from 'playwright-auto-healer';

test.describe('Auto-Healing Demo - Working Selectors', () => {
  test.beforeEach(async ({ page }) => {
    // Enable auto-healing for this page
    setupAutoHealing(page);
    await page.goto('https://www.saucedemo.com/');
  });

  test('should work with correct selectors (no healing needed)', async ({ page }) => {
    // These are the correct selectors - no healing should be triggered
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should work with data-test selectors (no healing needed)', async ({ page }) => {
    // These are also correct selectors using data-test attributes
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce'); 
    await page.locator('[data-test="login-button"]').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });
});