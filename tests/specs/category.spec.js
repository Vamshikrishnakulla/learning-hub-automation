import { test, expect } from '../fixtures/customFixtures.js';

test.describe('Branch selection dashboard', () => {
  test('TC_CAT_001: verifies the hero carousel arrow controls are rendered', async ({ categoryPage }) => {
    // Arrange
    // fixture loads /category.html

    // Assert
    await expect(categoryPage.heroArrows).toBeVisible();
    await expect(categoryPage.leftHeroArrow).toBeVisible();
  });

  test('TC_CAT_002: verifies CSE branch selection navigates to the subject page', async ({ categoryPage }) => {
    // Arrange
    // fixture loads /category.html

    // Act
    await categoryPage.selectBranch('CSE');

    // Assert
    await expect(categoryPage.page).toHaveURL(/sub_category_transparent\.html$/);
  });

  for (const [index, branch] of ['ECE', 'EEE', 'CIVIL'].entries()) {
    test(`TC_CAT_00${index + 3}: verifies the ${branch} branch is blocked with an alert`, async ({ categoryPage }) => {
      let dialogMessage = '';
      categoryPage.setupDialogHandler((message) => {
        dialogMessage = message;
      });

      await categoryPage.selectBranch(branch);

      expect(dialogMessage).toContain('Currently, the service is only available for the CSE branch.');
      await expect(categoryPage.page).toHaveURL(/category\.html(#|\?.*)?$/);
    });
  }
});
