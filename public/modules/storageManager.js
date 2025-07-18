// Storage operations for job notes
function getNotes() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['jobNotes'], (result) => {
      resolve(result.jobNotes || {});
    });
  });
}

function saveNote(note) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['jobNotes'], (result) => {
      const notes = result.jobNotes || {};
      const normalizedCompanyName = note.companyName.trim().toLowerCase();
      notes[normalizedCompanyName] = { createdAt: note.createdAt };
      chrome.storage.local.set({ jobNotes: notes }, () => {
        resolve(notes);
      });
    });
  });
}

function deleteNote(companyName) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['jobNotes'], (result) => {
      const notes = result.jobNotes || {};
      delete notes[companyName];
      chrome.storage.local.set({ jobNotes: notes }, () => {
        observeAndHighlight(notes);
        resolve(notes);
      });
    });
  });
}

function updateNote(companyName, note) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['jobNotes'], (result) => {
      const notes = result.jobNotes || {};
      notes[companyName] = note;
      chrome.storage.local.set({ jobNotes: notes }, () => {
        observeAndHighlight(notes);
        resolve(notes);
      });
    });
  });
} 