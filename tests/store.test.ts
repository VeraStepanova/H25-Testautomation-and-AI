import { test, expect } from '@playwright/test';
import { StorePage } from '../pages/storePage';
import { LoginPage } from '../pages/loginPage';


test('user buys 5 apples and sees receipt', async ({ page }) => {
  const login = new LoginPage (page);
  const store = new StorePage(page);
  
  await login.goto();
  // Login
 await login.login('Vera', 'sup3rs3cr3t', 'consumer');

  // Product & cart flow
  await store.selectProduct('1', '5');
  await store.verifyAddToCartMessage('Added 5 x Apple to cart.');

  // Checkout
  await store.proceedToCheckout();
  await store.enterCustomerDetails('Vera', 'Storgatan 51');

  // Receipt validation
  await store.verifyReceipt(
    '5 x Apple - $75',
    'Thank you for your purchase, Vera'
  );
});

test('verify specific product price via API and receipt', async ({ page, request }) => {
  // Get unit price for product with ID 1 (Apple) from API
  const response = await request.get('https://hoff.is/store2/api/v1/price/1');
  expect(response.ok()).toBeTruthy();
  const priceData = await response.json();
  const unitPrice = Number(priceData.price);

  // Do a UI purchase of 2 Apple
  const login = new LoginPage(page);
  const store = new StorePage(page);

  await login.goto();
  await login.login('Vera', 'sup3rs3cr3t', 'consumer');

  const quantity = '2';
  await store.selectProduct('1', quantity);
  await store.verifyAddToCartMessage(`Added ${quantity} x Apple to cart.`);

  // Checkout
  await store.proceedToCheckout();
  await store.enterCustomerDetails('Vera', 'Storgatan 51');

  // Verify receipt total matches API price
  const expectedTotal = unitPrice * Number(quantity);
  await store.verifyReceipt(
    `${quantity} x Apple - $${expectedTotal}`,
    'Thank you for your purchase, Vera'
  );
});



