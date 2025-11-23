
import { Page, Locator, expect } from '@playwright/test';

export class StorePage {
  readonly page: Page;

  readonly productSelect: Locator;
  readonly amountInput: Locator;
  readonly addToCartButton: Locator;
  readonly buyMessage: Locator;
  readonly buyButton: Locator;

  readonly nameInput: Locator;
  readonly addressInput: Locator;
  readonly confirmButton: Locator;

  readonly receiptItem: Locator;
  readonly thankYouMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product selection
    this.productSelect = page.getByTestId('select-product');
    this.amountInput = page.getByRole('textbox', { name: 'Amount' });
    this.addToCartButton = page.getByTestId('add-to-cart-button');
    this.buyMessage = page.getByTestId('buy-message');
    this.buyButton = page.getByRole('button', { name: 'Buy' });

    // Customer details
    this.nameInput = page.getByRole('textbox', { name: 'Name:' });
    this.addressInput = page.getByRole('textbox', { name: 'Address:' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm Purchase' });

    // Receipt
    this.receiptItem = page.getByRole('listitem');
    this.thankYouMessage = page.locator('#name');
  }

  async gotoStore() {
    await this.page.goto('https://hoff.is/store2/');
  }

  async selectProduct(productId: string, quantity: string) {
    await this.productSelect.selectOption(productId);
    await this.amountInput.fill(quantity);
    await this.addToCartButton.click();
  }

  async verifyAddToCartMessage(expectedMessage: string) {
    await expect(this.buyMessage).toContainText(expectedMessage);
  }

  async proceedToCheckout() {
    await this.buyButton.click();
  }

  async enterCustomerDetails(name: string, address: string) {
    await this.nameInput.fill(name);
    await this.addressInput.fill(address);
    await this.confirmButton.click();
  }

  async verifyReceipt(expectedItem: string, expectedThankYouText: string) {
    await expect(this.receiptItem).toContainText(expectedItem);
    await expect(this.thankYouMessage).toContainText(expectedThankYouText);
  }
}
