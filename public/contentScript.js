// Main content script - initialization and coordination

// Initialize extension
chrome.storage.local.get(['jobNotes'], (result) => {
  console.log('Job Notes Saver: Initializing with notes:', result.jobNotes);
  const notes = result.jobNotes || {};
  observeAndHighlight(notes);
});

// Listen to new note messages from background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ADD_JOB_NOTE' && msg.payload) {
    getNotes().then(notes => {
      chrome.storage.local.get(['hiddenCompanies'], (result) => {
        const hiddenCompanies = result.hiddenCompanies || {};
        highlightMatchingCompanies(notes, null, hiddenCompanies);
      });
    });
  }
});