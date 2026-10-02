# Learning Hub Automation Workspace

This workspace contains the Playwright-based black-box test automation suite for the Learning Hub application. The application itself is served from the live frontend environment at `http://localhost:8000`, while this workspace focuses on automation, page-object modeling, state seeding, and regression validation.

## Project Purpose

The goal of this automation suite is to validate the client-side behavior of the Learning Hub web app without relying on frontend source code in this workspace. The suite exercises the live application in a browser and verifies the core user journeys:

- dynamic header/footer injection
- branch selection and restricted access rules
- subject and semester selection
- signup and login behavior using `localStorage`
- playlist language switching and resource linkage
- discussion-room access guards

This is a POM-first, fixture-driven Playwright project designed around the constraints in the project guidance and QA strategy.

## Workspace Structure

```text
LearningHubAutomation/
├── .github/
│   ├── copilot-instructions.md
│   └── docs/
│       ├── automation-audit-report.md
│       ├── specifications/
│       │   └── learning-hub-spec.md
│       └── test-strategy.md
├── specs/
│   
├── tests/
│   ├── data/
│   │   └── userProfiles.json
│   ├── fixtures/
│   │   └── customFixtures.js
│   ├── pages/
│   │   ├── AuthPage.js
│   │   ├── BasePage.js
│   │   ├── CategoryPage.js
│   │   ├── PlaylistPage.js
│   │   └── SubCategoryPage.js
│   ├── specs/
│   │   ├── auth.spec.js
│   │   ├── category.spec.js
│   │   ├── components.spec.js
│   │   ├── playlist.spec.js
│   │   └── sub_category.spec.js
│   └── utils/
│       └── storageHelper.js
├── node_modules/
├── package.json
├── playwright.config.js
├── README.md
├── playwright-report/
├── test-results/
├── .vscode/
└── .git/
```

## Key Automation Principles

### 1. Black-box test strategy
The application under test is live and external to this workspace. Test scripts do not rely on direct DOM source inspection from the frontend repository. Instead, all selector decisions are driven by actual Playwright runtime inspection of the browser accessibility tree and the live page behavior.

### 2. Page Object Model first
All site behaviors are encapsulated in page objects under `tests/pages/`.

Examples:
- `BasePage` handles common injected header/footer logic and nav behavior
- `CategoryPage` handles branch cards and branch restrictions
- `SubCategoryPage` handles semester toggles and subject state logic
- `AuthPage` handles signup and login flows
- `PlaylistPage` handles user greeting, language switching, and discussion-room checks

### 3. Fixture-driven setup
The suite uses Playwright custom fixtures from `tests/fixtures/customFixtures.js` to provide page objects and pre-seed browser state before navigation. This keeps tests DRY and avoids repeated inline localStorage setup and object instantiation.

### 4. Storage state isolation
The app uses browser `localStorage` to persist profile and course state. Storage setup is centralized in `tests/utils/storageHelper.js` so the suite can seed valid users and subject selections without brittle manual setup in each spec.

## Test Coverage Snapshot

The suite covers the primary acceptance matrix defined in the QA strategy and feature specification documents. The implemented spec files are:

- `tests/specs/components.spec.js`
- `tests/specs/category.spec.js`
- `tests/specs/sub_category.spec.js`
- `tests/specs/auth.spec.js`
- `tests/specs/playlist.spec.js`

These files collectively cover the core modules:

- component injection and header/footer verification
- category and branch restrictions
- subject and syllabus button behavior
- signup/login validation
- playlist page guard logic and language switching
- discussion room redirect behavior

## Setup and Execution

### Prerequisites

- Node.js 18+
- Playwright package installed from the project dependencies
- Local Learning Hub site running at `http://localhost:8000`

### Install dependencies

```bash
npm install
```

### Run the full suite

```bash
npx playwright test
```

### Run a single spec file

```bash
npx playwright test tests/specs/components.spec.js
```

### Run with UI mode

```bash
npx playwright test --ui
```

### Run headed mode

```bash
npx playwright test --headed
```

## Project Files by Purpose

### Page Objects

- `tests/pages/BasePage.js`
  - shared layout checks
  - nav/link actions
  - mobile menu toggling

- `tests/pages/CategoryPage.js`
  - branch card interactions
  - alert-handling path for unsupported branches

- `tests/pages/SubCategoryPage.js`
  - semester groups and subject selection
  - Q-paper vs syllabus toggle
  - submit flow to playlist

- `tests/pages/AuthPage.js`
  - signup form population and submit logic
  - login form interaction

- `tests/pages/PlaylistPage.js`
  - greeting and status verification
  - language selection and playlist link checks
  - discussion-room access behaviors

### Storage and Data

- `tests/utils/storageHelper.js`
  - `seedUserProfile(page, profileObject)`
  - `seedSubjectState(page, subjectName, subjectCode)`
  - `clearStorage(page)`
  - `evaluateIsAuthenticated(page)`

- `tests/data/userProfiles.json`
  - mock valid and incomplete profile payloads for auth validation

### Fixtures

- `tests/fixtures/customFixtures.js`
  - custom `test.extend()` fixtures for `basePage`, `categoryPage`, `subCategoryPage`, `authPage`, and `authenticatedPlaylistPage`
  - injects seeded state before navigation to the relevant pages

## LocalStorage Contract

The app uses a few key browser-state values that the tests depend on:

- identity: `name`, `addno`, `college`, `university`, `branch`, `email`, `key`
- subject: `subject`, `subjectcode`
- language: `language`

The tests intentionally avoid manual duplicate logic by reusing the helper layer.

## Test Execution Notes

- Use web-first assertions (`await expect(...)`) whenever possible.
- Handle native browser alerts using `page.on('dialog', ...)` before triggering protected actions.
- Prefer POM API methods over direct DOM queries in spec files.
- Avoid hard-coded sleeps; wait for actual UI state or element visibility changes.

## Automation Quality Goals

This suite aims to provide:

- stable regression protection for the Learning Hub user journeys
- consistent cross-page state handling via fixtures and localStorage helpers
- explicit coverage of browser-native dialogs and guard flows
- maintainable, business-readable test scenarios aligned to the spec documents

## Known Considerations

This project is intentionally structured as a black-box automation suite. Because the frontend source is not part of this workspace, the suite depends on:

- runtime inspection of the live app by Playwright
- documented product behavior from the QA strategy and feature specification files
- fixture-based state management instead of source-code coupling

This means the automation can catch real regressions in the live frontend while staying decoupled from the app implementation details in Workspace A.

## Recommended Workflow

1. Start the application locally at `http://localhost:8000`.
2. Run targeted specs during development.
3. Update POM actions when the live app behavior changes.
4. Reuse the storage helper instead of duplicating session setup.
5. Keep tests aligned with the acceptance matrix and avoid raw DOM usage in spec files.

## Summary

This workspace is the test automation layer for the Learning Hub application. It protects the critical user flows with a maintainable, modular Playwright suite built on POM patterns, custom fixtures, and localStorage-backed state setup.
