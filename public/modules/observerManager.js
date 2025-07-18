// MutationObserver management for dynamic content
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

  // Initial run
  highlightMatchingCompanies(globalNotes);
  const companyElement = getCompanyElementFromDetailPage();
  const companyName = companyElement?.textContent.trim().toLowerCase();
  const note = globalNotes[companyName] || null;
  insertCustomButton(note ? { companyName, ...note } : null, companyName);
} 