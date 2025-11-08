import { test, expect } from '@playwright/test';

// Credenciales de prueba de SauceDemo
const VALID_CREDENTIALS = {
  username: 'standard_user',
  password: 'secret_sauce'
};

const INVALID_CREDENTIALS = {
  username: 'invalid_user',
  password: 'wrong_password'
};

const LOCKED_USER = {
  username: 'locked_out_user',
  password: 'secret_sauce'
};

test.describe('SauceDemo Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login antes de cada test
    await page.goto('/');
  });

  test('should display login form elements', async ({ page }) => {
    // Verificar que todos los elementos del formulario de login estén presentes
    await expect(page.locator('#user-name-broken')).toBeVisible();
    await expect(page.locator('#password-broken')).toBeVisible();
    await expect(page.locator('#login-button-broken')).toBeVisible();
    
    // Verificar placeholders
    await expect(page.locator('#user-name-broken')).toHaveAttribute('placeholder', 'Username');
    await expect(page.locator('#password-broken')).toHaveAttribute('placeholder', 'Password');
    
    // Verificar el logo
    await expect(page.locator('.login_logo')).toBeVisible();
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Realizar login con credenciales válidas
    await page.fill('#user-name-wrong', VALID_CREDENTIALS.username);
    await page.fill('#password-wrong', VALID_CREDENTIALS.password);
    await page.click('#login-button-wrong');

    // Verificar redirección a la página de productos
    await expect(page).toHaveURL('/inventory.html');
    
    // Verificar elementos de la página de productos
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_list')).toBeVisible();
    
    // Verificar que hay productos en la lista
    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6); // SauceDemo tiene 6 productos
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Intentar login con credenciales inválidas
    await page.fill('#user-name-invalid', INVALID_CREDENTIALS.username);
    await page.fill('#password-invalid', INVALID_CREDENTIALS.password);
    await page.click('#login-button-invalid');

    // Verificar que se muestra el mensaje de error
    const errorMessage = page.locator('[data-test="error-broken"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    
    // Verificar que permanecemos en la página de login
    await expect(page).toHaveURL('/');
  });

  test('should show error message for locked out user', async ({ page }) => {
    // Intentar login con usuario bloqueado
    await page.fill('#user-name', LOCKED_USER.username);
    await page.fill('#password', LOCKED_USER.password);
    await page.click('#login-button');

    // Verificar mensaje de error específico para usuario bloqueado
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('should show error message when username is empty', async ({ page }) => {
    // Intentar login solo con password
    await page.fill('#password', VALID_CREDENTIALS.password);
    await page.click('#login-button');

    // Verificar mensaje de error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username is required');
  });

  test('should show error message when password is empty', async ({ page }) => {
    // Intentar login solo con username
    await page.fill('#user-name', VALID_CREDENTIALS.username);
    await page.click('#login-button');

    // Verificar mensaje de error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Password is required');
  });

  test('should show error message when both fields are empty', async ({ page }) => {
    // Intentar login sin credenciales
    await page.click('#login-button');

    // Verificar mensaje de error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username is required');
  });

  test('should be able to close error message', async ({ page }) => {
    // Generar un error
    await page.click('#login-button');
    
    // Verificar que el error está visible
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    
    // Cerrar el mensaje de error
    await page.click('.error-button');
    
    // Verificar que el error ya no está visible
    await expect(errorMessage).not.toBeVisible();
  });

  test('should clear form fields after error and successful login', async ({ page }) => {
    // Generar un error primero
    await page.fill('#user-name', INVALID_CREDENTIALS.username);
    await page.fill('#password', INVALID_CREDENTIALS.password);
    await page.click('#login-button');
    
    // Verificar error
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // Limpiar campos y usar credenciales válidas
    await page.fill('#user-name', '');
    await page.fill('#password', '');
    await page.fill('#user-name', VALID_CREDENTIALS.username);
    await page.fill('#password', VALID_CREDENTIALS.password);
    await page.click('#login-button');
    
    // Verificar login exitoso
    await expect(page).toHaveURL('/inventory.html');
  });
});