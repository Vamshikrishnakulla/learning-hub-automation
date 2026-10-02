// @ts-check

import BasePage from './BasePage.js';

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

  async openDiscussionRoom() {
    await this.discussionLinkAnchor.click();
  }

  async verifyDiscussionRoomRedirectsToLogin() {
    await this.page.waitForURL(/\/login\.html$/);
    await this.discussionLinkAnchor.waitFor({ state: 'visible' });
  }

  async getVideoPlaylistLink() {
    return await this.videoPlaylistLink.getAttribute('href');
  }

  async verifyVideoPlaylistLink() {
    const href = await this.getVideoPlaylistLink();
    const target = await this.videoPlaylistLink.getAttribute('target');

    if (!href || !/^https?:\/\//.test(href)) {
      throw new Error(`Expected YouTube playlist URL but found: ${href}`);
    }
    if (target !== '_blank') {
      throw new Error(`Expected playlist target to be _blank but found: ${target}`);
    }
  }
}
