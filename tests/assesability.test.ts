import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';
import { StorePage } from '../pages/storePage';
import { LoginPage } from '../pages/loginPage';

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

