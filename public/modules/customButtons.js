// Custom button functionality
if (typeof insertCustomButton === 'undefined') {
  function insertCustomButton(existingNote, companyName) {
    // Check if we're on LinkedIn Jobs search page
    if (!window.location.href.includes('linkedin.com/jobs/search')) {
      return;
    }
    
    const actionBar = document.querySelector('.mt4 > .display-flex');
    if (actionBar) {
      // Always remove all old custom buttons
      actionBar.querySelectorAll('.my-custom-btn').forEach(btn => btn.remove());

      // If the note exists, show the update note button and delete note button
      if (existingNote) {
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update Applied Time';
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
      // If the note does not exist, show the add note button
      else {
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Applied Time';
        addBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
        addBtn.style.marginLeft = '8px';
        addBtn.onclick = () => updateNote(companyName, { createdAt: new Date().toISOString() });
        actionBar.appendChild(addBtn);
      }
    }
  }
} 