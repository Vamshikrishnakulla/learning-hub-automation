# QA Master Test Strategy & Automated Test Case Matrix

## 1. Test Automation Strategy & Scope
The automated test suite is constructed using **Playwright for JavaScript (Node.js)** following a **100% Page Object Model (POM)** pattern, custom storage fixtures (`test.extend()`), and isolated `BrowserContext` origins.

### 1.1 In-Scope for Automation
- Dynamic DOM component injection (`scripts/components.js`).
- Branch selection dashboard routing and alert guards (`category.html`).
- Sidebar semester toggling, subject selection, and Syllabus/Q-Paper view state resets (`sub_category_transparent.html`).
- `localStorage` signup/login authentication checks (`signup.html`, `login.html`, `scripts/auth.js`).
- Unselected subject navigation guards, personalized greetings, multi-lingual video playlist selection, and Discussion Room access locks (`playlist.html`, `scripts/playlist.js`).

### 1.2 Out-of-Scope for Automation
- Third-party YouTube video streaming quality or Google Drive server uptime.
- Non-CSE branch course materials (ECE, EEE, CIVIL).
- Visual layout alignment and responsive hover animations (handled via manual/exploratory testing).

---

## 2. Complete Automated Test Case Matrix (36 Automatable Cases)

### Module 1: Dynamic DOM Component Injection (`scripts/components.js`)
*Spec File: `tests/specs/components.spec.js` | Page Object: `BasePage.js`*

**TC_COMP_001: Verify dynamic injection of Header `<nav>`**
* **Tag:** `[Automated]`
* **Page Object Method:** `basePage.verifyHeaderInjected()`
* **Precondition:** Web server running.
* **Actions:** 1. Navigate to `category.html`. 2. Inspect `#header-placeholder`.
* **Expected Results:** `#header-placeholder` is populated with `<nav>` markup containing logo, links, and search controls.

**TC_COMP_002: Verify dynamic injection of Footer**
* **Tag:** `[Automated]`
* **Page Object Method:** `basePage.verifyFooterInjected()`
* **Precondition:** Web server running.
* **Actions:** 1. Navigate to `about.html`. 2. Inspect `#footer-placeholder`.
* **Expected Results:** `#footer-placeholder` contains copyright, contact email, and social links.

**TC_COMP_003: Test mobile header hamburger menu expand**
* **Tag:** `[Automated]`
* **Page Object Method:** `basePage.toggleNavbarOpen()`
* **Precondition:** Viewport set to mobile width (<750px).
* **Actions:** 1. Click open hamburger button `#logo-div-open`.
* **Expected Results:** `#logo-div-open` is hidden, `#logo-div-close` displays, and `#navdisplay` expands to `display: block`.

**TC_COMP_004: Test mobile header hamburger menu collapse**
* **Tag:** `[Automated]`
* **Page Object Method:** `basePage.toggleNavbarClose()`
* **Precondition:** Mobile header expanded.
* **Actions:** 1. Click close hamburger button `#logo-div-close`.
* **Expected Results:** `#logo-div-close` is hidden, `#logo-div-open` displays, `#navdisplay` collapses, and page reloads.

**TC_COMP_005: Verify navigation bar link routing**
* **Tag:** `[Automated]`
* **Page Object Method:** `basePage.clickNavLink(linkName)`
* **Precondition:** User on `category.html`.
* **Actions:** 1. Click 'Home', 'About', 'ContactUs', 'SignUp', and 'Login' links sequentially.
* **Expected Results:** Each click navigates to `category.html`, `about.html`, `contact.html`, `signup.html`, and `login.html` respectively.

---

### Module 2: Branch Selection Dashboard (`category.html`)
*Spec File: `tests/specs/category.spec.js` | Page Object: `CategoryPage.js`*

**TC_CAT_001: Verify hero carousel image toggling on hover**
* **Tag:** `[Automated]`
* **Page Object Method:** `categoryPage.hoverCarouselArrow(index)`
* **Precondition:** User on `category.html`.
* **Actions:** 1. Hover mouse over right arrow (`sel1(1)`). 2. Hover over left arrow (`sel1(2)`).
* **Expected Results:** Right arrow hover displays `top-image2.jpg` (hiding others). Left arrow hover displays `top-image3.jpg`.

