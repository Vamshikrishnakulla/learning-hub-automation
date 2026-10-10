import { test, expect } from '../fixtures/customFixtures.js';
import userProfiles from '../data/userProfiles.json';

test.describe('Registration and authentication', () => {
  test('TC_AUTH_001: verifies signup inputs persist to localStorage on focusout', async ({ signupPage }) => {
    // Act
    await signupPage.fillSignupForm(userProfiles.validUser);

    // Assert
    for (const [fieldName, value] of Object.entries(userProfiles.validUser)) {
      await expect.poll(async () => {
        return signupPage.getLocalStorageItem(fieldName);
      }).toBe(String(value));
    }
  });

  test('TC_AUTH_002: prevents signup when required fields are incomplete', async ({ signupPage }) => {
    // Arrange
    for (const [fieldName, value] of Object.entries(userProfiles.incompleteUser)) {
      await signupPage.fillSignupField(fieldName, value);
    }

    // Act
    await signupPage.submitSignupForm();

    // Assert
    await expect(signupPage.page).toHaveURL(/signup\.html$/);
  });

  test('TC_AUTH_003: allows complete signup to proceed', async ({ signupPage }) => {
    await signupPage.mockSignupBackend();
    signupPage.setupDialogHandler();

    // Act
    await signupPage.fillSignupForm(userProfiles.validUser);
    await signupPage.submitSignupForm();

    // Assert
    await expect(signupPage.page).toHaveURL(/login\.html$/, { timeout: 10000 });
  });

  test('TC_AUTH_004: redirects to signup when login uses unregistered credentials', async ({ loginPage }) => {
    // Arrange
    // no stored credentials set
    loginPage.setupDialogHandler();

    // Act
    await loginPage.login('unknown@example.com', 'wrongpass');

    // Assert
    await expect(loginPage.page).toHaveURL(/signup\.html$/, { timeout: 10000 });
  });

  test('TC_AUTH_005: logs in successfully with stored valid credentials', async ({ loginPage }) => {
    // Arrange
    await loginPage.seedUserProfile(userProfiles.validUser);

    // Act
    await loginPage.login(userProfiles.validUser.email, userProfiles.validUser.key);

    // Assert
    await expect(loginPage.page).toHaveURL(/category\.html$/);
  });

  test('TC_AUTH_006: rejects login when password is incorrect', async ({ loginPage }) => {
    // Arrange
    await loginPage.seedUserProfile(userProfiles.validUser);

    // Act
    await loginPage.login(userProfiles.validUser.email, 'wrongpass');

    // Assert
    await expect(loginPage.page).toHaveURL(/login\.html$/);
  });

  test('TC_AUTH_007: evaluates isAuthenticated() return values correctly', async ({ authPage }) => {
    // Arrange
    await authPage.navigateToSignup();
    await authPage.seedUserProfile(userProfiles.validUser);

    // Act
    const isAuthenticated = await authPage.evaluateIsAuthenticated();

    // Assert
    expect(isAuthenticated).toBe(true);

    // Act
    await authPage.removeLocalStorageItem('isLoggedIn');
    const isLoggedOut = await authPage.evaluateIsAuthenticated();

    // Assert
    expect(isLoggedOut).toBe(false);
  });
});
