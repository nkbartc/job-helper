// Helper: get all company name elements
function getCompanyElements() {
  return Array.from(document.querySelectorAll('.base-search-card__subtitle'));
}

// Helper: highlight element
function highlightElement(el) {
  el.style.backgroundColor = '#fff3cd';
  el.style.borderRadius = '4px';
  el.style.padding = '2px 4px';
}

// highlight company names based on notes
function highlightMatchingCompanies(notes) {
  const companyEls = getCompanyElements();
  const noteTexts = notes.map(n => n.companyName.trim().toLowerCase());
  companyEls.forEach(el => {
    const company = el.textContent.trim().toLowerCase();
    if (noteTexts.includes(company)) {
      highlightElement(el);
    }
  });
}

// initial highlight
chrome.storage.local.get(['jobNotes'], (result) => {
  const notes = result.jobNotes || [];
  highlightMatchingCompanies(notes);
});

// listen to new note messages from background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ADD_JOB_NOTE' && msg.payload) {
    chrome.storage.local.get(['jobNotes'], (result) => {
      const notes = result.jobNotes || [];
      highlightMatchingCompanies(notes);
    });
  }
}); 