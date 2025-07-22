// Simple observer management
if (!window.jobNotesSaverGlobalNotes) {
  window.jobNotesSaverGlobalNotes = {};
}
if (!window.jobNotesSaverLastElementCount) {
  window.jobNotesSaverLastElementCount = 0;
}
if (!window.jobNotesSaverLastUrl) {
  window.jobNotesSaverLastUrl = '';
}

// Prevent function redefinition
if (typeof observeAndHighlight === 'undefined') {
  function observeAndHighlight(notesObj) {
    window.jobNotesSaverGlobalNotes = notesObj;
    
    // Simple interval-based approach instead of complex MutationObserver
    if (window.jobNotesSaverInterval) {
      clearInterval(window.jobNotesSaverInterval);
    }
    if (window.jobNotesSaverUrlInterval) {
      clearInterval(window.jobNotesSaverUrlInterval);
    }
    
    function runHighlight() {
      // Check if job elements count has changed
      const currentElements = getCompanyElements();
      const currentCount = currentElements.length;
      
      if (currentCount !== window.jobNotesSaverLastElementCount) {
        window.jobNotesSaverLastElementCount = currentCount;
        console.log('Job Notes Saver: Element count changed, running highlight. Count:', currentCount);
        
        chrome.storage.local.get(['hiddenCompanies'], (result) => {
          const hiddenCompanies = result.hiddenCompanies || {};
          highlightMatchingCompanies(window.jobNotesSaverGlobalNotes, null, hiddenCompanies);
        });
      }
      
      // Check if URL has changed (for immediate custom button updates)
      const currentUrl = window.location.href;
      if (currentUrl !== window.jobNotesSaverLastUrl) {
        window.jobNotesSaverLastUrl = currentUrl;
        console.log('Job Notes Saver: URL changed, updating custom button');
        updateCustomButton();
      }
    }
    
    function updateCustomButton() {
      const companyElement = getCompanyElementFromDetailPage();
      if (companyElement) {
        const companyName = companyElement.textContent.trim().toLowerCase();
        const note = window.jobNotesSaverGlobalNotes[companyName] || null;
        insertCustomButton(note ? { companyName, ...note } : null, companyName);
      }
    }
    
    // Initial run
    chrome.storage.local.get(['hiddenCompanies'], (result) => {
      const hiddenCompanies = result.hiddenCompanies || {};
      highlightMatchingCompanies(window.jobNotesSaverGlobalNotes, null, hiddenCompanies);
    });
    
    // Initial custom button setup
    window.jobNotesSaverLastUrl = window.location.href;
    updateCustomButton();
    
    // Check every 2 seconds for changes
    window.jobNotesSaverInterval = setInterval(runHighlight, 1000);
    
    // More frequent URL checking for immediate custom button updates
    window.jobNotesSaverUrlInterval = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== window.jobNotesSaverLastUrl) {
        window.jobNotesSaverLastUrl = currentUrl;
        console.log('Job Notes Saver: URL changed (fast check), updating custom button');
        updateCustomButton();
      }
    }, 500); // Check URL every 500ms for faster response
  }
} 