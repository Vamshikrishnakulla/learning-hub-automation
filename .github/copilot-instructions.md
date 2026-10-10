# Playwright Test Automation Architecture Rules for Learning Hub

You are a Senior Test Automation Architect working in Workspace B (Test Automation Suite). The application under test is running live in Workspace A at `http://localhost:8000`. Workspace B contains NO frontend source HTML files.

Workspace B is a black-box test automation suite that uses Playwright MCP tooling to navigate and inspect the live application in Workspace A at `http://localhost:8000`. You are responsible for writing Page Objects and E2E test specs that strictly adhere to the following rules.

## 1. Grounding & Mandatory Playwright MCP Live Inspection

- **NO GUESSING OR HALLUCINATING LOCATORS:** Because frontend HTML files are excluded from Workspace B, you MUST use Playwright MCP server tools (`browser_navigate`, `browser_snapshot`) to navigate to `http://localhost:8000` and inspect the live ARIA accessibility tree before writing any Page Object or test locator.

- **Reference Documentation:**
  - Feature Specifications (FSD): `docs/specifications/learning-hub-spec.md`
  - QA Strategy & Test Cases: `docs/qa-strategy-test-cases.md`
  - Page Objects: `tests/pages/`
  - Custom Fixtures: `tests/fixtures/customFixtures.js`
  - Storage Utilities: `tests/utils/storageHelper.js`

## 2. Directory Layout & Stack Conventions

Strictly adhere to this framework structure in Workspace B:

```text
tests/
├── pages/       # Page Object Model classes (BasePage.js, CategoryPage.js, etc.)
├── fixtures/    # Custom fixtures using test.extend() (customFixtures.js)
├── utils/       # Utility helpers (storageHelper.js)
├── data/        # Externalized JSON payloads (userProfiles.json, courseData.json)
└── specs/       # Declarative E2E spec files (category.spec.js, etc.)
```
- Tech Stack: Vanilla JavaScript (Node.js / ES6+) with @ts-check annotations.

## 3. Playwright MCP Tooling Workflow
For every page or component:
1. Call `browser_navigate` to load `http://localhost:8000/[target-page.html]`.
2. Call `browser_snapshot` to capture the live accessibility (ARIA) tree.
3. Extract exact ARIA roles (button, link, heading, combobox) and user-facing names.
4. Bind those live ARIA locators into the corresponding Page Object class constructor in `tests/pages/`.

## 4. Locator Selection Hierarchy (Strict Web-First & ARIA)
Locate elements in the following prioritized order:
1. Role-based: `page.getByRole('button', { name: 'View Question Papers' })`
2. Label-based: `page.getByLabel('Select Video Language')`
3. Text-based (exact or regex): `page.getByText('BEE', { exact: true })`
4. Explicit Class / ID / Test ID: `page.locator('.user-greeting')` or `page.locator('#logout-btn')`

For repeating items in lists or duplicate card links, use `.first()` or `.filter({ hasText: ... })` to avoid strict-mode locator conflicts.

## 5. Learning Hub Domain Rules (v3 Updates)
- Base URL: `http://localhost:8000` configured in `playwright.config.js`.
- `localStorage` Session State: Authentication status is governed by `localStorage.getItem("isLoggedIn") === "true"`. Seeding an authenticated session requires `isLoggedIn: 'true'` alongside profile keys (name, addno, college, university, branch, email, key) via `storageHelper.js`.
- Data Normalization: Email inputs are normalized to lowercase (`.toLowerCase().trim()`), branch codes to uppercase (`.toUpperCase().trim()`), and general text fields trimmed (`.trim()`).
- Dynamic Header Component: The authenticated header renders `<span aria-label="User Profile">Welcome, <strong>Name</strong></span>` and `<a href="#" aria-label="Logout of your account">Logout</a>`.
- Browser Dialog / Alert Handling: Always register `page.on('dialog', async (dialog) => { await dialog.accept(); })` before clicking elements that trigger native popups.
- Third-Party Links: Do NOT navigate to external YouTube or Google Drive URLs. Assert locator `href` and `target="_blank"` attributes instead.

## 6. Page Object Model (POM) Rules
- Spec files (`tests/specs/*.spec.js`) must never contain raw `page.locator()` calls.
- All locators must be initialized inside class constructors using `this.page`.
- Every page class must extend `BasePage.js` and encapsulate UI flows into semantic methods.

## 7. Spec Conventions (tests/specs/)
- Import `test` and `expect` from `tests/fixtures/customFixtures.js`.
- Follow the Arrange-Act-Assert (AAA) pattern.
- Always use auto-retrying web-first assertions (`await expect(locator).toBeVisible()`, `await expect(page).toHaveURL()`).