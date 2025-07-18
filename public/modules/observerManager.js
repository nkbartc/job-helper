// MutationObserver management for dynamic content
if (!window.jobNotesSaverGlobalNotes) {
  window.jobNotesSaverGlobalNotes = {};
}
if (!window.jobNotesSaverObserver) {
  window.jobNotesSaverObserver = null;
}

// Prevent function redefinition
if (typeof observeAndHighlight === 'undefined') {
  function observeAndHighlight(notesObj) {
    window.jobNotesSaverGlobalNotes = notesObj;

    if (window.jobNotesSaverObserver) window.jobNotesSaverObserver.disconnect();
    window.jobNotesSaverObserver = new MutationObserver(mutations => {
      window.jobNotesSaverObserver.disconnect();

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
        const note = window.jobNotesSaverGlobalNotes[companyName] || null;
        insertCustomButton(note ? { companyName, ...note } : null, companyName);
      }
      highlightMatchingCompanies(window.jobNotesSaverGlobalNotes);
      window.jobNotesSaverObserver.observe(document.body, { childList: true, subtree: true });
    });

    window.jobNotesSaverObserver.observe(document.body, { childList: true, subtree: true });

    // Initial run
    highlightMatchingCompanies(window.jobNotesSaverGlobalNotes);
    const companyElement = getCompanyElementFromDetailPage();
    const companyName = companyElement?.textContent.trim().toLowerCase();
    const note = window.jobNotesSaverGlobalNotes[companyName] || null;
    insertCustomButton(note ? { companyName, ...note } : null, companyName);
  }
} 