// Helper: get all company name elements (list & detail page)
function getCompanyElements() {
  return [
    ...document.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir="ltr"]'), // LinkedIn Jobs list page
  ];
}

// Helper: get company name element from detail page
function getCompanyElementFromDetailPage() {
  // if there's a link, return the link
  const el = document.querySelector('.job-details-jobs-unified-top-card__company-name > a');
  if (el) return el;
  // if there's no link, return the div itself
  return document.querySelector('.job-details-jobs-unified-top-card__company-name');
}

// Helper: highlight element
function highlightAppliedCompany(el, createdAt) {
  const createdAtEl = document.createElement('span');
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  createdAtEl.textContent = `Applied on ${formattedDate}`;
  createdAtEl.style.fontSize = '1.4rem';
  createdAtEl.style.color = 'red';
  createdAtEl.style.display = 'block';
  createdAtEl.style.width = 'fit-content';
  createdAtEl.style.marginTop = '2px';
  createdAtEl.style.fontWeight = 'bold';
  // createdAtEl.style.backgroundColor = '#d4edda';
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
      const existingNote = notes.find(n => n.companyName?.toLowerCase().trim() === company);
      highlightAppliedCompany(el, existingNote.createdAt);
    }
  });
}

function getCompanyElementsFromNode(node) {
  // Find all matching elements within this node
  return [
    ...node.matches && node.matches('.artdeco-entity-lockup__subtitle > div[dir=\"ltr\"]') ? [node] : [],
    ...node.querySelectorAll ? [
      ...node.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir=\"ltr\"]'),
      // ...node.querySelectorAll('.base-search-card__subtitle'),
      // ...node.querySelectorAll('.topcard__org-name-link'),
      // ...node.querySelectorAll('.topcard__flavor')
    ] : []
  ];
}

function observeAndHighlight(notes) {
  const observer = new MutationObserver(mutations => {
    observer.disconnect();
    let shouldInsertButton = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.matches && node.matches('.mt4 .display-flex')) {
            shouldInsertButton = true;
          }
          if (node.querySelector && node.querySelector('.mt4 .display-flex')) {
            shouldInsertButton = true;
          }
        }
      }
    }

    if (shouldInsertButton) {
      const companyElement = getCompanyElementFromDetailPage();
      const existingNote = notes.find(
        n =>
          n.companyName?.toLowerCase().trim() ===
          companyElement?.textContent.trim().toLowerCase()
      );
      insertCustomButton(existingNote);
    }

    highlightMatchingCompanies(notes);

    observer.observe(document.body, { childList: true, subtree: true });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // initial run
  highlightMatchingCompanies(notes);
  const companyElement = getCompanyElementFromDetailPage();
  const existingNote = notes.find(
    n =>
      n.companyName?.toLowerCase().trim() ===
      companyElement?.textContent.trim().toLowerCase()
  );
  insertCustomButton(existingNote);
}

function insertCustomButton(existingNote) {
  const actionBar = document.querySelector('.mt4 .display-flex');
  if (actionBar) {
    // always remove all old custom buttons
    actionBar.querySelectorAll('.my-custom-btn').forEach(btn => btn.remove());
    // if the note exists, show the update note button and delete note button
    if (existingNote) {
      const updateBtn = document.createElement('button');
      updateBtn.textContent = 'Update';
      updateBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      updateBtn.style.marginLeft = '8px';
      updateBtn.onclick = () => alert('Clicked!');
      actionBar.appendChild(updateBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      deleteBtn.style.marginLeft = '8px';
      deleteBtn.onclick = () => alert('Clicked!');
      actionBar.appendChild(deleteBtn);
    }

    // if the note does not exist, show the add note button
    else {
      const addBtn = document.createElement('button');
      addBtn.textContent = 'Add Note';
      addBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      addBtn.style.marginLeft = '8px';
      addBtn.onclick = () => alert('Clicked!');
      actionBar.appendChild(addBtn);
    }

    // const myBtn = document.createElement('button');
    // myBtn.textContent = 'My Custom Action';
    // myBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
    // myBtn.style.marginLeft = '8px';
    // myBtn.onclick = () => alert('Clicked!');
    // actionBar.appendChild(myBtn);
  }
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