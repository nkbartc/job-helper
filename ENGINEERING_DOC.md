# Chrome Extension: LinkedIn Job Notes Saver

## Overview

This Chrome Extension empowers users to efficiently collect and manage job-related notes directly from LinkedIn Jobs. By right-clicking on selected text within https://www.linkedin.com/jobs/* pages, users can save important information to both browser localStorage and the extension’s Redux store. The extension also highlights company names on the page that match any saved notes, streamlining the job search and tracking process.

---

## Goals

1. **Page Activation**  
   The extension is only active on pages matching the pattern:  
   `https://www.linkedin.com/jobs/*`

2. **Context Menu Integration**  
   Adds a custom context menu item ("Save to Job Notes") when the user right-clicks on any selected text within the target pages.

3. **Data Persistence**  
   When the context menu item is selected:
   - The highlighted string is saved to browser localStorage.
   - The same string is also dispatched to the extension’s Redux store for state management.

4. **Company Name Highlighting**  
   - On every page load or Redux state update, the extension scans the current LinkedIn Jobs page for company names.
   - If a company name on the page matches any entry in the Redux store, it is visually highlighted using inline styles (e.g., background color).

---

## Technical Approach

### 1. **Manifest Configuration**
- Use `manifest_version: 3`.
- Set permissions for `contextMenus`, `storage`, and `activeTab`.
- Restrict content scripts to `https://www.linkedin.com/jobs/*`.

### 2. **Context Menu**
- Register a context menu item on extension initialization.
- Use the `contextMenus` API to detect right-clicks on selected text.
- On click, retrieve the selected text and save it to both localStorage and Redux.

### 3. **Data Storage**
- Use `chrome.storage.local` for persistent storage.
- Use Redux (with Redux Toolkit) for in-memory state management and UI reactivity.

### 4. **Content Script**
- Inject a content script into matching pages.
- On page load and on Redux state changes, scan the DOM for company names.
- If a company name matches any saved note, apply an inline highlight style.

### 5. **Redux Integration**
- Use Redux for state management within the extension (e.g., via a background script or popup).
- Sync Redux state with localStorage for persistence.

---

## Example User Flow

1. User navigates to a LinkedIn Jobs listing.
2. User highlights a company name or job detail, right-clicks, and selects "Save to Job Notes".
3. The selected text is saved to both localStorage and Redux.
4. On subsequent visits, any company name on the page that matches a saved note is automatically highlighted.

---

## Future Enhancements

- Add a popup or options page to view, edit, or delete saved notes.
- Sync notes across devices using Chrome sync storage.
- Support additional job boards.

--- 