// @ts-check

import BasePage from './BasePage.js';
import { seedSubjectState as seedSubjectStateInStorage } from '../utils/storageHelper.js';

export default class PlaylistPage extends BasePage {
  constructor(page) {
    super(page);

    this.greetingHeader = page.locator('#demo');
    this.statusText = page.locator('#parachange');
    this.languageDropdown = page.locator('#lan');
    this.webButton = page.locator('#webBtn');
    this.videoButton = page.locator('#videoBtn a');
    this.notesButton = page.locator('#notesBtn');
    this.discussionLink = page.locator('#discussLink');
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
