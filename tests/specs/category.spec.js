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

  test('TC_CAT_003: verifies the ECE branch is blocked with an alert', async ({ categoryPage, page }) => {
    // Arrange
    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Act
    await categoryPage.selectBranch('ECE');

    // Assert
    await expect(page).toHaveURL(/category\.html$/);
    expect(dialogMessage).toContain('Currently, the service is only avaliable for the branch CSE');
  });

  test('TC_CAT_004: verifies the EEE branch is blocked with an alert', async ({ categoryPage, page }) => {
    // Arrange
    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Act
    await categoryPage.selectBranch('EEE');

    // Assert
    await expect(page).toHaveURL(/category\.html$/);
    expect(dialogMessage).toContain('Currently, the service is only avaliable for the branch CSE');
  });

  test('TC_CAT_005: verifies the CIVIL branch is blocked with an alert', async ({ categoryPage, page }) => {
    // Arrange
    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Act
    await categoryPage.selectBranch('CIVIL');

    // Assert
    await expect(page).toHaveURL(/category\.html$/);
    expect(dialogMessage).toContain('Currently, the service is only avaliable for the branch CSE');
  });
});
