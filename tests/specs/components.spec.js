import { test, expect } from '../fixtures/customFixtures.js';

test.describe('Dynamic DOM component injection', () => {
  
  test('TC_COMP_001: verifies the dynamic header is injected into the page', async ({ basePage }) => {
    // Arrange & Act are handled by the basePage fixture automatically loading /category.html
    // Assert
    await expect(basePage.headerPlaceholder).toBeVisible();
    await expect(basePage.headerNav).toBeVisible();
    await expect(basePage.homeLink).toBeVisible();
    await expect(basePage.aboutLink).toBeVisible();
    await expect(basePage.contactUsLink).toBeVisible();
  });

  test('TC_COMP_002: verifies the dynamic footer is injected into the page', async ({ basePage }) => {
    // Arrange: We override the fixture's default navigation to check the footer on the About page
    await basePage.clickNavLink('About');
    // Assert
    await expect(basePage.footerPlaceholder).toBeVisible();
    await expect(basePage.footerPlaceholder).toContainText('Getthrough.com');
    await expect(basePage.footerPlaceholder).toContainText('Projectbeclearedlearninghub@gmail.com');
  });

  test('TC_COMP_003: expands the mobile hamburger menu', async ({ basePage }) => {
    // Arrange: Set mobile viewport (fixture already navigated to /category.html)
    await basePage.setMobileViewport();
    await expect(basePage.logoOpen).toBeVisible();

    // Act
    await basePage.openMobileNav();

    // Assert
    await expect(basePage.logoClose).toBeVisible();
    await expect(basePage.logoOpen).toBeHidden();
  });

  test('TC_COMP_004: collapses the mobile hamburger menu', async ({ basePage }) => {
    // Arrange
    await basePage.setMobileViewport();
    await basePage.openMobileNav();

    // Act
    await basePage.closeMobileNav();

    // Assert
    await expect(basePage.logoOpen).toBeVisible();
    await expect(basePage.logoClose).toBeHidden();
  });

  test('TC_COMP_005: verifies top navigation links route to the expected pages', async ({ basePage }) => {
    // Act / Assert
    await basePage.clickNavLink('About');
    await expect(basePage.page).toHaveURL(/about\.html$/);

    // Navigate back via UI to test the next link
    await basePage.clickNavLink('Home');

    await basePage.clickNavLink('ContactUs');
    await expect(basePage.page).toHaveURL(/contact\.html$/);
  });
});