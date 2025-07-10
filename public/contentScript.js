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
  createdAtEl.className = 'my-created-at';
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
function highlightMatchingCompanies(notesObj, elements) {
  const notes = Object.entries(notesObj).map(([companyName, value]) => ({
    companyName,
    createdAt: value.createdAt
  }));
  const noteNames = notes.map(n => n.companyName?.toLowerCase().trim()).filter(Boolean);
  (elements || getCompanyElements()).forEach(el => {
    Array.from(el.querySelectorAll('.my-created-at')).forEach(span => span.remove());
    const company = el.textContent.trim().toLowerCase();
    if (noteNames.includes(company)) {
      const matched = notes.find(n => n.companyName?.toLowerCase().trim() === company);
      highlightAppliedCompany(el, matched?.createdAt);
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

let globalNotes = {};
let observer = null;

function observeAndHighlight(notesObj) {
  globalNotes = notesObj;

  if (observer) observer.disconnect();
  observer = new MutationObserver(mutations => {
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
      const companyName = companyElement?.textContent.trim().toLowerCase();
      const note = globalNotes[companyName] || null;
      insertCustomButton(note ? { companyName, ...note } : null, companyName);
    }
    highlightMatchingCompanies(globalNotes);
    observer.observe(document.body, { childList: true, subtree: true });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // initial run
  highlightMatchingCompanies(globalNotes);
  const companyElement = getCompanyElementFromDetailPage();
  const companyName = companyElement?.textContent.trim().toLowerCase();
  const note = globalNotes[companyName] || null;
  insertCustomButton(note ? { companyName, ...note } : null, companyName);
}

function insertCustomButton(existingNote, companyName) {
  const actionBar = document.querySelector('.mt4 .display-flex');
  if (actionBar) {
    // always remove all old custom buttons
    actionBar.querySelectorAll('.my-custom-btn').forEach(btn => btn.remove());
    // if the note exists, show the update note button and delete note button
    if (existingNote) {
      const updateBtn = document.createElement('button');
      updateBtn.textContent = 'Update Note';
      updateBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      updateBtn.style.marginLeft = '8px';
      updateBtn.onclick = () => updateNote(existingNote.companyName, { createdAt: new Date().toISOString() });
      actionBar.appendChild(updateBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Note';
      deleteBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      deleteBtn.style.marginLeft = '8px';
      deleteBtn.onclick = () => deleteNote(existingNote.companyName);
      actionBar.appendChild(deleteBtn);
    }

    // if the note does not exist, show the add note button
    else {
      const addBtn = document.createElement('button');
      addBtn.textContent = 'Add Note';
      addBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      addBtn.style.marginLeft = '8px';
      addBtn.onclick = () => updateNote(companyName, { createdAt: new Date().toISOString() });
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
  const notes = result.jobNotes || {};
  observeAndHighlight(notes);
});

// listen to new note messages from background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'ADD_JOB_NOTE' && msg.payload) {
    chrome.storage.local.get(['jobNotes'], (result) => {
      const notes = result.jobNotes || {};
      highlightMatchingCompanies(notes);
    });
  }
}); 

function deleteNote(companyName) {
  chrome.storage.local.get(['jobNotes'], (result) => {
    const notes = result.jobNotes || {};
    delete notes[companyName];
    chrome.storage.local.set({ jobNotes: notes }, () => {
      observeAndHighlight(notes);
    });
  });
}

function updateNote(companyName, note) {
  chrome.storage.local.get(['jobNotes'], (result) => {
    const notes = result.jobNotes || {};
    notes[companyName] = note;
    chrome.storage.local.set({ jobNotes: notes }, () => {
      observeAndHighlight(notes);
    });
  });
}