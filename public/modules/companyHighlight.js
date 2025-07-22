// Company highlighting functionality
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
  }
}

if (typeof highlightMatchingCompanies === 'undefined') {
  function highlightMatchingCompanies(notesObj, elements, hiddenCompaniesObj) {
    if (!notesObj) return;
    
    const notes = Object.entries(notesObj).map(([companyName, value]) => ({
      companyName,
      createdAt: value.createdAt
    }));
    const noteNames = notes.map(n => n.companyName?.toLowerCase().trim()).filter(Boolean);
    const hiddenCompanyNames = hiddenCompaniesObj ? Object.keys(hiddenCompaniesObj) : [];
    
    const elementsToProcess = elements || getCompanyElements();
    
    elementsToProcess.forEach(el => {
      // Safety check - make sure element still exists in DOM
      if (!el || !el.textContent) return;
      
      const company = el.textContent.trim().toLowerCase();
      if (!company) return;
      
      // Check if company is hidden and remove its <li> parent if so
      if (hiddenCompanyNames.includes(company)) {
        const liParent = el.closest('li');
        if (liParent) {
          liParent.remove();
          return; // Skip further processing for this element
        }
      }
      
      // Check if already processed - avoid reprocessing
      if (el.hasAttribute('data-job-notes-processed')) {
        return;
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
    });
  }
}

if (typeof getCompanyElementsFromNode === 'undefined') {
  function getCompanyElementsFromNode(node) {
    // Find all matching elements within this node
    return [
      ...node.matches && node.matches('.artdeco-entity-lockup__subtitle > div[dir=\"ltr\"]') ? [node] : [],
      ...node.querySelectorAll ? [
        ...node.querySelectorAll('.artdeco-entity-lockup__subtitle > div[dir=\"ltr\"]'),
      ] : []
    ];
  }
} 