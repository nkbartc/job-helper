// Main content script - initialization and coordination with memory leak protection

// Mark as injected to prevent duplicate injections
window.jobNotesSaverInjected = true;

// Initialize extension
chrome.storage.local.get(['jobNotes'], (result) => {
  console.log('Job Notes Saver: Initializing with notes:', result.jobNotes);
  const notes = result.jobNotes || {};
  observeAndHighlight(notes);
});

// Listen to new note messages from background
const messageListener = (msg, sender, sendResponse) => {
  if (msg.type === 'ADD_JOB_NOTE' && msg.payload) {
    getNotes().then(notes => {
      chrome.storage.local.get(['hiddenCompanies'], (result) => {
        const hiddenCompanies = result.hiddenCompanies || {};
        highlightMatchingCompanies(notes, null, hiddenCompanies);
      });
    }).catch(error => {
      console.error('Job Notes Saver: Error handling message:', error);
    });
  }
};

chrome.runtime.onMessage.addListener(messageListener);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  // Clean up observers (handled in observerManager.js)
  
  // Remove message listener
  if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.removeListener(messageListener);
  }
  
  // Clear global variables
  if (window.jobNotesSaverGlobalNotes) {
    window.jobNotesSaverGlobalNotes = null;
  }
  if (window.jobNotesSaverProcessedElements) {
    window.jobNotesSaverProcessedElements = null;
  }
  
  console.log('Job Notes Saver: Cleaned up resources on page unload');
});