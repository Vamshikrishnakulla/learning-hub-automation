import { test, expect } from '../fixtures/customFixtures.js';
import courseData from '../data/courseData.json';

test.describe('Subject and semester selection', () => {
  test('TC_SUB_001: verifies the sidebar semester group toggles', async ({ subCategoryPage }) => {
    // Arrange
    // fixture loads /sub_category_transparent.html

    // Act
    await subCategoryPage.toggleSemesterGroup(0);
    await subCategoryPage.toggleSemesterGroup(1);

    // Assert
    await expect(subCategoryPage.semesterHeaders.nth(0)).toBeVisible();
    await expect(subCategoryPage.semesterHeaders.nth(1)).toBeVisible();
  });

  test('TC_SUB_002: verifies the selected subject persists in localStorage', async ({ subCategoryPage }) => {
    // Arrange
    // fixture loads /sub_category_transparent.html

    // Act
    await subCategoryPage.selectSubjectByName(courseData.defaultCourse.name);

    // Assert
    const selectedSubject = await subCategoryPage.getLocalStorageItem('subject');
    const subjectCode = await subCategoryPage.getLocalStorageItem('subjectcode');

    expect(selectedSubject).toBe(courseData.defaultCourse.name);
    expect(subjectCode).toBe(courseData.defaultCourse.code);
    await expect(subCategoryPage.beeSubject).toBeVisible();
  });

  test('TC_SUB_003: verifies the question paper button shows the paper view', async ({ subCategoryPage }) => {
    // Arrange
    await subCategoryPage.selectSubjectByName(courseData.defaultCourse.name);

    // Act
    await subCategoryPage.clickQuestionPaperButton();

    // Assert
    await expect(subCategoryPage.questionPaperButton).toBeHidden();
    await expect(subCategoryPage.syllabusButton).toBeVisible();
  });

  test('TC_SUB_004: verifies the syllabus button restores the syllabus view', async ({ subCategoryPage }) => {
    // Arrange
    await subCategoryPage.selectSubjectByName(courseData.defaultCourse.name);

    // Act
    await subCategoryPage.clickQuestionPaperButton();
    await expect(subCategoryPage.syllabusButton).toBeVisible();
    await subCategoryPage.clickSyllabusButton();

    // Assert
    await expect(subCategoryPage.syllabusButton).toBeHidden();
    await expect(subCategoryPage.questionPaperButton).toBeVisible();
  });

  test('TC_SUB_005: verifies selecting a new subject resets the button state', async ({ subCategoryPage }) => {
    // Arrange
    await subCategoryPage.selectSubjectByName(courseData.defaultCourse.name);
    await subCategoryPage.clickQuestionPaperButton();

    // Act
    await subCategoryPage.selectSubjectByName('M-1');

    // Assert
    await expect(subCategoryPage.questionPaperButton).toBeVisible();
    await expect(subCategoryPage.syllabusButton).toBeHidden();
  });

  test('TC_SUB_006: verifies the selected course redirects to the playlist page', async ({ subCategoryPage }) => {
    // Arrange
    await subCategoryPage.selectSubjectByName(courseData.defaultCourse.name);

    // Act
    await subCategoryPage.submitSelectedSubject();

    // Assert
    await expect(subCategoryPage.page).toHaveURL(/playlist\.html$/);
  });

  test('TC_SUB_007: verifies the mobile sidebar drawer can toggle open and closed', async ({ subCategoryPage }) => {
    // Arrange
    // The app is expected to expose a mobile subject drawer toggle.
    await subCategoryPage.setMobileViewport();
    await expect(subCategoryPage.subjectOpenButton).toBeVisible();

    // Act
    await subCategoryPage.toggleMobileSidebar(true);

    // Assert
    await expect(subCategoryPage.cardDisplay).toBeVisible();

    // Act
    await subCategoryPage.toggleMobileSidebar(false);

    // Assert
    await expect(subCategoryPage.cardDisplay).toBeHidden();
    await expect(subCategoryPage.page).toHaveURL(/sub_category_transparent\.html$/);
  });
});
