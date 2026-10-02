// @ts-check

import { expect } from '@playwright/test';

export default class BasePage {
  constructor(page) {
    this.page = page;

    this.headerPlaceholder = page.locator('#header-placeholder');
    this.headerNav = page.locator('#header-placeholder nav');
    this.footerPlaceholder = page.locator('#footer-placeholder');
    this.logoOpen = page.locator('#logo-div-open');
    this.logoClose = page.locator('#logo-div-close');
    this.navDisplay = page.locator('#navdisplay');

    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.subjectsLink = page.getByRole('link', { name: 'Subjects' });
    this.contactUsLink = page.getByRole('link', { name: 'ContactUs' });
    this.searchBox = page.getByRole('searchbox', { name: 'Search Q&A...' });
    this.searchLink = page.getByRole('link', { name: 'Search' });
    this.signupLink = page.getByRole('link', { name: 'SignUp' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
  }

  async verifyHeaderInjected() {
    await expect(this.headerPlaceholder).toBeVisible();
    await expect(this.headerNav).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.contactUsLink).toBeVisible();
  }

  async verifyFooterInjected() {
    await expect(this.footerPlaceholder).toBeVisible();
    await expect(this.footerPlaceholder).toContainText('Getthrough.com');
    await expect(this.footerPlaceholder).toContainText('Projectbeclearedlearninghub@gmail.com');
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
