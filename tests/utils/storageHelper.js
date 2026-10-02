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
    ...profileObject
  };

  await page.addInitScript((storageProfile) => {
    Object.entries(storageProfile).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        window.localStorage.setItem(key, String(value));
      }
    });
  }, profile);
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
    const requiredKeys = ['name', 'addno', 'college', 'university', 'branch', 'email', 'key'];
    return requiredKeys.every((key) => {
      const value = window.localStorage.getItem(key);
      return value !== null && value !== undefined && value !== '';
    });
  });
}

export default {
  seedUserProfile,
  seedSubjectState,
  clearStorage,
  evaluateIsAuthenticated
};
