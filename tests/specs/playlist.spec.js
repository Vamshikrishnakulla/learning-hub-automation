import { test, expect } from '../fixtures/customFixtures.js';
import courseData from '../data/courseData.json';

test.describe('Playlist page behavior', () => {
  test('TC_PLAY_001: unauthenticated playlist access without a selected subject triggers the navigation guard alert', async ({ playlistPage }) => {
    // Arrange
    await playlistPage.clearStorage();
    let dialogMessage = '';
    playlistPage.setupDialogHandler((message) => {
      dialogMessage = message;
    });

    // Act
    await playlistPage.navigateToPlaylist();

    // Assert
    await expect(playlistPage.page).toHaveURL(/\/category\.html$/);
    expect(dialogMessage).toContain('Please, Choose the subject.');
  });

  test('TC_PLAY_002: direct playlist navigation with no stored subject redirects users back to the category page', async ({ playlistPage }) => {
    // Arrange
    await playlistPage.clearStorage();

    // Act
    await playlistPage.navigateToPlaylist();

    // Assert
    await expect(playlistPage.page).toHaveURL(/\/category\.html$/);
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
    await expect(authenticatedPlaylistPage.statusText).toContainText(courseData.defaultCourse.name);
  });

  test('TC_PLAY_005: language selector is visible with the default prompt intact', async ({ authenticatedPlaylistPage }) => {
    // Arrange
    // fixture seeds valid user + subject before navigating to /playlist.html

    // Assert
    await expect(authenticatedPlaylistPage.languageDropdown).toBeVisible();
    await expect(authenticatedPlaylistPage.languageDropdown).toHaveValue('null');
  });

  for (const [index, lang] of ['English', 'Hindi', 'Telugu'].entries()) {
    test(`TC_PLAY_00${index + 6}: selecting ${lang} persists language to localStorage and updates the playlist URL`, async ({ authenticatedPlaylistPage }) => {
      authenticatedPlaylistPage.setupDialogHandler();
      await authenticatedPlaylistPage.selectLanguage(lang);
      await expect.poll(async () => {
        return authenticatedPlaylistPage.page.evaluate(() => window.localStorage.getItem('language'));
      }).toBe(lang);
      await expect(authenticatedPlaylistPage.videoPlaylistLink).toHaveAttribute('href', /^https?:\/\//);
      await expect(authenticatedPlaylistPage.videoPlaylistLink).toHaveAttribute('target', '_blank');
    });
  }

  test('TC_PLAY_009: the video playlist link is not a placeholder and exposes a valid external target', async ({ authenticatedPlaylistPage }) => {
    // Arrange
    await authenticatedPlaylistPage.selectLanguage('English');

    // Assert
    await expect(authenticatedPlaylistPage.statusText).toContainText('English');
    await expect(authenticatedPlaylistPage.videoButton).toHaveAttribute('href', /youtube\.com|youtu\.be/);
    await expect(authenticatedPlaylistPage.videoButton).toHaveAttribute('target', '_blank');
  });

  test('TC_PLAY_010: unauthenticated discussion room click redirects to the login page', async ({ playlistPage }) => {
    // Arrange
    await playlistPage.clearStorage();
    await playlistPage.seedSubjectState(courseData.defaultCourse.name, courseData.defaultCourse.code);

    // Act
    await playlistPage.navigateToPlaylist();
    await playlistPage.openDiscussionRoom();

    // Assert
    await expect(playlistPage.page).toHaveURL(/\/login\.html$/);
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
