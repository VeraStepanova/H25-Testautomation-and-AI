import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';


let password: string;
test('consumer can log in successfully', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    if (process.env.STORE_PASSWORD !== undefined ) {
        password = process.env.STORE_PASSWORD;
    } 

    await login.login('markus', password, 'consumer');

    await expect(page).toHaveURL(/\/store/i);
});

test('shows an error with invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('markus', 'wrongpassword', 'consumer');

    await expect(page.getByTestId('error-message')).toContainText('Incorrect password');
});
 

