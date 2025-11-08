import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name1');
    this.passwordInput = page.locator('#password1');
    this.loginButton = page.locator('#login-button1');
    this.errorMessage = page.locator('[data-test="error1"]');
    this.errorCloseButton = page.locator('.error-button1');
    this.logo = page.locator('.login_logo1');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async closeErrorMessage() {
    await this.errorCloseButton.click();
  }

  async clearForm() {
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
  }

  // Assertion methods
  async expectErrorMessage(expectedText: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async expectErrorMessageVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectErrorMessageHidden() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async expectFormElementsVisible() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.logo).toBeVisible();
  }

  async expectPlaceholders() {
    await expect(this.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(this.passwordInput).toHaveAttribute('placeholder', 'Password');
  }

  async expectLogoText() {
    await expect(this.logo).toHaveText('Swag Labs');
  }
}