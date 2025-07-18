// Main content script - initialization and coordination

// Initialize extension
chrome.storage.local.get(['jobNotes'], (result) => {
  const notes = result.jobNotes || {};
  observeAndHighlight(notes);
});

// Listen to new note messages from background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ADD_JOB_NOTE' && msg.payload) {
    getNotes().then(notes => {
      highlightMatchingCompanies(notes);
    });
  }
});