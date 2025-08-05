// Company highlighting functionality with incremental updates
if (typeof getCompanyElements === 'undefined') {
  function getCompanyElements() {
    return [
      ...document.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir="ltr"]'), // LinkedIn Jobs list page
    ];
  }
}

if (typeof getCompanyElementFromDetailPage === 'undefined') {
  function getCompanyElementFromDetailPage() {
    // if there's a link, return the link
    const el = document.querySelector('.job-details-jobs-unified-top-card__company-name > a');
    if (el) return el;
    // if there's no link, return the div itself
    return document.querySelector('.job-details-jobs-unified-top-card__company-name');
  }
}

if (typeof highlightAppliedCompany === 'undefined') {
  function highlightAppliedCompany(el, createdAt) {
    try {
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
      el.appendChild(createdAtEl);
    } catch (error) {
      console.error('Job Notes Saver: Error highlighting company:', error);
    }
  }
}

if (typeof highlightMatchingCompanies === 'undefined') {
  function highlightMatchingCompanies(notesObj, elements, hiddenCompaniesObj) {
    if (!notesObj) return;
    
    try {
      const notes = Object.entries(notesObj).map(([companyName, value]) => ({
        companyName,
        createdAt: value.createdAt
      }));
      const noteNames = notes.map(n => n.companyName?.toLowerCase().trim()).filter(Boolean);
      const hiddenCompanyNames = hiddenCompaniesObj ? Object.keys(hiddenCompaniesObj) : [];
      
      // Use provided elements or get all elements
      const elementsToProcess = elements || getCompanyElements();
      
      // Process elements in batches to avoid blocking the main thread
      const batchSize = 10;
      let index = 0;
      
      function processBatch() {
        const endIndex = Math.min(index + batchSize, elementsToProcess.length);
        
        for (let i = index; i < endIndex; i++) {
          const el = elementsToProcess[i];
          
          // Safety check - make sure element still exists in DOM
          if (!el || !el.textContent || !el.isConnected) continue;
          
          const company = el.textContent.trim().toLowerCase();
          if (!company) continue;
          
          // Check if company is hidden and remove its <li> parent if so
          if (hiddenCompanyNames.includes(company)) {
            const liParent = el.closest('li');
            if (liParent && liParent.isConnected) {
              liParent.remove();
              continue; // Skip further processing for this element
            }
          }
          
          // Check if already processed - avoid reprocessing
          if (el.hasAttribute('data-job-notes-processed')) {
            // Check if the highlight is still valid
            const existingHighlight = el.querySelector('.my-created-at');
            if (existingHighlight && noteNames.includes(company)) {
              continue; // Already processed and still valid
            }
          }
          
          // Mark as processed
          el.setAttribute('data-job-notes-processed', 'true');
          
          // Remove old createdAt elements first
          Array.from(el.querySelectorAll('.my-created-at')).forEach(span => span.remove());
          
          // Highlight if company has notes
          if (noteNames.includes(company)) {
            const matched = notes.find(n => n.companyName?.toLowerCase().trim() === company);
            if (matched?.createdAt) {
              highlightAppliedCompany(el, matched.createdAt);
            }
          }
        }
        
        index = endIndex;
        
        // Process next batch if there are more elements
        if (index < elementsToProcess.length) {
          requestAnimationFrame(processBatch);
        }
      }
      
      // Start processing
      processBatch();
    } catch (error) {
      console.error('Job Notes Saver: Error in highlightMatchingCompanies:', error);
    }
  }
}

if (typeof getCompanyElementsFromNode === 'undefined') {
  function getCompanyElementsFromNode(node) {
    try {
      // Find all matching elements within this node
      const elements = [];
      
      // Check if the node itself matches
      if (node.matches && node.matches('.artdeco-entity-lockup__subtitle > div[dir="ltr"]')) {
        elements.push(node);
      }
      
      // Find matching children
      if (node.querySelectorAll) {
        elements.push(...node.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir="ltr"]'));
      }
      
      return elements;
    } catch (error) {
      console.error('Job Notes Saver: Error getting company elements from node:', error);
      return [];
    }
  }
}