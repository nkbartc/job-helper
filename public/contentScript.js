// Helper: get all company name elements (list & detail page)
function getCompanyElements() {
  return [
    ...document.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir="ltr"]'), // LinkedIn Jobs list page
    ...document.querySelectorAll('.base-search-card__subtitle'),
    ...document.querySelectorAll('.topcard__org-name-link'),
    ...document.querySelectorAll('.topcard__flavor')
  ];
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
  const noteNames = notes
    .map(n => (n.companyName ? n.companyName.toLowerCase().trim() : null))
    .filter(Boolean);
  companyEls.forEach(el => {
    const company = el.textContent.trim().toLowerCase();
    if (noteNames.includes(company)) {
      console.log('highlighting', company);
      highlightElement(el);
    }
  });
}

function observeAndHighlight(notes) {
  const observer = new MutationObserver(() => {
    highlightMatchingCompanies(notes);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // run once
  highlightMatchingCompanies(notes);
}

// initial highlight with observer
chrome.storage.local.get(['jobNotes'], (result) => {
  const notes = result.jobNotes || [];
  observeAndHighlight(notes);
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