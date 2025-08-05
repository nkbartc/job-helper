// Enhanced observer management with MutationObserver
if (!window.jobNotesSaverGlobalNotes) {
  window.jobNotesSaverGlobalNotes = {};
}
if (!window.jobNotesSaverObserver) {
  window.jobNotesSaverObserver = null;
}
if (!window.jobNotesSaverUrlObserver) {
  window.jobNotesSaverUrlObserver = null;
}
if (!window.jobNotesSaverLastUrl) {
  window.jobNotesSaverLastUrl = '';
}
if (!window.jobNotesSaverProcessedElements) {
  window.jobNotesSaverProcessedElements = new WeakSet();
}

// Debounce utility
if (typeof debounce === 'undefined') {
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Prevent function redefinition
if (typeof observeAndHighlight === 'undefined') {
  function observeAndHighlight(notesObj) {
    window.jobNotesSaverGlobalNotes = notesObj;
    
    // Clean up existing observers
    if (window.jobNotesSaverObserver) {
      window.jobNotesSaverObserver.disconnect();
    }
    if (window.jobNotesSaverUrlObserver) {
      window.jobNotesSaverUrlObserver.disconnect();
    }
    
    // Process new company elements efficiently
    const processNewElements = debounce(() => {
      chrome.storage.local.get(['hiddenCompanies'], (result) => {
        const hiddenCompanies = result.hiddenCompanies || {};
        
        // Find only unprocessed elements
        const allElements = getCompanyElements();
        const newElements = allElements.filter(el => !window.jobNotesSaverProcessedElements.has(el));
        
        if (newElements.length > 0) {
          console.log('Job Notes Saver: Processing', newElements.length, 'new elements');
          highlightMatchingCompanies(window.jobNotesSaverGlobalNotes, newElements, hiddenCompanies);
          
          // Mark as processed
          newElements.forEach(el => window.jobNotesSaverProcessedElements.add(el));
        }
      });
    }, 300); // Debounce for 300ms
    
    // Update custom button when URL changes
    const updateCustomButton = () => {
      const companyElement = getCompanyElementFromDetailPage();
      if (companyElement) {
        const companyName = companyElement.textContent.trim().toLowerCase();
        const note = window.jobNotesSaverGlobalNotes[companyName] || null;
        insertCustomButton(note ? { companyName, ...note } : null, companyName);
      }
    };
    
    // Watch for DOM changes
    window.jobNotesSaverObserver = new MutationObserver((mutations) => {
      // Check if any mutation added new nodes
      const hasNewNodes = mutations.some(mutation => 
        mutation.type === 'childList' && mutation.addedNodes.length > 0
      );
      
      if (hasNewNodes) {
        processNewElements();
      }
    });
    
    // Observe body for changes
    window.jobNotesSaverObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Watch for URL changes using a more efficient approach
    let lastUrl = window.location.href;
    window.jobNotesSaverUrlObserver = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log('Job Notes Saver: URL changed, updating custom button');
        updateCustomButton();
        // Also process elements on URL change
        processNewElements();
      }
    });
    
    // Watch for URL changes
    window.jobNotesSaverUrlObserver.observe(document.querySelector('head > title') || document.head, {
      subtree: true,
      characterData: true,
      childList: true
    });
    
    // Initial run
    chrome.storage.local.get(['hiddenCompanies'], (result) => {
      const hiddenCompanies = result.hiddenCompanies || {};
      highlightMatchingCompanies(window.jobNotesSaverGlobalNotes, null, hiddenCompanies);
      
      // Mark initial elements as processed
      getCompanyElements().forEach(el => window.jobNotesSaverProcessedElements.add(el));
    });
    
    // Initial custom button setup
    updateCustomButton();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (window.jobNotesSaverObserver) {
        window.jobNotesSaverObserver.disconnect();
      }
      if (window.jobNotesSaverUrlObserver) {
        window.jobNotesSaverUrlObserver.disconnect();
      }
    });
  }
}