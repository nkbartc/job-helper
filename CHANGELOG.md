# Changelog

All notable changes to the Job Notes Saver Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-19

### Added
- Popup UI with React-based interface
- Navigation sidebar with Notes tab
- Notes table displaying all saved job notes
- Delete functionality directly from popup
- Responsive design with Bootstrap styling
- Loading states and empty state handling

### Features
- Click extension icon to open popup panel
- View all saved notes in a table format
- Delete notes directly from the popup
- Real-time data synchronization with storage
- Clean and modern UI design

## [1.0.0] - 2024-12-19

### Added
- Initial Chrome Extension setup with React 18 + TypeScript + Redux + React Bootstrap + React Icons
- Chrome Extension manifest v3 configuration with contextMenus, storage, and activeTab permissions
- Background script for context menu integration ("Save to Job Notes")
- Content script for LinkedIn Jobs page integration
- Company name highlighting functionality for both list and detail pages
- Custom button system (Add Note, Update Note, Delete Note)
- Chrome storage integration with localStorage persistence
- MutationObserver for dynamic content handling
- Modular code structure with separate modules:
  - `storageManager.js` - Storage operations
  - `companyHighlight.js` - Company highlighting logic
  - `customButtons.js` - Custom button management
  - `observerManager.js` - MutationObserver management
  - `contentScript.js` - Main coordination script

### Features
- Right-click context menu on selected text in LinkedIn Jobs pages
- Automatic company name highlighting when notes exist
- Real-time UI updates when switching between job posts
- Persistent storage of job notes with timestamps
- Support for both LinkedIn Jobs list and detail pages
- Responsive button states (Add/Update/Delete) based on note existence

### Technical Implementation
- Chrome Extension Manifest v3 compliance
- ES5-compatible JavaScript (no ES6 modules for Chrome Extension compatibility)
- Promise-based storage operations
- Debounced observer callbacks to prevent infinite loops
- Normalized company name storage (lowercase, trimmed)
- Modular architecture for maintainability

### Supported Pages
- LinkedIn Jobs list pages (`https://www.linkedin.com/jobs/search/*`)
- LinkedIn Jobs detail pages (`https://www.linkedin.com/jobs/view/*`)

### Browser Compatibility
- Chrome 88+ (Manifest v3 support required)

## [Unreleased]

### Planned Features
- Export/Import notes functionality
- Notes search and filtering
- Multiple note categories
- Cloud sync support
- Additional job board integrations

### Technical Improvements
- TypeScript migration
- Unit test coverage
- Performance optimizations
- Enhanced error handling 