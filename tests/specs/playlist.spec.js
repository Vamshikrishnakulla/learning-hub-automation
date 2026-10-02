import { test, expect } from '../fixtures/customFixtures.js';
import { clearStorage } from '../utils/storageHelper.js';

test.describe('Playlist page behavior', () => {
  test('TC_PLAY_001: unauthenticated playlist access without a selected subject triggers the navigation guard alert', async ({ page }) => {
    // Arrange
    await clearStorage(page);
    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Act
    await page.goto('/playlist.html');

    // Assert
    await expect(page).toHaveURL(/\/category\.html$/);
    expect(dialogMessage).toContain('Please, Choose the subject.');
  });

  test('TC_PLAY_002: direct playlist navigation with no stored subject redirects users back to the category page', async ({ page }) => {
    // Arrange
    await clearStorage(page);

    // Act
    await page.goto('/playlist.html');

    // Assert
    await expect(page).toHaveURL(/\/category\.html$/);
  });

  test('TC_PLAY_003: a selected subject renders the personalized greeting on the playlist page', async ({ authenticatedPlaylistPage }) => {
    // Arrange
    // fixture seeds valid user + subject before navigating to /playlist.html

    // Assert
    await expect(authenticatedPlaylistPage.greetingHeader).toContainText('Test User');
  });

  test('TC_PLAY_004: the selected subject is shown in the playlist status text', async ({ authenticatedPlaylistPage }) => {
    // Arrange
    // fixture seeds valid user + subject before navigating to /playlist.html

    // Assert
    await expect(authenticatedPlaylistPage.statusText).toContainText('You have choosed to learn');
    await expect(authenticatedPlaylistPage.statusText).toContainText('BEE');
  });

  test('TC_PLAY_005: language selector is visible with the default prompt intact', async ({ authenticatedPlaylistPage }) => {
    // Arrange
    // fixture seeds valid user + subject before navigating to /playlist.html

    // Assert
    await expect(authenticatedPlaylistPage.languageDropdown).toBeVisible();
    await expect(authenticatedPlaylistPage.languageDropdown).toHaveValue('null');
  });

  test('TC_PLAY_006: selecting English persists the language to localStorage and updates the playlist URL', async ({ authenticatedPlaylistPage }) => {
    // Act
    await authenticatedPlaylistPage.selectLanguage('English');

    // Assert
    await expect(authenticatedPlaylistPage.languageDropdown).toHaveValue('English');
    const savedLanguage = await authenticatedPlaylistPage.page.evaluate(() => window.localStorage.getItem('language'));
    expect(savedLanguage).toBe('English');
    await authenticatedPlaylistPage.verifyVideoPlaylistLink();
  });

  test('TC_PLAY_007: selecting Hindi persists the language to localStorage and updates the playlist URL', async ({ authenticatedPlaylistPage }) => {
    // Act
    await authenticatedPlaylistPage.selectLanguage('Hindi');

    // Auto-wait for DOM update before reading storage
    await expect(authenticatedPlaylistPage.statusText).toContainText('Hindi');

    // Assert
    const savedLanguage = await authenticatedPlaylistPage.page.evaluate(() => window.localStorage.getItem('language'));
    expect(savedLanguage).toBe('Hindi');
    await expect(authenticatedPlaylistPage.languageDropdown).toHaveValue('Hindi');
    await authenticatedPlaylistPage.verifyVideoPlaylistLink();
  });

  test('TC_PLAY_008: selecting Telugu persists the language to localStorage and updates the playlist URL', async ({ authenticatedPlaylistPage }) => {
    // Act
    await authenticatedPlaylistPage.selectLanguage('Telugu');

    // Assert
    await expect(authenticatedPlaylistPage.languageDropdown).toHaveValue('Telugu');
    const savedLanguage = await authenticatedPlaylistPage.page.evaluate(() => window.localStorage.getItem('language'));
    expect(savedLanguage).toBe('Telugu');
    await authenticatedPlaylistPage.verifyVideoPlaylistLink();
  });

  test('TC_PLAY_009: the video playlist link is not a placeholder and exposes a valid external target', async ({ authenticatedPlaylistPage }) => {
    // Arrange
    await authenticatedPlaylistPage.selectLanguage('English');

    // Assert
    await expect(authenticatedPlaylistPage.videoButton).toHaveAttribute('href', /youtube\.com|youtu\.be/);
    await expect(authenticatedPlaylistPage.videoButton).toHaveAttribute('target', '_blank');
  });

  test('TC_PLAY_010: unauthenticated discussion room click redirects to the login page', async ({ page }) => {
    // Arrange
    await clearStorage(page);
    await page.addInitScript(() => {
      window.localStorage.setItem('subject', 'BEE');
      window.localStorage.setItem('subjectcode', '0');
      window.localStorage.setItem('language', 'English');
    });

    // Act
    await page.goto('/playlist.html');
    await page.getByRole('link', { name: /Please, Login/i }).click();

    // Assert
    await expect(page).toHaveURL(/\/login\.html$/);
  });

  test.fixme('TC_PLAY_011: authenticated discussion-room access should succeed when the valid session is present', async ({ authenticatedPlaylistPage }) => {
    // The live app currently keeps the discussion room behind the login placeholder even when the
    // localStorage profile and subject are seeded before navigation. This is a known app-level gap.
    const discussionLink = authenticatedPlaylistPage.discussionLink.locator('a');
    await expect(discussionLink).not.toHaveAttribute('href', '#');
  });

  test.fixme('TC_PLAY_012: authenticated topic access should not redirect the user to login when the session is active', async ({ authenticatedPlaylistPage }) => {
    const discussionLink = authenticatedPlaylistPage.discussionLink.locator('a');
    await expect(discussionLink).toHaveAttribute('href', /\w+/);
    await expect(discussionLink).toHaveAttribute('target', '_blank');
  });
});
