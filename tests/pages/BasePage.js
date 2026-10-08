// @ts-check

export default class BasePage {
  constructor(page) {
    this.page = page;

    /** @readonly */
    this.headerPlaceholder = page.locator('#header-placeholder');
    /** @readonly */
    this.headerNav = page.locator('#header-placeholder nav');
    /** @readonly */
    this.footerPlaceholder = page.locator('#footer-placeholder');
    /** @readonly */
    this.logoOpen = page.locator('#logo-div-open');
    /** @readonly */
    this.logoClose = page.locator('#logo-div-close');
    /** @readonly */
    this.navDisplay = page.locator('#navdisplay');

    /** @readonly */
    this.homeLink = page.getByRole('link', { name: 'Home' });
    /** @readonly */
    this.aboutLink = page.getByRole('link', { name: 'About' });
    /** @readonly */
    this.subjectsLink = page.getByRole('link', { name: 'Subjects' });
    /** @readonly */
    this.contactUsLink = page.getByRole('link', { name: 'ContactUs' });
    /** @readonly */
    this.searchBox = page.getByRole('searchbox', { name: 'Search Q&A...' });
    /** @readonly */
    this.searchLink = page.getByRole('link', { name: 'Search' });
    /** @readonly */
    this.signupLink = page.getByRole('link', { name: 'SignUp' });
    /** @readonly */
    this.loginLink = page.getByRole('link', { name: 'Login' });
  }

  /**
   * Sets up an event listener for browser dialogs (alerts/confirms).
   * @param {(message: string) => void} [onMessage] Optional callback to capture the dialog text.
   */
  setupDialogHandler(onMessage = () => {}) {
    this.page.on('dialog', async (dialog) => {
      onMessage(dialog.message());
      await dialog.accept();
    });
  }

  /** Sets viewport size for mobile emulation. */
  async setMobileViewport(width = 375, height = 667) {
    await this.page.setViewportSize({ width, height });
  }

  /** Clears localStorage on the next page load. */
  async clearStorage() {
    await this.page.addInitScript(() => window.localStorage.clear());
  }

  async getLocalStorageItem(key) {
    return this.page.evaluate((storageKey) => window.localStorage.getItem(storageKey), key);
  }

  async removeLocalStorageItem(key) {
    await this.page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), key);
  }

  async openMobileNav() {
    await this.logoOpen.click();
  }

  async toggleNavbarOpen() {
    await this.openMobileNav();
  }

  async closeMobileNav() {
    await this.logoClose.click();
  }

  async toggleNavbarClose() {
    await this.closeMobileNav();
  }

  async clickNavLink(linkName) {
    const navLinkMap = {
      Home: this.homeLink,
      About: this.aboutLink,
      Subjects: this.subjectsLink,
      ContactUs: this.contactUsLink,
      Search: this.searchLink,
      SignUp: this.signupLink,
      Login: this.loginLink
    };

    const targetLink = navLinkMap[linkName];

    if (!targetLink) {
      throw new Error(`Unsupported navigation link: ${linkName}`);
    }

    await targetLink.click();
  }
}
