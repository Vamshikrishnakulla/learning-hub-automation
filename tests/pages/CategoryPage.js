// @ts-check

import BasePage from './BasePage.js';

export default class CategoryPage extends BasePage {
  constructor(page) {
    super(page);

    this.cseBranchCard = page.getByRole('link', { name: 'CSE' });
    this.eceBranchCard = page.getByRole('link', { name: 'ECE' });
    this.eeeBranchCard = page.getByRole('link', { name: 'EEE' });
    this.civilBranchCard = page.getByRole('link', { name: 'CIVIL' });
    this.heroArrows = page.getByText('>', { exact: true });
    this.leftHeroArrow = page.getByText('<', { exact: true });
  }

  async selectBranch(branchName) {
    const branchMap = {
      CSE: this.cseBranchCard,
      ECE: this.eceBranchCard,
      EEE: this.eeeBranchCard,
      CIVIL: this.civilBranchCard
    };

    const targetBranch = branchMap[branchName];

    if (!targetBranch) {
      throw new Error(`Unsupported branch: ${branchName}`);
    }

    await targetBranch.click();
  }
}
