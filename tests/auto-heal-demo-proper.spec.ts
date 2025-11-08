import { test, expect } from '@playwright/test';
import { setupAutoHealing } from 'playwright-auto-healer';

test.describe('Auto-Healing Demo - Proper Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Enable auto-healing for this page
    setupAutoHealing(page);
    await page.goto('https://www.saucedemo.com/');
  });

  test('should auto-heal broken username selector', async ({ page }) => {
    // This selector is intentionally broken - it should be auto-healed
    await page.locator('#user-name-broken-selector').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should auto-heal broken password selector', async ({ page }) => {
    // These selectors are intentionally broken - they should be auto-healed
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password-broken-selector').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should auto-heal broken login button selector', async ({ page }) => {
    // These selectors are intentionally broken - they should be auto-healed
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button-broken-selector').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should auto-heal multiple broken selectors', async ({ page }) => {
    // All selectors are intentionally broken - they should be auto-healed
    await page.locator('#user-name-totally-broken').fill('standard_user');
    await page.locator('#password-totally-broken').fill('secret_sauce');
    await page.locator('#login-button-totally-broken').click();
    
    // Verify login was successful
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });
});