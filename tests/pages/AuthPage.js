// @ts-check

import BasePage from './BasePage.js';

export default class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    this.nameInput = page.getByRole('textbox', { name: 'Name :', exact: true });
    this.signupNameInput = this.nameInput;
    this.signupAdmissionNoInput = page.getByLabel('Admission No :');
    this.signupCollegeInput = page.getByLabel('College Name :');
    this.signupUniversityInput = page.getByLabel('University :');
    this.signupBranchInput = page.getByLabel('Branch :');
    this.signupEmailInput = page.getByLabel('Email address :');
    this.signupPasswordInput = page.getByLabel('password :');
    this.signupSubmitButton = page.locator('#sub');

    this.loginEmailInput = page.getByLabel('Email address :');
    this.loginPasswordInput = page.getByLabel('Password :');
    this.loginSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillSignupField(fieldName, value) {
    const fieldMap = {
      name: this.signupNameInput,
      addno: this.signupAdmissionNoInput,
      college: this.signupCollegeInput,
      university: this.signupUniversityInput,
      branch: this.signupBranchInput,
      email: this.signupEmailInput,
      key: this.signupPasswordInput
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

  async fillSignupForm({ name, admissionNo, college, university, branch, email, password }) {
    await this.signupNameInput.fill(name);
    await this.signupNameInput.blur();
    await this.signupAdmissionNoInput.fill(admissionNo);
    await this.signupAdmissionNoInput.blur();
    await this.signupCollegeInput.fill(college);
    await this.signupCollegeInput.blur();
    await this.signupUniversityInput.fill(university);
    await this.signupUniversityInput.blur();
    await this.signupBranchInput.fill(branch);
    await this.signupBranchInput.blur();
    await this.signupEmailInput.fill(email);
    await this.signupEmailInput.blur();
    await this.signupPasswordInput.fill(password);
    await this.signupPasswordInput.blur();
  }

  async submitSignupForm() {
    await this.signupSubmitButton.click();
  }

  async fillLoginForm({ email, password }) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
  }

  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  async signup(formData) {
    await this.fillSignupForm(formData);
    await this.submitSignupForm();
  }
}
