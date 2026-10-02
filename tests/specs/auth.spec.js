import { test, expect } from '../fixtures/customFixtures.js';
import { evaluateIsAuthenticated } from '../utils/storageHelper.js';

test.describe('Registration and authentication', () => {
  test('TC_AUTH_001: verifies signup inputs persist to localStorage on focusout', async ({ signupPage, page }) => {
    // Arrange
    const profile = {
      name: 'Test User',
      addno: '123456',
      college: 'Test College',
      university: 'Test University',
      branch: 'CSE',
      email: 'test.user@example.com',
      key: 'pass123'
    };

    // Act
    for (const [fieldName, value] of Object.entries(profile)) {
      await signupPage.fillSignupField(fieldName, value);
    }

    // Assert
    for (const [fieldName, value] of Object.entries(profile)) {
      const persisted = await page.evaluate((key) => localStorage.getItem(key), fieldName);
      expect(persisted).toBe(String(value));
    }
  });

  test('TC_AUTH_002: prevents signup when required fields are incomplete', async ({ signupPage, page }) => {
    // Arrange
    await signupPage.fillSignupField('name', 'Test User');
    await signupPage.fillSignupField('addno', '123456');
    await signupPage.fillSignupField('college', '');
    await signupPage.fillSignupField('university', 'Test University');
    await signupPage.fillSignupField('branch', 'CSE');
    await signupPage.fillSignupField('email', 'test.user@example.com');
    await signupPage.fillSignupField('key', 'pass123');

    // Act
    await signupPage.submitSignupForm();

    // Assert
    await expect(page).toHaveURL(/signup\.html$/);
  });

  test('TC_AUTH_003: allows complete signup to proceed', async ({ signupPage, page }) => {
    // Arrange
    const profile = {
      name: 'Test User',
      addno: '123456',
      college: 'Test College',
      university: 'Test University',
      branch: 'CSE',
      email: 'test.user@example.com',
      key: 'pass123'
    };

    // Act
    for (const [fieldName, value] of Object.entries(profile)) {
      await signupPage.fillSignupField(fieldName, value);
    }
    await signupPage.submitSignupForm();

    // Assert
    await expect(page).toHaveURL(/login\.html$/, { timeout: 10000 });
  });

  test('TC_AUTH_004: redirects to signup when login uses unregistered credentials', async ({ loginPage, page }) => {
    // Arrange
    // no stored credentials set

    // Act
    await loginPage.login('unknown@example.com', 'wrongpass');

    // Assert
    await expect(page).toHaveURL(/signup\.html$/);
  });

  test('TC_AUTH_005: logs in successfully with stored valid credentials', async ({ loginPage, page }) => {
    // Arrange
    await page.evaluate(() => {
      localStorage.setItem('email', 'user@test.com');
      localStorage.setItem('key', 'pass123');
    });

    // Act
    await loginPage.login('user@test.com', 'pass123');

    // Assert
    await expect(page).toHaveURL(/category\.html$/);
  });

  test('TC_AUTH_006: rejects login when password is incorrect', async ({ loginPage, page }) => {
    // Arrange
    await page.evaluate(() => {
      localStorage.setItem('email', 'user@test.com');
      localStorage.setItem('key', 'pass123');
    });

    // Act
    await loginPage.login('user@test.com', 'wrongpass');

    // Assert
    await expect(page).toHaveURL(/login\.html$/);
  });

  test('TC_AUTH_007: evaluates isAuthenticated() return values correctly', async ({ page }) => {
    // Arrange
    await page.goto('/signup.html');
    await page.evaluate(() => {
      localStorage.setItem('name', 'Test User');
      localStorage.setItem('addno', '123456');
      localStorage.setItem('college', 'Test College');
      localStorage.setItem('university', 'Test University');
      localStorage.setItem('branch', 'CSE');
      localStorage.setItem('email', 'user@test.com');
      localStorage.setItem('key', 'pass123');
    });

    // Act
    const isAuthenticated = await evaluateIsAuthenticated(page);

    // Assert
    expect(isAuthenticated).toBe(true);

    // Act
    await page.evaluate(() => localStorage.removeItem('college'));
    const isMissingCollege = await evaluateIsAuthenticated(page);

    // Assert
    expect(isMissingCollege).toBe(false);
  });
});
