// Helper: get all company name elements (list & detail page)
function getCompanyElements() {
  return [
    ...document.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir="ltr"]'), // LinkedIn Jobs list page
  ];
}

// Helper: highlight element
function highlightAppliedCompany(el, createdAt) {
  if (el.dataset.highlighted) return; // prevent duplicate highlight
  el.style.backgroundColor = '#d4edda';
  el.style.borderRadius = '4px';
  el.style.padding = '2px 4px';
  el.dataset.highlighted = 'true';
  // add createdAt to the element
  const createdAtEl = document.createElement('span');
  const date = new Date(createdAt); // convert to date object
  const formattedDate = date.toLocaleDateString('en-US', { // format date and time
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  createdAtEl.textContent = `Applied on ${formattedDate}`;
  createdAtEl.style.fontSize = '12px';
  createdAtEl.style.color = '#6c757d';
  createdAtEl.style.marginLeft = '4px';
  el.appendChild(createdAtEl);
}

// highlight company names based on notes
function highlightMatchingCompanies(notes, elements) {
  const noteNames = notes
    .map(n => (n.companyName ? n.companyName.toLowerCase().trim() : null))
    .filter(Boolean);

  (elements || getCompanyElements()).forEach(el => {
    const company = el.textContent.trim().toLowerCase();
    if (noteNames.includes(company)) {
      highlightAppliedCompany(el, notes.find(n => n.companyName?.toLowerCase().trim() === company)?.createdAt);
    }
  });
}

function getCompanyElementsFromNode(node) {
  // Find all matching elements within this node
  return [
    ...node.matches && node.matches('.artdeco-entity-lockup__subtitle > div[dir=\"ltr\"]') ? [node] : [],
    ...node.querySelectorAll ? [
      ...node.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir=\"ltr\"]'),
      ...node.querySelectorAll('.base-search-card__subtitle'),
      ...node.querySelectorAll('.topcard__org-name-link'),
      ...node.querySelectorAll('.topcard__flavor')
    ] : []
  ];
}

function observeAndHighlight(notes) {
  const observer = new MutationObserver(mutations => {
    let newElements = [];
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          newElements = newElements.concat(getCompanyElementsFromNode(node));
        }
      }
    }
    if (newElements.length) {
      highlightMatchingCompanies(notes, newElements);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  highlightMatchingCompanies(notes); // Initial run
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