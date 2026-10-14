import { test as base, expect } from '@playwright/test';

import BasePage from '../pages/BasePage.js';
import CategoryPage from '../pages/CategoryPage.js';
import SubCategoryPage from '../pages/SubCategoryPage.js';
import AuthPage from '../pages/AuthPage.js';
import PlaylistPage from '../pages/PlaylistPage.js';
import { seedUserProfile, seedSubjectState } from '../utils/storageHelper.js';
import userProfiles from '../data/userProfiles.json';
import courseData from '../data/courseData.json';

export { expect };

export const test = base.extend({
  basePage: async ({ page }, use) => {
    await page.goto('category.html');
    await use(new BasePage(page));
  },

  categoryPage: async ({ page }, use) => {
    await page.goto('category.html');
    await use(new CategoryPage(page));
  },

  subCategoryPage: async ({ page }, use) => {
    await page.goto('sub_category_transparent.html');
    await use(new SubCategoryPage(page));
  },

  signupPage: async ({ page }, use) => {
    await page.goto('signup.html');
    await use(new AuthPage(page));
  },

  loginPage: async ({ page }, use) => {
    await page.goto('login.html');
    await use(new AuthPage(page));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  authenticatedPlaylistPage: async ({ page }, use) => {
    await seedUserProfile(page, userProfiles.validUser);
    await seedSubjectState(page, courseData.defaultCourse.name, courseData.defaultCourse.code);
    await page.goto('playlist.html');
    await use(new PlaylistPage(page));
  },

  playlistPage: async ({ page }, use) => {
    await use(new PlaylistPage(page));
  }
});

export default test;