**TC_CAT_002: Verify supported branch selection (CSE)**
* **Tag:** `[Automated]`
* **Page Object Method:** `categoryPage.selectCSEBranch()`
* **Precondition:** User on `category.html`.
* **Actions:** 1. Click on the **CSE** branch card link or image.
* **Expected Results:** Browser navigates directly to `sub_category_transparent.html`.

**TC_CAT_003: Verify unsupported branch selection - ECE**
* **Tag:** `[Automated]`
* **Page Object Method:** `categoryPage.selectECEBranch()`
* **Precondition:** User on `category.html`.
* **Actions:** 1. Click on the **ECE** branch card link or image.
* **Expected Results:** Navigation is prevented (`e.preventDefault()`). Alert displays: `"Currently, the service is only avaliable for the branch CSE..."`.

**TC_CAT_004: Verify unsupported branch selection - EEE**
* **Tag:** `[Automated]`
* **Page Object Method:** `categoryPage.selectEEEBranch()`
* **Precondition:** User on `category.html`.
* **Actions:** 1. Click on the **EEE** branch card link or image.
* **Expected Results:** Navigation is prevented. Alert displays: `"Currently, the service is only avaliable for the branch CSE..."`.

**TC_CAT_005: Verify unsupported branch selection - CIVIL**
* **Tag:** `[Automated]`
* **Page Object Method:** `categoryPage.selectCIVILBranch()`
* **Precondition:** User on `category.html`.
* **Actions:** 1. Click on the **CIVIL** branch card link or image.
* **Expected Results:** Navigation is prevented. Alert displays: `"Currently, the service is only avaliable for the branch CSE..."`.

---

### Module 3: Subject & Semester Selection (`sub_category_transparent.html`)
*Spec File: `tests/specs/sub_category.spec.js` | Page Object: `SubCategoryPage.js`*

**TC_SUB_001: Verify sidebar semester group toggle**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.toggleSemesterGroup(index)`
* **Precondition:** User on `sub_category_transparent.html`.
* **Actions:** 1. Click 'I-I SEM' sidebar header. 2. Click 'I-II SEM' header.
* **Expected Results:** `I-I SEM` list expands (`display: inline-block`). Clicking `I-II SEM` expands I-II and collapses I-I.

**TC_SUB_002: Verify subject selection & `localStorage` persistence**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.selectSubjectByName('BEE')`
* **Precondition:** User on `sub_category_transparent.html`.
* **Actions:** 1. Click 'BEE' subject link. 2. Inspect `localStorage` & UI.
* **Expected Results:** `localStorage` sets `subject = "BEE"` and `subjectcode = "0"`. Main heading updates to `"BEE"`, and image `src` updates to `BEEIMAGE.jpg`.

**TC_SUB_003: Verify Question Papers button toggle**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.clickQuestionPaperButton()`
* **Precondition:** Subject 'BEE' selected.
* **Actions:** 1. Click `#qpaperbutton` ("Question papers").
* **Expected Results:** Image `src` changes to `BEEpaper.jpg`. `#qpaperbutton` is hidden, and `#spaperbutton` ("Syllabus copy") displays.

**TC_SUB_004: Verify Syllabus Copy button toggle**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.clickSyllabusButton()`
* **Precondition:** Question paper view active.
* **Actions:** 1. Click `#spaperbutton` ("Syllabus copy").
* **Expected Results:** Image `src` reverts to `BEEIMAGE.jpg`. `#spaperbutton` is hidden, and `#qpaperbutton` becomes visible.

**TC_SUB_005: Verify button state reset when selecting a new subject**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.selectSubjectByName('M-1')`
* **Precondition:** Question paper view active for 'BEE'.
* **Actions:** 1. Click a different subject link (e.g., 'M-1').
* **Expected Results:** Syllabus image for 'M-1' loads (`M-1IMAGE.jpg`). Button state resets automatically to show `#qpaperbutton` and hide `#spaperbutton`.

**TC_SUB_006: Verify Course Submit redirection**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.submitSelectedSubject()`
* **Precondition:** Subject 'BEE' selected.
* **Actions:** 1. Click 'submit' button at bottom of middle card.
* **Expected Results:** Browser navigates directly to `playlist.html`.

**TC_SUB_007: Test Mobile Sidebar Drawer Toggle**
* **Tag:** `[Automated]`
* **Page Object Method:** `subCategoryPage.toggleMobileSidebar(open)`
* **Precondition:** Viewport width <600px.
* **Actions:** 1. Click `#subject-open` button. 2. Click `#subject-close` button.
* **Expected Results:** Clicking open displays `#card-display` drawer. Clicking close hides `#card-display` drawer.

