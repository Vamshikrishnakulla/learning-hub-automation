// @ts-check

import BasePage from './BasePage.js';

export default class SubCategoryPage extends BasePage {
  constructor(page) {
    super(page);

    this.semesterHeaders = page.getByText(/I-I SEM|I-II SEM|II-I SEM|II-II SEM|III-I SEM|III-II SEM|IV-I SEM|IV-II SEM/);
    this.subjectLinks = page.locator('a[href="#getimage"]');
    this.questionPaperButton = page.locator('#qpaperbutton');
    this.syllabusButton = page.locator('#spaperbutton');
    this.syllabusImage = page.locator('img[alt*="Oops"], img[alt*="Image is Missing"]');
    this.submitButton = page.getByRole('link', { name: 'submit' });
    this.subjectOpenButton = page.locator('#subject-open');
    this.subjectCloseButton = page.locator('#subject-close');
    this.cardDisplay = page.locator('#card-display');

    this.beeSubject = page.getByRole('link', { name: 'BEE' });
    this.mathematicsOneSubject = page.getByRole('link', { name: 'M-1' });
    this.engineeringMechanicalSubject = page.getByRole('link', { name: 'EM' });
    this.engineeringGraphicsSubject = page.getByRole('link', { name: 'DRAWING' });
    this.physicsSubject = page.getByRole('link', { name: 'PHYSICS' });
  }

  async toggleSemesterGroup(index) {
    await this.semesterHeaders.nth(index).click();
  }

  async selectSubjectByName(subjectName) {
    const subjectLocator = this.subjectLinks.filter({ hasText: subjectName });
    await subjectLocator.first().click();
  }

  async clickQuestionPaperButton() {
    await this.questionPaperButton.click();
  }

  async clickSyllabusButton() {
    await this.syllabusButton.click();
  }

  async submitSelectedSubject() {
    await this.submitButton.click();
  }

  async toggleMobileSidebar(open) {
    if (open) {
      await this.subjectOpenButton.click();
      return;
    }
    await this.subjectCloseButton.click();
  }

  async selectSemester(semesterName) {
    await this.semesterHeaders.filter({ hasText: semesterName }).first().click();
  }

  async openSubject(subjectName) {
    await this.subjectLinks.filter({ hasText: subjectName }).first().click();
  }
}
