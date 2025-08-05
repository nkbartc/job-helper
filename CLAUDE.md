# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start

# Build extension for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test src/components/Popup.test.tsx
```

## Building Chrome Extension

After running `npm run build`, the extension files are in the `build/` directory. To package for Chrome Web Store:

```bash
cd build
zip -r ../extension.zip . -x '*.map' '*.txt' 'robots.txt'
```

## Architecture Overview

This is a Chrome Extension for LinkedIn job search enhancement, built with:
- **React 19** popup interface with TypeScript
- **Redux Toolkit** for state management
- **Manifest V3** Chrome extension architecture
- **Local storage only** - no external servers

### Key Components

1. **React Popup** (`/src/`): Modern UI for managing notes and hidden companies
   - `components/`: Popup, Sidebar, Tables components
   - `hooks/`: Data management hooks (useNotes, useHiddenCompanies)
   - Redux store manages in-memory state

2. **Content Scripts** (`/public/modules/`): Vanilla JS modules for LinkedIn integration
   - `noteButton.js`: Adds Add/Update/Delete buttons to job pages
   - `highlightCompany.js`: Highlights companies with existing notes
   - `hideCompany.js`: Hides unwanted companies from search results
   - Must be ES5-compatible for browser support

3. **Background Script** (`/public/background.js`): Manages tab updates and script injection

### Data Storage

All data stored locally in Chrome storage:
- Notes: `{ companyName, jobTitle, note, noteDate, noteTime }`
- Hidden Companies: `{ companyName, reason, hiddenDate, hiddenTime }`

### LinkedIn Integration

Extension activates on `https://www.linkedin.com/jobs/*` pages:
- Injects custom buttons on job detail pages
- Monitors DOM changes with MutationObserver
- Updates every 500ms for responsive highlighting

## Testing

Uses React Testing Library with Jest. Default test structure:
- Component tests in same directory as components
- Mock Chrome APIs when testing extension features
- Run `npm test` for interactive watch mode

## Deployment

GitHub Actions workflow deploys to Chrome Web Store on push to main:
1. Builds React app
2. Creates extension zip
3. Uploads to Chrome Web Store (currently disabled for testing)

Requires secrets: `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`, `EXTENSION_ID`

## Important Notes

- **No ESLint/Prettier config** - uses default Create React App settings
- **Chrome 88+ required** for Manifest V3 support
- **Privacy-focused**: All data stored locally, no external API calls
- Content scripts use vanilla JavaScript (ES5) for compatibility
- React app uses modern TypeScript/JSX