---

### Module 4: Registration & Authentication (`signup.html`, `login.html`, `scripts/auth.js`)
*Spec File: `tests/specs/auth.spec.js` | Page Object: `AuthPage.js`*

**TC_AUTH_001: Verify `localStorage` population on signup `focusout`**
* **Tag:** `[Automated]`
* **Page Object Method:** `authPage.fillSignupField(fieldName, value)`
* **Precondition:** User on `signup.html`.
* **Actions:** 1. Fill all input fields. 2. Trigger `focusout` on each field.
* **Expected Results:** `localStorage` immediately persists keys: `name`, `addno`, `college`, `university`, `branch`, `email`, and `key`.

**TC_AUTH_002: Test Signup submission with incomplete fields**
* **Tag:** `[Automated]`
* **Page Object Method:** `authPage.submitSignupForm()`
* **Precondition:** `localStorage` missing required keys.
* **Actions:** 1. Leave `College Name` empty. 2. Click 'Submit' button (`#sub`).
* **Expected Results:** Form submission is prevented. Alert displays: `"Please, Fill all the required feilds."`.

**TC_AUTH_003: Test Signup submission with complete profile**
* **Tag:** `[Automated]`
* **Page Object Method:** `authPage.submitSignupForm()`
* **Precondition:** All mandatory fields filled in `localStorage`.
* **Actions:** 1. Ensure all fields populated. 2. Click 'Submit' button.
* **Expected Results:** Button text changes to `"submitting..."` and disables. Alert displays: `"Registered/... sucessfully..."`, and redirects to `login.html`.

**TC_AUTH_004: Test Login with empty/unregistered `localStorage`**
* **Tag:** `[Automated]`
* **Page Object Method:** `authPage.login(email, pass)`
* **Precondition:** `localStorage` contains no `email` or `key`.
* **Actions:** 1. Navigate to `login.html`. 2. Enter email & password. 3. Click 'Submit'.
* **Expected Results:** Alert displays: `"please signup for the website and login again."`. Browser redirects to `signup.html`.

**TC_AUTH_005: Test Login with correct credentials**
* **Tag:** `[Automated]`
* **Page Object Method:** `authPage.login(email, pass)`
* **Precondition:** `localStorage` has `email="user@test.com"` & `key="pass123"`.
* **Actions:** 1. Enter `"user@test.com"` & `"pass123"`. 2. Click 'Submit'.
* **Expected Results:** Alert displays: `"Login success..."`. Browser redirects to `category.html`.

**TC_AUTH_006: Test Login with incorrect password**
* **Tag:** `[Automated]`
* **Page Object Method:** `authPage.login(email, pass)`
* **Precondition:** `localStorage` has valid credentials.
* **Actions:** 1. Enter valid email & wrong password. 2. Click 'Submit'.
* **Expected Results:** Alert displays: `"incorrect details, please enter correct details."`. User remains on `login.html`.

**TC_AUTH_007: Validate `isAuthenticated()` helper return values**
* **Tag:** `[Ad-hoc - Automatable]`
* **Page Object Method:** `storageHelper.evaluateIsAuthenticated(page)`
* **Precondition:** Terminal / Console access.
* **Actions:** 1. Evaluate `isAuthenticated()` when all 5 keys exist. 2. Delete `college` key & re-evaluate.
* **Expected Results:** Returns `true` when all profile keys exist; returns `false` if any key is missing.

---

### Module 5: Resource Hub & Playlist / Language Toggling (`playlist.html`, `scripts/playlist.js`)
*Spec File: `tests/specs/playlist.spec.js` | Page Object: `PlaylistPage.js`*

**TC_PLAY_001: Verify unselected subject Navigation Guard**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.navigateDirectly()`
* **Precondition:** `localStorage` contains no `subjectcode`.
* **Actions:** 1. Navigate directly to `playlist.html`.
* **Expected Results:** Execution halts. Alert displays: `"Please, Choose the subject."`. Browser redirects to `category.html`.

**TC_PLAY_002: Verify personalized user header & course title**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.verifyHeaderGreeting(expectedName)`
* **Precondition:** `localStorage` has `name`, `subject`, `subjectcode`.
* **Actions:** 1. Navigate to `playlist.html`.
* **Expected Results:** `#demo` heading displays user's name. `#parachange` displays chosen course title.

