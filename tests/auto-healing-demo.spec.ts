import { test, expect } from '@playwright/test';

test.describe('SauceDemo Auto-Healing Demo Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('robust login test with multiple selector strategies', async ({ page }) => {
    // Demo de múltiples estrategias de selección para auto-healing
    
    // Estrategia 1: ID (más común en SauceDemo) - ROTOS A PROPÓSITO
    const usernameField = page.locator('#user-name-broken-2');
    const passwordField = page.locator('#password-broken-2');
    const loginButton = page.locator('#login-button-broken-2');
    
    // Estrategia 2: Usando data-test attributes como fallback - TAMBIÉN ROTOS
    const usernameFieldFallback = page.locator('[data-test="username-broken"]');
    const passwordFieldFallback = page.locator('[data-test="password-broken"]');
    const loginButtonFallback = page.locator('[data-test="login-button-broken"]');
    
    // Estrategia 3: Usando text content como último recurso
    const loginButtonText = page.getByRole('button', { name: /login/i });
    
    // Test con estrategia principal
    try {
      await usernameField.fill('standard_user');
      await passwordField.fill('secret_sauce');
      await loginButton.click();
    } catch (error) {
      console.log('Estrategia principal falló, intentando fallbacks...');
      
      // Fallback a data-test attributes
      try {
        await usernameFieldFallback.fill('standard_user');
        await passwordFieldFallback.fill('secret_sauce');
        await loginButtonFallback.click();
      } catch (error2) {
        console.log('Fallback data-test falló, usando text content...');
        
        // Último recurso: buscar por texto
        await page.locator('input[placeholder*="Username"]').fill('standard_user');
        await page.locator('input[placeholder*="Password"]').fill('secret_sauce');
        await loginButtonText.click();
      }
    }
    
    // Verificar que el login fue exitoso
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('flexible error message detection', async ({ page }) => {
    // Click login sin credenciales para generar error - SELECTOR ROTO
    await page.locator('#login-button-error-test').click();
    
    // Múltiples formas de detectar el mensaje de error para mayor robustez
    const errorSelectors = [
      '[data-test="error-fake"]',               // Selector principal ROTO
      '.error-message-container-broken',        // Posible clase CSS ROTA
      '[class*="error-broken"]',                // Cualquier clase que contenga "error" ROTA
      'text="Epic sadface"',                    // Por texto específico
      'h3:has-text("Epic sadface")',            // Por elemento y texto
    ];
    
    let errorFound = false;
    let errorElement: any;
    
    // Intentar cada selector hasta encontrar el elemento de error
    for (const selector of errorSelectors) {
      try {
        errorElement = page.locator(selector);
        await expect(errorElement).toBeVisible({ timeout: 2000 });
        errorFound = true;
        console.log(`Error encontrado con selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} no funcionó, probando siguiente...`);
      }
    }
    
    expect(errorFound).toBe(true);
    if (errorElement) {
      await expect(errorElement).toHaveText(/Username is required/);
    }
  });

  test.skip('smart waiting strategies', async ({ page }) => {
    // Login con estrategias de espera inteligentes
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Esperar a múltiples indicadores de que la página cargó completamente
    await Promise.all([
      // Esperar por URL
      page.waitForURL('/inventory.html'),
      
      // Esperar por elemento visible
      page.waitForSelector('.title', { state: 'visible' }),
      
      // Esperar por estado de red (no hay requests pendientes)
      page.waitForLoadState('networkidle'),
      
      // Esperar por contenido específico
      page.waitForFunction(() => {
        const title = document.querySelector('.title');
        return title && title.textContent === 'Products';
      }),
    ]);
    
    // Verificaciones adicionales
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test.skip('dynamic content handling', async ({ page }) => {
    // Login exitoso
    await page.locator('#user-name').fill('performance_glitch_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Este usuario puede tener problemas de rendimiento, así que usamos esperas más flexibles
    await page.waitForURL('/inventory.html', { timeout: 10000 });
    
    // Esperar a que los productos se carguen dinámicamente
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('.inventory_item');
      return items.length >= 6;
    }, { timeout: 15000 });
    
    // Verificar que todos los productos tienen imágenes cargadas
    const productImages = page.locator('.inventory_item_img img');
    const imageCount = await productImages.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = productImages.nth(i);
      
      // Esperar a que cada imagen se cargue o tenga un src válido
      await expect(img).toHaveAttribute('src', /.+/);
      
      // Verificar que la imagen no es un placeholder de error
      const src = await img.getAttribute('src');
      expect(src).not.toContain('error');
      expect(src).not.toContain('404');
    }
  });

  test('adaptive form interaction', async ({ page }) => {
    // Test que se adapta a diferentes estados del formulario
    
    // Verificar si los campos están habilitados - SELECTORES ROTOS
    const usernameField = page.locator('#user-name-adaptive');
    const passwordField = page.locator('#password-adaptive');
    
    await expect(usernameField).toBeEnabled();
    await expect(passwordField).toBeEnabled();
    
    // Rellenar formulario con manejo de errores
    await usernameField.click();
    await usernameField.fill('locked_out_user');
    
    await passwordField.click();
    await passwordField.fill('secret_sauce');
    
    // Verificar que los valores se ingresaron correctamente
    await expect(usernameField).toHaveValue('locked_out_user');
    await expect(passwordField).toHaveValue('secret_sauce');
    
    // Intentar login - SELECTOR ROTO
    await page.locator('#login-button-adaptive').click();
    
    // Manejar el mensaje de error específico para usuario bloqueado - SELECTOR ROTO
    const errorMessage = page.locator('[data-test="error-adaptive"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('locked out');
    
    // Limpiar error y formulario para siguiente intento - SELECTOR ROTO
    await page.locator('.error-button-adaptive').click();
    await expect(errorMessage).not.toBeVisible();
    
    // Verificar que los campos están limpios para el siguiente test
    await usernameField.clear();
    await passwordField.clear();
    
    await expect(usernameField).toHaveValue('');
    await expect(passwordField).toHaveValue('');
  });

  test.skip('cross-browser compatibility checks', async ({ page, browserName }) => {
    // Test que verifica comportamiento específico por navegador
    console.log(`Ejecutando en navegador: ${browserName}`);
    
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Esperas específicas por navegador si es necesario
    if (browserName === 'webkit') {
      // Safari a veces necesita más tiempo
      await page.waitForTimeout(1000);
    }
    
    await expect(page).toHaveURL('/inventory.html');
    
    // Verificar que los elementos se renderizaron correctamente en todos los navegadores
    const title = page.locator('.title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Products');
    
    // Verificar que las imágenes se cargan en todos los navegadores
    const firstProductImage = page.locator('.inventory_item_img').first();
    await expect(firstProductImage).toBeVisible();
    
    // Test específico para Firefox
    if (browserName === 'firefox') {
      // Firefox a veces maneja los eventos de forma diferente
      await page.waitForFunction(() => {
        return document.readyState === 'complete';
      });
    }
    
    // Verificar elementos interactivos
    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toBeEnabled();
  });
});