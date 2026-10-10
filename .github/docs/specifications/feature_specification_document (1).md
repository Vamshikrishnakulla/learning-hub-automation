# Feature Specification Document (FSD) - Learning Hub (Core Codebase v3)

## 1. Document Overview & Product Vision

The **Learning Hub** is a client-side educational repository designed for Computer Science and Engineering (CSE) students. It consolidates university syllabus copies, multi-lingual video playlists (English, Hindi, Telugu), written web tutorials, and handwritten PDF notebooks into a single structured platform.

## 2. System Architecture & Client-Side Data Flow

- **Vanilla Web Technologies:** Built strictly using standard HTML5, CSS3, and ES6+ JavaScript without external frameworks or build tools.

- **Dynamic Component Rendering:** Site-wide navigation (`<nav>`) and footers (`<footer>`) are dynamically injected into `#header-placeholder` and `#footer-placeholder` via `scripts/components.js` upon DOM load.

- **State Management Engine (`localStorage`):**
  - **Identity & Profile Keys:** `name`, `email`, `key` (password), `addno`, `college`, `university`, `branch`.

  - **Session Control Key:** `isLoggedIn` (`"true"` | `"false"`) explicitly tracking active user session state separately from profile registration.

  - **Subject & Navigation Keys:** `subject` (human-readable string), `subjectcode` (numeric integer index), `language` (`"English"`, `"Hindi"`, or `"Telugu"`).

- **Consolidated Course Asset Model:** Course data is structured natively inside `scripts/playlist.js` in the `coursesData` array:

  ```javascript
  {
    id: 0,                           // Mapped to subjectcode in localStorage
    webLink: "https://...",          // Written tutorial reference
    englishVideo: "https://...",     // YouTube English playlist
    hindiVideo: "https://...",       // YouTube Hindi playlist
    teluguVideo: "https://...",      // YouTube Telugu Telugu playlist
    noteBook: "https://..."          // Google Drive PDF notes
  }
  ```

## 3. Module Specifications & Acceptance Criteria

### Module 1: Branch Selection Dashboard (category.html)

- **Supported Branch (CSE):** Selecting the CSE branch card navigates directly to `sub_category_transparent.html`.

- **Unsupported Branches (ECE / EEE / CIVIL):** Selecting non-CSE branch cards executes `e.preventDefault()` and alerts: "Currently, the service is only available for the CSE branch."

- **Hero Banner Carousel:** Hovering over carousel arrow controls (`.top-arrows`) invokes `sel1(k)` to toggle visibility across banner images (`.top-img`).

### Module 2: Subject & Semester Selection (sub_category_transparent.html)

- **Semester Sidebar Headers:** Semester headers feature `role="button"`, `tabindex="0"`, and dynamic `aria-expanded` attributes ("true"/"false") updated by `sel1(k)` in `scripts/sub_category.js`.

- **Subject Selection (`subject()`):** Clicking a subject link sets `localStorage.setItem('subject', sub)` and `localStorage.setItem('subjectcode', k)`, updates `h2.subjectname`, and loads `images/syllabus/[sub]IMAGE.jpg`.

- **Question Paper Toggle (`Q_paper()`):** Clicking `#qpaperbutton` (`aria-label="View Question Papers"`) changes image src to `images/syllabus/qpapers/[sub]paper.jpg`, hides `#qpaperbutton`, and shows `#spaperbutton` (`aria-label="View Syllabus Copy"`).

- **Syllabus Copy Toggle (`subject_change()`):** Clicking `#spaperbutton` reverts image src to syllabus copy, hides `#spaperbutton`, and shows `#qpaperbutton`.

- **Button State Reset:** Selecting a new subject automatically resets button visibility states.

### Module 3: Authentication & Session Management (signup.html, login.html, scripts/auth.js)

- **Input Normalization:**
  - Email: `.trim().toLowerCase()`.

  - Branch: `.trim().toUpperCase()`.

  - Text fields & Password: `.trim()`.

- **Profile Completion vs Authentication:**
  - `isProfileComplete()` verifies all required profile keys exist in `localStorage`.

  - `signup.js` validates via `isProfileComplete()`, saves profile keys, leaves `isLoggedIn` unset/"false", alerts "Registered successfully! Please login now.", and redirects to `login.html`.

  - `login.js` (`checkLogin()`) compares inputs against stored profile keys. Upon match, sets `localStorage.setItem("isLoggedIn", "true")`, alerts "Login success...", and redirects to `category.html`.

- **Header & Logout Integration:**
  - Dynamic header checks `isAuthenticated()` (`isLoggedIn === "true"`).

  - When authenticated, renders user greeting (`.user-greeting`) and logout button (`#logout-btn`).

  - Clicking `#logout-btn` removes `isLoggedIn`, restores SignUp/Login links, and redirects to `category.html` while preserving user profile keys.

### Module 4: Resource Hub & Playlist (playlist.html, scripts/playlist.js)

- **Subject Code Validation Guard:** On DOM initialization, `scripts/playlist.js` parses `subjectcode` via `Number.parseInt(rawCode, 10)`. If invalid (null, NaN, or out-of-bounds), alerts "Please, Choose a valid subject from the catalog." and redirects to `category.html`.

- **Status Text Display:** `#parachange` displays "You have chosen to learn [Subject]" (and includes language when selected).

- **Resource Actions:**
  - **Website Reference (`webCheck()`):** Reads `webLink` from `coursesData[choosedCourse]` and updates `#playlist1` href (`aria-label="Open web reference"`).

  - **Video Playlist (`language(value)`):** Saves language to `localStorage` and updates `#playlist2` href (`aria-label="Start video learning"`).

  - **Notes Download (`notebookcheck()`):** Reads `noteBook` from `coursesData[choosedCourse]` and updates `#playlist3` href (`aria-label="Download notes"`).

  - **Unassigned Links:** If a link is `#`, null, or missing, displays alert "Resource content for this subject is coming soon.".

- **Discussion Room Auth Gate:**
  - Clicking `#discussLink` evaluates `isAuthenticated()` (`isLoggedIn === "true"`).

  - If authenticated, displays active development alert ("This feature is currently under active development.").

  - If unauthenticated, alerts "Please login to access the discussion room." and redirects to `login.html`.

## 4. Technical Quality & Standards Compliance

- **Framework-Free Compliance:** Pure Vanilla HTML5, CSS3, and ES6+ JavaScript.

- **Web-First Accessibility Metadata:** Mandatory inclusion of explicit ARIA roles, labels, and `aria-expanded` state flags across interactive elements.

- **Playwright E2E Test Compatibility:** All interactive controls maintain web-first ARIA roles/labels or explicit IDs to support resilient automated end-to-end testing.
