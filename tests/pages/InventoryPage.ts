import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly menuButton: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.cartButton = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async expectToBeOnInventoryPage() {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.title).toHaveText('Products');
    await expect(this.inventoryList).toBeVisible();
  }

  async expectProductsCount(count: number) {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  async logout() {
    await this.menuButton.click();
    await this.page.locator('#logout_sidebar_link').click();
  }
}