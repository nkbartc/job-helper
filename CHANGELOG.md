# Changelog

All notable changes to the Job Notes Saver Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

more cicd tests

## [0.4.3] - 2025-08-05

### Added
- **Inline Editing for Notes and Hidden Companies**: Complete in-table editing functionality
  - Click any note in Notes table to edit job application notes
  - Click any reason in Hidden Companies table to edit hiding reasons
  - Real-time editing with textarea input for multi-line content
  - Save/Cancel buttons with visual feedback and keyboard shortcuts
  - Hover effects and visual cues indicating editable fields
  - Auto-focus and text selection for seamless editing experience

### Enhanced
- **Improved User Experience**: Streamlined data management workflow
  - No need to navigate away from tables to edit content
  - Immediate visual feedback during editing process
  - Consistent editing interface across both Notes and Hidden Companies tables
  - Empty fields show helpful placeholder text encouraging user interaction

### Technical Improvements
- **Data Persistence**: Robust localStorage integration for all edits
  - `updateNote()` function in useNotes hook for job note modifications
  - `updateReason()` function in useHiddenCompanies hook for hiding reason updates
  - Automatic data reloading after updates to maintain UI consistency
  - Proper error handling and state management during edit operations

- **Component Architecture Enhancement**:
  - Enhanced NotesTable with inline editing state management
  - Enhanced HiddenCompaniesTable with reason editing capabilities
  - Keyboard navigation support (Enter to save, Escape to cancel)
  - Responsive textarea with resize functionality and minimum height
  - Proper TypeScript interfaces for new callback functions

- **State Management**: Sophisticated editing state tracking
  - Individual edit states per table row to prevent conflicts
  - Clean state reset after save/cancel operations
  - Optimistic UI updates with fallback error handling

## [0.4.2] - 2025-08-05

### Enhanced
- **Delete Note Confirmation**: Improved delete confirmation dialog
  - Replaced browser `confirm()` with custom modal dialog matching Hide Company style
  - Beautiful confirmation modal with "Delete" and "Cancel" buttons
  - Red-colored Delete button to indicate destructive action
  - Keyboard support (Enter to confirm, Escape to cancel)
  - Consistent design with existing custom modal system
  - No text input required - simple yes/no confirmation

- **CSS Architecture Overhaul**: Unified styling system for popup interface
  - Created comprehensive CSS design system with variables and components
  - Migrated from inline styles to CSS classes for better maintainability
  - Improved visual consistency across all components
  - Enhanced scrolling behavior in Help and About sections

- **Enhanced About Section**: Redesigned with interactive elements
  - Added GitHub and Privacy Policy links with hover effects
  - Comprehensive privacy features showcase with checkmarks
  - Professional developer profile display with enhanced styling
  - Interactive link cards with smooth hover animations

- **Improved Help Section**: Better organization and visual hierarchy
  - Fixed scrolling issues with proper container structure
  - Added Pro Tips section with additional usage guidance
  - Enhanced card design with consistent spacing and typography
  - Better mobile responsiveness and layout optimization

### Technical Improvements
- **Custom Modal System Enhancement**:
  - Added `showCustomConfirm()` function to `customModal.js`
  - Promise-based confirmation dialog with boolean return (true/false)
  - Consistent styling and animations with existing modal system
  - Automatic focus management and accessibility improvements
  - Made both `showCustomPrompt` and `showCustomConfirm` globally available

- **CSS System Architecture**:
  - `src/styles/variables.css` - CSS custom properties for colors, spacing, typography
  - `src/styles/components.css` - Reusable component styles and layouts
  - Unified design tokens across all React components
  - Responsive breakpoints and accessibility improvements

- **Component Structure Enhancement**:
  - Proper content wrapper hierarchy for consistent layouts
  - Scrollable content containers with custom scrollbar styling
  - Better focus management and keyboard navigation
  - Improved semantic HTML structure for accessibility

- **UI/UX Consistency**: All confirmation dialogs now use the same design language
  - Hide Company: Custom prompt with text input for reason
  - Delete Note: Custom confirmation with simple yes/no choice
  - Fallback to browser dialogs if custom modals unavailable

## [0.4.1] - 2025-08-05

### Added
- **Toast Notification System**: Modern notification system replacing browser alerts
  - Elegant slide-in animations from top-right corner
  - Color-coded notifications: Success (green), Error (red), Info (blue), Warning (yellow)
  - Auto-dismiss after 3 seconds with smooth fade-out animation
  - Non-intrusive positioning that doesn't interfere with LinkedIn UI

