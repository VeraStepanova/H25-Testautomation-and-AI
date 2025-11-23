import { test } from '@playwright/test';
import { StorePage } from '../pages/storePage';
import { LoginPage } from '../pages/loginPage';

let password: string;

test('user buys 5 apples and sees receipt', async ({ page }) => {
  const login = new LoginPage (page);
  const store = new StorePage(page);
  

  await login.goto();
  // Login
   if (process.env.STORE_PASSWORD !== undefined ) {
        password = process.env.STORE_PASSWORD;
    } 
  await login.login('Vera', password, 'consumer');

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
