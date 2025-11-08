import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

// Credenciales de prueba
const CREDENTIALS = {
  valid: { username: 'standard_user', password: 'secret_sauce' },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' }
};

test.describe.skip('SauceDemo Login Tests with Page Objects', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('should display all login form elements correctly', async () => {
    await loginPage.expectFormElementsVisible();
    await loginPage.expectPlaceholders();
    await loginPage.expectLogoText();
  });

  test('successful login with standard user', async () => {
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await inventoryPage.expectToBeOnInventoryPage();
    await inventoryPage.expectProductsCount(6);
  });

  test('should handle invalid login credentials', async () => {
    await loginPage.login(CREDENTIALS.invalid.username, CREDENTIALS.invalid.password);
    await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
  });

  test('should handle locked out user', async () => {
    await loginPage.login(CREDENTIALS.locked.username, CREDENTIALS.locked.password);
    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  test('should require username field', async () => {
    await loginPage.fillPassword(CREDENTIALS.valid.password);
    await loginPage.clickLogin();
    await loginPage.expectErrorMessage('Epic sadface: Username is required');
  });

  test('should require password field', async () => {
    await loginPage.fillUsername(CREDENTIALS.valid.username);
    await loginPage.clickLogin();
    await loginPage.expectErrorMessage('Epic sadface: Password is required');
  });

  test('should be able to close error messages', async () => {
    await loginPage.clickLogin();
    await loginPage.expectErrorMessageVisible();
    await loginPage.closeErrorMessage();
    await loginPage.expectErrorMessageHidden();
  });

  test('should clear form and login after error', async () => {
    // First attempt with invalid credentials
    await loginPage.login(CREDENTIALS.invalid.username, CREDENTIALS.invalid.password);
    await loginPage.expectErrorMessageVisible();
    
    // Clear form and try again with valid credentials
    await loginPage.clearForm();
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test.skip('complete login flow with logout', async () => {
    // Login
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await inventoryPage.expectToBeOnInventoryPage();
    
    // Logout
    await inventoryPage.logout();
    
    // Verify back to login page
    await expect(loginPage.page).toHaveURL('/');
    await loginPage.expectFormElementsVisible();
  });

  test.skip('should test problem user login', async () => {
    await loginPage.login(CREDENTIALS.problem.username, CREDENTIALS.problem.password);
    await inventoryPage.expectToBeOnInventoryPage();
    // Problem user might have issues with images, but login should work
  });

  test.skip('should test performance glitch user', async () => {
    await loginPage.login(CREDENTIALS.performance.username, CREDENTIALS.performance.password);
    await inventoryPage.expectToBeOnInventoryPage();
    // Performance user might be slow but should login successfully
  });
});