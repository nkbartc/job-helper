# Changelog

All notable changes to the Job Notes Saver Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

more cicd tests

## [0.3.0] - 2025-07-21

### Added
- **Hidden Companies Management**: Complete system for hiding unwanted companies from job listings
  - "Hidden Companies" section in popup UI with dedicated navigation tab
  - Hide/Unhide functionality with reason tracking and timestamps
  - Automatic removal of hidden company job listings from LinkedIn Jobs pages
  - Search and filter hidden companies by name or reason
  - Bulk unhide capability from popup interface

- **Enhanced Company Hiding Features**:
  - Hide Company button on job detail pages with reason prompt
  - Dynamic Hide/Unhide button state based on current company status
  - Persistent storage using object-based structure with company metadata
  - Real-time synchronization between LinkedIn pages and popup interface

- **Performance Optimizations**:
  - Replaced complex MutationObserver with interval-based monitoring
  - Smart change detection to prevent unnecessary processing
  - Immediate custom button updates on URL changes (500ms response time)
  - Element processing markers to prevent duplicate operations

### Fixed
- **Stability Issues**:
  - Resolved infinite loops and "shaking" behavior in highlight system
  - Fixed memory usage spikes caused by excessive DOM monitoring
  - Eliminated highlight toggle issues when navigating between pages
  - Corrected custom button delays when switching job detail pages

- **Data Synchronization**:
  - Fixed hidden companies not immediately effective on job search pages
  - Resolved highlight state inconsistencies during page navigation
  - Improved initial data loading and processing reliability

### Changed
- **Storage Architecture**: Migrated hidden companies from array to object-based storage
  - Key: normalized company name (lowercase, trimmed)
  - Value: `{ reason: string, hiddenAt: timestamp }`

- **Observer System**: Complete rewrite of content monitoring
  - Interval-based checking (1000ms for general, 500ms for URL changes)
  - Element count-based change detection for highlight operations
  - URL change detection for immediate custom button updates

- **UI Improvements**:
  - Added company name color styling in notes table
  - Enhanced table headers and column organization
  - Improved popup navigation with 🙈 Hidden Companies icon

### Technical Improvements
- Modular function architecture with redefinition protection
- Normalized company name handling across all operations
- Enhanced error handling and console logging for debugging
- Optimized DOM element selection and processing

## [0.2.1] - 2025-07-21

### Fixed
- Fixed notes table last row being cut off in popup UI
- Improved table container layout with proper scrolling and padding

### Changed
- Enhanced custom button selector specificity (`.mt4 > .display-flex`)
- Added URL validation to only show custom buttons on LinkedIn Jobs search pages
- Improved table container max-height and padding for better visibility

## [0.2.0] - 2025-07-17

### Added
- Popup UI with React-based interface
- Navigation sidebar with Notes tab
- Notes table displaying all saved job notes
- Delete functionality directly from popup
- Responsive design with Bootstrap styling
- Loading states and empty state handling
- About section with author information
- LinkedIn profile link for Bart Chou
- Enhanced navigation with About tab
- Search by company name in Notes section

### Features
- Click extension icon to open popup panel
- View all saved notes in a table format
- Delete notes directly from the popup
- Real-time data synchronization with storage
- Clean and modern UI design

## [0.1.0] - 2025-07-10

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