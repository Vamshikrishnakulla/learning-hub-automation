/**
 * @typedef {import('@playwright/test').Page} Page
 */

export async function seedUserProfile(page, profileObject = {}) {
  const profile = {
    name: '',
    addno: '',
    college: '',
    university: '',
    branch: '',
    email: '',
    key: '',
    isLoggedIn: 'true',
    ...profileObject
  };

  await page.addInitScript((storageProfile) => {
    Object.entries(storageProfile).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        window.localStorage.setItem(key, String(value));
      }
    });
  }, profile);

  if (page.url() !== 'about:blank') {
    await page.evaluate((storageProfile) => {
      Object.entries(storageProfile).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          window.localStorage.setItem(key, String(value));
        }
      });
    }, profile);
  }
}

export async function seedSubjectState(page, subjectName, subjectCode) {
  await page.addInitScript(({ subject, code }) => {
    window.localStorage.setItem('subject', String(subject));
    window.localStorage.setItem('subjectcode', String(code));
  }, { subject: subjectName, code: subjectCode });
}

export async function clearStorage(page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
}

export async function evaluateIsAuthenticated(page) {
  return await page.evaluate(() => {
    return window.localStorage.getItem('isLoggedIn') === 'true';
  });
}

export default {
  seedUserProfile,
  seedSubjectState,
  clearStorage,
  evaluateIsAuthenticated
};
