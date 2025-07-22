// Storage operations for job notes
if (typeof getNotes === 'undefined') {
  function getNotes() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['jobNotes'], (result) => {
        resolve(result.jobNotes || {});
      });
    });
  }
}

if (typeof saveNote === 'undefined') {
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
}

if (typeof deleteNote === 'undefined') {
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
}

if (typeof updateNote === 'undefined') {
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
}

if (typeof hideCompany === 'undefined') {
  function hideCompany(companyName, reason = 'No reason provided') {
    return new Promise((resolve) => {
      chrome.storage.local.get(['hiddenCompanies'], (result) => {
        const hiddenCompanies = result.hiddenCompanies || {};
        const normalizedCompanyName = companyName.trim().toLowerCase();
        hiddenCompanies[normalizedCompanyName] = {
          reason: reason,
          hiddenAt: new Date().toISOString()
        };
        chrome.storage.local.set({ hiddenCompanies }, () => {
          resolve(hiddenCompanies);
        });
      });
    });
  }
}

if (typeof isCompanyHidden === 'undefined') {
  function isCompanyHidden(companyName) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['hiddenCompanies'], (result) => {
        const hiddenCompanies = result.hiddenCompanies || {};
        const normalizedCompanyName = companyName.trim().toLowerCase();
        resolve(!!hiddenCompanies[normalizedCompanyName]);
      });
    });
  }
}

if (typeof unhideCompany === 'undefined') {
  function unhideCompany(companyName) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['hiddenCompanies'], (result) => {
        const hiddenCompanies = result.hiddenCompanies || {};
        const normalizedCompanyName = companyName.trim().toLowerCase();
        delete hiddenCompanies[normalizedCompanyName];
        chrome.storage.local.set({ hiddenCompanies }, () => {
          resolve(hiddenCompanies);
        });
      });
    });
  }
}