import { test, expect } from '@playwright/test';
import { setupAutoHealing, getHealingResults, AutoHealer, withAutoHealing } from 'playwright-auto-healer';

test.describe('Comprehensive API Tests', () => {
  
  test.describe('Method 1: setupAutoHealing() - Automatic instrumentation', () => {
    test('should auto-heal with setupAutoHealing', async ({ page }) => {
      // Method 1: Setup auto-healing on page (instruments page.locator)
      setupAutoHealing(page);
      await page.goto('https://www.saucedemo.com/');
      
      // Use broken selectors - they should be auto-healed
      await page.locator('#user-name-broken').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test.describe('Method 2: AutoHealer class - Manual healing', () => {
    test('should manually heal selectors with AutoHealer', async ({ page }) => {
      // Method 2: Manual healing using AutoHealer class
      const healer = new AutoHealer({
        projectPath: process.cwd()
      });
      
      await page.goto('https://www.saucedemo.com/');
      
      // Try a broken selector, catch error, then heal manually
      const brokenSelector = '#user-name-broken-manual';
      try {
        await page.locator(brokenSelector).fill('test', { timeout: 2000 });
      } catch (error) {
        console.log(`Selector failed, attempting manual healing...`);
        const result = await healer.healSelector(page, brokenSelector);
        
        if (result.success && result.newSelector) {
          console.log(`Healed: ${brokenSelector} → ${result.newSelector}`);
          await page.locator(result.newSelector).fill('standard_user');
        }
      }
      
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test.describe('Method 3: PlaywrightHealer class - Wrapped API', () => {
    test('should use PlaywrightHealer wrapper class', async ({ page }) => {
      // Method 3: Use PlaywrightHealer wrapper class
      const healer = withAutoHealing(page, {
        projectPath: process.cwd()
      });
      
      await page.goto('https://www.saucedemo.com/');
      
      // Use healer methods instead of page.locator
      await healer.fill('#user-name-wrapper-test', 'standard_user');
      await healer.fill('#password', 'secret_sauce');
      await healer.click('#login-button');
      
      await expect(page).toHaveURL('/inventory.html');
      
      // Print healing summary
      healer.printHealingSummary();
      
      // Get healed selectors programmatically
      const healedSelectors = healer.getHealedSelectors();
      console.log(`Total healed selectors: ${healedSelectors.length}`);
    });
  });

  test.describe('Method 4: getHealingResults() - Retrieve results', () => {
    test('should retrieve healing results after test run', async ({ page }) => {
      setupAutoHealing(page);
      await page.goto('https://www.saucedemo.com/');
      
      // Trigger some healings
      await page.locator('#user-name-results-test').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      
      await expect(page).toHaveURL('/inventory.html');
      
      // Method 4: Get healing results
      const results = getHealingResults();
      console.log('Healing Results:', JSON.stringify(results, null, 2));
    });
  });

  test.describe('Method 5: CLI scan command', () => {
    test('should work with CLI scan command', async ({ page }) => {
      // Method 5: CLI - This test is for running with:
      // npx playwright-auto-healer scan "npx playwright test"
      
      // When using CLI, just import test and expect from playwright-auto-healer
      // import { test, expect } from 'playwright-auto-healer';
      
      await page.goto('https://www.saucedemo.com/');
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      
      await expect(page).toHaveURL('/inventory.html');
      console.log('CLI method: Reports generated in .playwright-healer/recommendations/');
    });
  });

  test.describe('Different action types', () => {
    test('should heal click actions', async ({ page }) => {
      setupAutoHealing(page);
      await page.goto('https://www.saucedemo.com/');
      
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button-click-test').click();
      
      await expect(page).toHaveURL('/inventory.html');
    });

    test('should heal fill actions', async ({ page }) => {
      setupAutoHealing(page);
      await page.goto('https://www.saucedemo.com/');
      
      await page.locator('#user-name-fill-test').fill('standard_user');
      await page.locator('#password-fill-test').fill('secret_sauce');
      await page.locator('#login-button').click();
      
      await expect(page).toHaveURL('/inventory.html');
    });
  });

  test.describe('Configuration options', () => {
    test('should work with custom config - Ollama', async ({ page }) => {
      setupAutoHealing(page, {
        aiProvider: 'ollama',
        ollamaModel: 'hhao/qwen2.5-coder-tools:7b',
        ollamaBaseUrl: 'http://localhost:11434',
        maxRetries: 1,
        projectPath: process.cwd()
      });
      
      await page.goto('https://www.saucedemo.com/');
      await page.locator('#user-name-config-test').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      
      await expect(page).toHaveURL('/inventory.html');
    });
  });
});
