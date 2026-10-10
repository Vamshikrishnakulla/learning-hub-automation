// @ts-check

import BasePage from './BasePage.js';
import { seedSubjectState as seedSubjectStateInStorage } from '../utils/storageHelper.js';

export default class PlaylistPage extends BasePage {
  constructor(page) {
    super(page);

    this.greetingHeader = page.locator('.user-greeting');
    this.statusText = page.locator('#parachange');
    this.languageDropdown = page.getByRole('combobox', { name: 'Select Video Language' });
    this.webButton = page.getByRole('link', { name: 'Open web reference' });
    this.videoButton = page.getByRole('link', { name: 'Start video learning' });
    this.notesButton = page.getByRole('link', { name: 'Download notes' });
    this.discussionLinkAnchor = page.locator('#discussLink a');
    this.videoPlaylistLink = page.locator('#playlist2');
    this.backLink = page.getByRole('link', { name: '<<Back' });
  }

  async selectLanguage(languageName) {
    await this.languageDropdown.selectOption(languageName);
  }

  async navigateToPlaylist() {
    await this.page.goto('/playlist.html');
  }

  async seedSubjectState(subjectName, subjectCode) {
    await seedSubjectStateInStorage(this.page, subjectName, subjectCode);
  }

  async openDiscussionRoom() {
    await this.discussionLinkAnchor.click();
  }
}
