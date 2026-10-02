# Feature Specification Document (FSD) - Learning Hub

## 1. Document Overview & Product Vision
The **Learning Hub** is a client-side educational platform designed for Computer Science and Engineering (CSE) students. It consolidates university syllabus copies, multi-lingual video playlists (English, Hindi, Telugu), written web tutorials, and handwritten PDF notebooks into a single structured interface.

## 2. System Architecture & Client Data Flow
- **Vanilla Tech Stack:** Built using pure HTML5, CSS3, and ES6+ JavaScript without frameworks or bundlers.
- **Dynamic Component Injection:** Site-wide `<nav>` headers and `<footer>` elements are injected into `#header-placeholder` and `#footer-placeholder` containers via `scripts/components.js` upon DOM load.
- **Client State Engine:** Browser `localStorage` acts as the data store:
  - **Identity Keys:** `name`, `email`, `key`, `addno`, `college`, `university`, `branch`.
  - **Navigation Keys:** `subject` (human-readable string), `subjectcode` (numeric index integer), `language` (`"English"`, `"Hindi"`, or `"Telugu"`).
- **Consolidated Data Model:** Course assets are structured natively in `scripts/playlist.js` inside the `coursesData` array:

  ```javascript
  {
      id: 0,                         // Mapped to subjectcode in localStorage
      webLink: "https://...",        // Written tutorial link
      englishVideo: "https://...",   // YouTube English playlist link
      hindiVideo: "https://...",     // YouTube Hindi playlist link
      teluguVideo: "https://...",    // YouTube Telugu playlist link
      noteBook: "https://..."        // Google Drive PDF notes link
  }
  ```

## 3. Module Specifications & Acceptance Criteria

### Module 1: Branch Selection Dashboard (`category.html`)
* **CSE Selection:** Clicking the CSE branch card navigates directly to `sub_category_transparent.html`.
* **Unsupported Branches (ECE / EEE / CIVIL):** Clicking non-CSE branch cards executes `e.preventDefault()` and triggers an alert dialog: `"Currently, the service is only avaliable for the branch CSE and will get updated for other braches, Soon!!..,"`.
* **Hero Carousel Banner:** Hovering over directional arrow buttons (`.top-arrows`) triggers `sel1(k)` to display the corresponding top banner image (`.top-img`).

### Module 2: Subject & Semester Selection (`sub_category_transparent.html`)
* **Subject Selection (`subject()`):** Clicking a subject link (e.g., 'BEE') sets `localStorage.setItem('subject', 'BEE')` and `localStorage.setItem('subjectcode', '0')`, updates heading `h2.subjectname`, and changes syllabus image `src` to `images/syllabus/BEEIMAGE.jpg`.
* **Question Paper Toggle (`Q_paper()`):** Clicking `#qpaperbutton` changes image `src` to `images/syllabus/qpapers/[subject]paper.jpg`, hides `#qpaperbutton`, and shows `#spaperbutton` ("Syllabus copy").
* **Syllabus Copy Toggle (`subject_change()`):** Clicking `#spaperbutton` reverts image `src` to the syllabus copy, hides `#spaperbutton`, and shows `#qpaperbutton`.
* **Button State Reset:** Selecting a new subject automatically invokes `subject_change()` to reset button visibility state (showing `#qpaperbutton` and hiding `#spaperbutton`).

### Module 3: Authentication & User Verification (`signup.html`, `login.html`, `scripts/auth.js`)
* **Signup Population:** Input `focusout` events store field values in `localStorage`. `checkdata()` verifies `name`, `addno`, `email`, `key`, and `college` before form submission.
* **Login Verification (`checkLogin()`):** Compares inputs against `localStorage.getItem("email")` and `localStorage.getItem("key")`.
  * If unregistered, alerts `"please signup for the website and login again."` and redirects to `signup.html`.
  * If correct, alerts `"Login success, you can now access the syllabus."` and redirects to `category.html`.

### Module 4: Resource Hub & Playlist (`playlist.html`, `scripts/playlist.js`)
* **Unselected Subject Guard:** On DOM initialization, if `subjectcode` is `null`/`undefined`, alerts `"Please, Choose the subject."` and redirects to `category.html`.
* **Dynamic Header Greeting:** `#demo` displays `localStorage.getItem("name")` and `#parachange` displays the chosen subject title.
* **Resource Lookups (`webCheck()`, `notebookcheck()`):** Searches `coursesData` using the `subjectcode` index and updates action button `href` and `target="_blank"` attributes.
* **Language Selection (`language(value)`):** Selecting English, Hindi, or Telugu sets `localStorage.setItem('language', value)` and updates `#playlist2` `href` to the corresponding YouTube playlist.
* **Discussion Room Guard (`checkStorageForPlaylist()`):** Clicking `#discussLink` evaluates `isAuthenticated()`.
  * If true, displays test feature alert.
  * If false, redirects immediately to `login.html`.

## 4. Technical Quality & Testing Guidelines
* **Framework-Free:** Strictly standard HTML5, CSS3, ES6+ JS.