// Storage operations for job notes with improved data consistency
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
  function saveNote(noteData) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['jobNotes'], (result) => {
          const notes = result.jobNotes || {};
          const normalizedCompanyName = noteData.companyName.trim().toLowerCase();
          
          // Preserve all note data
          notes[normalizedCompanyName] = {
            companyName: noteData.companyName,
            jobTitle: noteData.jobTitle || '',
            note: noteData.note || '',
            createdAt: noteData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          chrome.storage.local.set({ jobNotes: notes }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(notes);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

if (typeof deleteNote === 'undefined') {
  function deleteNote(companyName) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['jobNotes'], (result) => {
          const notes = result.jobNotes || {};
          const normalizedCompanyName = companyName.trim().toLowerCase();
          delete notes[normalizedCompanyName];
          
          chrome.storage.local.set({ jobNotes: notes }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              // Notify content script to update highlights
              if (typeof observeAndHighlight !== 'undefined') {
                observeAndHighlight(notes);
              }
              resolve(notes);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

if (typeof updateNote === 'undefined') {
  function updateNote(companyName, noteData) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['jobNotes'], (result) => {
          const notes = result.jobNotes || {};
          const normalizedCompanyName = companyName.trim().toLowerCase();
          
          // Merge with existing data
          const existingNote = notes[normalizedCompanyName] || {};
          notes[normalizedCompanyName] = {
            ...existingNote,
            ...noteData,
            updatedAt: new Date().toISOString()
          };
          
          chrome.storage.local.set({ jobNotes: notes }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              // Notify content script to update highlights
              if (typeof observeAndHighlight !== 'undefined') {
                observeAndHighlight(notes);
              }
              resolve(notes);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

if (typeof hideCompany === 'undefined') {
  function hideCompany(companyName, reason = 'No reason provided') {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['hiddenCompanies'], (result) => {
          const hiddenCompanies = result.hiddenCompanies || {};
          const normalizedCompanyName = companyName.trim().toLowerCase();
          
          hiddenCompanies[normalizedCompanyName] = {
            companyName: companyName,
            reason: reason,
            hiddenAt: new Date().toISOString()
          };
          
          chrome.storage.local.set({ hiddenCompanies }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(hiddenCompanies);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
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
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['hiddenCompanies'], (result) => {
          const hiddenCompanies = result.hiddenCompanies || {};
          const normalizedCompanyName = companyName.trim().toLowerCase();
          delete hiddenCompanies[normalizedCompanyName];
          
          chrome.storage.local.set({ hiddenCompanies }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(hiddenCompanies);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}