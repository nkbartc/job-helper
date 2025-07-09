chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToJobNotes',
    title: 'Save to Job Notes',
    contexts: ['selection'],
    documentUrlPatterns: ['https://www.linkedin.com/jobs/*'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToJobNotes' && info.selectionText) {
    const note = {
      id: Date.now().toString(),
      companyName: info.selectionText,
      createdAt: new Date().toISOString(),
    };
    // Save to chrome.storage.local
    chrome.storage.local.get(['jobNotes'], (result) => {
      const notes = result.jobNotes || [];
      notes.push(note);
      chrome.storage.local.set({ jobNotes: notes });
    });
    // Send message to content script or Redux (handled later)
    chrome.tabs.sendMessage(tab.id, { type: 'ADD_JOB_NOTE', payload: note });
  }
}); 