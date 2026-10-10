// @ts-nocheck

import BasePage from './BasePage.js';
import {
  evaluateIsAuthenticated as evaluateIsAuthenticatedInStorage,
  seedUserProfile as seedUserProfileInStorage
} from '../utils/storageHelper.js';

export default class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    this.nameInput = page.getByRole('textbox', { name: 'Name :', exact: true });
    this.admissionNoInput = page.getByLabel('Admission No :');
    this.collegeInput = page.getByLabel('College Name :');
    this.universityInput = page.getByLabel('University :');
    this.branchInput = page.getByLabel('Branch :');
    this.emailInput = page.getByLabel('Email address :');
    this.passwordInput = page.getByLabel('password :');
    this.signupSubmitButton = page.locator('#sub');

    this.loginEmailInput = page.getByLabel('Email address :');
    this.loginPasswordInput = page.getByLabel('Password :');
    this.loginSubmitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillSignupForm(profile) {
    for (const [key, val] of Object.entries(profile)) {
      await this.fillSignupField(key, val);
    }
  }

  async navigateToSignup() {
    await this.page.goto('/signup.html');
  }

  async seedUserProfile(profile) {
    await seedUserProfileInStorage(this.page, profile);
  }

  async mockSignupBackend() {
    await this.page.route('**/script.google.com/**', (route) => route.fulfill({ status: 200, body: 'success' }));
  }

  async evaluateIsAuthenticated() {
    return evaluateIsAuthenticatedInStorage(this.page);
  }

  async fillSignupField(fieldName, value) {
    const fieldMap = {
      name: this.nameInput,
      addno: this.admissionNoInput,
      college: this.collegeInput,
      university: this.universityInput,
      branch: this.branchInput,
      email: this.emailInput,
      key: this.passwordInput
    };

    const field = fieldMap[fieldName];

    if (!field) {
      throw new Error(`Unsupported signup field: ${fieldName}`);
    }

    await field.fill(String(value));
    await field.blur();
    await field.evaluate((element) => {
      element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, cancelable: true }));
    });
  }

  async submitSignupForm() {
    await this.signupSubmitButton.click();
  }

  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }
}