**TC_PLAY_003: Verify Website Reference link lookup**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.clickWebsiteReference()`
* **Precondition:** `subjectcode=0` ('BEE') selected.
* **Actions:** 1. Click 'start learning' under Website Reference (`#webBtn`).
* **Expected Results:** `#playlist1` `href` updates to JavTpoint tutorial URL, `target` set to `"_blank"`.

**TC_PLAY_004: Verify Website Reference alert when link is unassigned (`"#"`)**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.clickWebsiteReference()`
* **Precondition:** `subjectcode=1` (unassigned link) selected.
* **Actions:** 1. Click 'start learning' under Website Reference (`#webBtn`).
* **Expected Results:** Alert displays: `"oops!!!,.. currently no Web-Playlist avaliable..."`. Link does not open.

**TC_PLAY_005: Test Language selection - null option**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.selectLanguage('null')`
* **Precondition:** `subjectcode=0` active.
* **Actions:** 1. Select `"choose language"` (`"null"`) in dropdown `#lan`.
* **Expected Results:** Alert displays: `"Please, choose the language..."`. `localStorage.language` deleted, `#playlist2` `href` resets to `"#"`.

**TC_PLAY_006: Test Language selection - English Video Playlist**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.selectLanguage('English')`
* **Precondition:** `subjectcode=0` active.
* **Actions:** 1. Select `"English"` in dropdown `#lan`.
* **Expected Results:** `localStorage.setItem('language', 'English')`. `#parachange` updates text, `#playlist2` `href` updates to English YouTube playlist.

**TC_PLAY_007: Test Language selection - Hindi / Telugu Video Playlists**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.selectLanguage(lang)`
* **Precondition:** `subjectcode=0` active.
* **Actions:** 1. Select `"Hindi"`. 2. Select `"Telugu"`.
* **Expected Results:** `localStorage.language` updates, status text reflects selected language, and `#playlist2` updates to respective YouTube playlist URLs.

**TC_PLAY_008: Verify Video button click without selecting language**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.clickVideoButton()`
* **Precondition:** Language dropdown set to `"null"`.
* **Actions:** 1. Click 'start learning' under YouTube Playlist (`#videoBtn`).
* **Expected Results:** Alert displays: `"choose the language for video playlist."`.

**TC_PLAY_009: Verify Notes Download link lookup**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.clickNotesDownload()`
* **Precondition:** `subjectcode=0` active.
* **Actions:** 1. Click 'Download' under Notes (`#notesBtn`).
* **Expected Results:** `#playlist3` `href` updates to Google Drive PDF link, `target` set to `"_blank"`.

**TC_PLAY_010: Verify Discussion Room access - Authenticated Session**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.clickDiscussionRoom()`
* **Precondition:** Profile keys exist in `localStorage`.
* **Actions:** 1. Click Discussion Room link (`#discussLink`).
* **Expected Results:** `checkStorageForPlaylist()` passes. Alert displays: `"Hello, sorry!!,.. This is a test feature..."`.

**TC_PLAY_011: Verify Discussion Room access - Unauthenticated Session**
* **Tag:** `[Automated]`
* **Page Object Method:** `playlistPage.clickDiscussionRoom()`
* **Precondition:** Profile keys missing from `localStorage`.
* **Actions:** 1. Clear `localStorage` profile keys. 2. Click Discussion Room link.
* **Expected Results:** `checkStorageForPlaylist()` fails (`isAuthenticated()` returns `false`). Browser redirects immediately to `login.html`.

**TC_PLAY_012: Test corrupted integer `subjectcode` handling**
* **Tag:** `[Ad-hoc - Automatable]`
* **Page Object Method:** `storageHelper.seedCorruptedSubjectCode(page)`
* **Precondition:** `localStorage.setItem('subjectcode', 'invalid')`.
* **Actions:** 1. Navigate to `playlist.html`. 2. Click `#webBtn`.
* **Expected Results:** `parseInt('invalid', 10)` evaluates to `NaN`. Lookup handles missing object gracefully without crashing page JS execution.

## 3. Automation Execution Summary
- **Total Test Cases Mapped:** 36
- **`[Automated]` Core Cases:** 34 (81%) — Primary candidates for parallel execution on GitHub Actions.
- **`[Ad-hoc - Automatable]` Edge Cases:** 2 (5%) — Storage corruption and helper evaluation specs.
