# Job Notes Saver

A Chrome Extension that helps you save and highlight job-related notes on job boards.

## Features
- Right-click to save selected text as job notes
- Automatic company name highlighting
- Persistent storage with timestamps
- Real-time UI updates
- **NEW**: Popup UI to manage all your notes

## Installation
1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Load the `build` folder as an unpacked extension in Chrome

## Usage
- Navigate to LinkedIn Jobs pages
- Right-click on selected text → "Save to Job Notes"
- Company names will be automatically highlighted
- Use custom buttons to manage notes
- **NEW**: Click the extension icon to open the popup panel and view all your notes

## Popup Features
- **Navigation Sidebar**: Easy navigation between different sections
- **Notes Table**: View all saved notes with company names, creation dates, and notes
- **Delete Functionality**: Remove notes directly from the popup
- **Real-time Updates**: Changes are immediately reflected in the UI
- **Responsive Design**: Clean and modern interface

## Technical Details
- Built with React 18 and Bootstrap 5
- Chrome Extension Manifest v3
- Modular JavaScript architecture
- Chrome Storage API for data persistence