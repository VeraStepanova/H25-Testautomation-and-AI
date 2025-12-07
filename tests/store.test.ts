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

test('verify specific product price via API', async ({ request }) => {
  // Get price for product with ID 1 (Apple)
  const response = await request.get('https://hoff.is/store2/api/v1/price/1');
  
  expect(response.ok()).toBeTruthy();
  
  const priceData = await response.json();
  
  // Verify the price for Apple is $15
  expect(priceData.price).toBe(15);
});



