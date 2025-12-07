import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
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

/*test('verify product price via API matches UI', async ({ request }) => {
  // Get product list from API
  const response = await request.get('https://hoff.is/store2/api/v1/product/list');
  
  expect(response.ok()).toBeTruthy();
  
  const data = await response.json();
  
  // Handle both array and object with products property
  const products = Array.isArray(data) ? data : data.products || [];
  
  // Verify Apple product exists
  const apple = products.find((product: any) => product.name === 'Apple');
  
  expect(apple).toBeDefined();
  expect(apple.name).toBe('Apple');
  
  // Get the price for this product using its ID
  const priceResponse = await request.get(`https://hoff.is/store2/api/v1/price/${apple.id}`);
  expect(priceResponse.ok()).toBeTruthy();
  
  const priceData = await priceResponse.json();
  expect(priceData.price).toBe(15);
});*/

test('verify specific product price via API', async ({ request }) => {
  // Get price for product with ID 1 (Apple)
  const response = await request.get('https://hoff.is/store2/api/v1/price/1');
  
  expect(response.ok()).toBeTruthy();
  
  const priceData = await response.json();
  
  // Verify the price for Apple is $15
  expect(priceData.price).toBe(15);
});

test('store page accessibility check', async ({ page }) => {
  const store = new StorePage(page);
  
  // Navigate to store
  await store.gotoStore();
  
  // Inject axe-core
  await injectAxe(page);
  
  // Check for accessibility violations
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: {
      html: true
    }
  });
});
