import { test, expect } from '../fixtures/customFixtures.js';

test.describe('Dynamic DOM component injection', () => {
  
  test('TC_COMP_001: verifies the dynamic header is injected into the page', async ({ basePage }) => {
    // Arrange & Act are handled by the basePage fixture automatically loading /category.html
    // Assert
    await basePage.verifyHeaderInjected();
  });

  test('TC_COMP_002: verifies the dynamic footer is injected into the page', async ({ basePage, page }) => {
    // Arrange: We override the fixture's default navigation to check the footer on the About page
    await page.goto('/about.html');
    // Assert
    await basePage.verifyFooterInjected();
  });

  test('TC_COMP_003: expands the mobile hamburger menu', async ({ basePage, page }) => {
    // Arrange: Set mobile viewport (fixture already navigated to /category.html)
    await page.setViewportSize({ width: 375, height: 667 });

    // Act
    await basePage.openMobileNav();

    // Assert
    await expect(basePage.logoClose).toBeVisible();
    await expect(basePage.logoOpen).toBeHidden();
  });

  test('TC_COMP_004: collapses the mobile hamburger menu', async ({ basePage, page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 });
    await basePage.openMobileNav();

    // Act
    await basePage.closeMobileNav();

    // Assert
    await expect(basePage.logoOpen).toBeVisible();
    await expect(basePage.logoClose).toBeHidden();
  });

  test('TC_COMP_005: verifies top navigation links route to the expected pages', async ({ basePage, page }) => {
    // Act / Assert
    await basePage.clickNavLink('About');
    await expect(page).toHaveURL(/about\.html$/);

    // Navigate back via UI to test the next link
    await basePage.clickNavLink('Home');

    await basePage.clickNavLink('ContactUs');
    await expect(page).toHaveURL(/contact\.html$/);
  });
});