- **Custom Modal Dialog**: Beautiful prompt replacement for Hide Company functionality
  - Modern design with rounded corners, shadows, and smooth animations
  - Centered modal with semi-transparent backdrop
  - Keyboard support (Enter to confirm, Escape to cancel)
  - Input field with focus states and hover effects
  - Responsive design adapting to different screen sizes

- **Help Section**: Comprehensive button guide in React popup
  - New "❓ Help" tab in sidebar navigation
  - Visual icon representations for each button type
  - Clear descriptions of when each button appears and what it does
  - Context badges explaining button availability
  - Pro tips section with usage recommendations

### Enhanced
- **Button Feedback**: All LinkedIn page buttons now show immediate feedback
  - "Add Applied Time" → Success toast: "Applied time added successfully!"
  - "Update Applied Time" → Success toast: "Applied time updated successfully!"
  - "Delete Note" → Success toast: "Note deleted successfully!"
  - "Hide Company" → Custom modal + Success toast: "Company hidden successfully!"
  - "Unhide Company" → Success toast: "Company unhidden successfully!"
  - Error states show red error toasts with helpful messages

### Technical Improvements
- **New Modules**:
  - `toastNotification.js` - Toast system with CSS animations and DOM management
  - `customModal.js` - Promise-based modal dialog system
  - `HelpSection.tsx` - React component with Bootstrap styling

- **Fallback Support**: Maintains backward compatibility with browser alerts if toast system fails
- **Memory Management**: Automatic cleanup of toast containers and modal elements
- **Animation Performance**: CSS transforms and opacity for smooth 60fps animations

## [0.4.0] - 2025-08-05

### Performance Improvements
- **Script Injection Optimization**: Implemented duplicate injection prevention
  - Added injection tracking with Set to prevent multiple script injections
  - Checks for existing scripts before injecting to avoid redundancy
  - Clears tracking when tabs are removed or navigate away from LinkedIn

- **DOM Monitoring Enhancement**: Replaced interval-based polling with MutationObserver
  - Switched from 1000ms/500ms intervals to event-driven MutationObserver
  - Added debouncing (300ms) to prevent excessive processing
  - Implemented incremental updates using WeakSet to track processed elements
  - Batch processing with requestAnimationFrame for better performance

### Fixed
- **Data Consistency Issues**:
  - Fixed `saveNote` function only saving `createdAt` field, now preserves all note data
  - Added proper data structure with all fields (companyName, jobTitle, note, createdAt, updatedAt)
  - Improved data merging in `updateNote` to preserve existing fields

- **Memory Leaks**:
  - Added cleanup handlers in beforeunload event
  - Properly disconnect MutationObservers on page unload
  - Clear global variables and WeakSet references
  - Remove message listeners when page unloads

### Added
- **Error Handling**: Comprehensive error handling across all modules
  - Try-catch blocks for all async operations
  - User-friendly error messages with alerts
  - Proper promise rejection handling
  - Chrome runtime error checking

- **Performance Monitoring**:
  - Console logging for debugging and monitoring
  - Element count tracking for efficient processing
  - Batch processing to avoid blocking main thread

### Technical Improvements
- **Code Quality**:
  - Added proper TypeScript-style error handling patterns
  - Improved DOM safety checks (isConnected, existence validation)
  - Better separation of concerns between modules
  - Consistent async/await patterns

- **Optimization Details**:
  - WeakSet for O(1) element tracking without memory leaks
  - Batch processing in groups of 10 elements
  - Smart DOM observation targeting specific mutations
  - URL change detection via title element observation

## [0.3.1] - 2025-07-23

### Removed
- **Context Menu Permission**: Removed `contextMenus` permission and related functionality
  - Eliminated right-click context menu feature ("Save to Job Notes")
  - Simplified extension permissions for better security and review process
  - Reduced permission requirements for Google Extension Platform submission

### Changed
- **Permission Optimization**: Streamlined extension permissions
  - Removed unused `contextMenus` permission from manifest.json
  - Maintained core functionality with minimal required permissions
  - Improved extension review approval chances

### Technical Improvements
- Cleaned up background script by removing context menu creation code
- Updated manifest files in both `public/` and `build/` directories
- Maintained all existing functionality (notes, company highlighting, hidden companies)

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