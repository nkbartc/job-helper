// Custom button functionality with improved error handling
if (typeof insertCustomButton === 'undefined') {
  function insertCustomButton(existingNote, companyName) {
    try {
      // Check if we're on LinkedIn Jobs search page
      if (!window.location.href.includes('linkedin.com/jobs/search')) {
        return;
      }
      
      const actionBar = document.querySelector('.mt4 > .display-flex');
      if (!actionBar) {
        console.log('Job Notes Saver: Action bar not found');
        return;
      }
      
      // Always remove all old custom buttons
      actionBar.querySelectorAll('.my-custom-btn').forEach(btn => btn.remove());

      // If the note exists, show the update note button and delete note button
      if (existingNote) {
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update Applied Time';
        updateBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
        updateBtn.style.marginLeft = '8px';
        updateBtn.onclick = async () => {
          try {
            await updateNote(existingNote.companyName, { createdAt: new Date().toISOString() });
            console.log('Job Notes Saver: Note updated successfully');
          } catch (error) {
            console.error('Job Notes Saver: Error updating note:', error);
            alert('Failed to update note. Please try again.');
          }
        };
        actionBar.appendChild(updateBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Note';
        deleteBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
        deleteBtn.style.marginLeft = '8px';
        deleteBtn.onclick = async () => {
          try {
            if (confirm('Are you sure you want to delete this note?')) {
              await deleteNote(existingNote.companyName);
              console.log('Job Notes Saver: Note deleted successfully');
            }
          } catch (error) {
            console.error('Job Notes Saver: Error deleting note:', error);
            alert('Failed to delete note. Please try again.');
          }
        };
        actionBar.appendChild(deleteBtn);
      }
      // If the note does not exist, show the add note button
      else {
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Applied Time';
        addBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
        addBtn.style.marginLeft = '8px';
        addBtn.onclick = async () => {
          try {
            await updateNote(companyName, { createdAt: new Date().toISOString() });
            console.log('Job Notes Saver: Note added successfully');
          } catch (error) {
            console.error('Job Notes Saver: Error adding note:', error);
            alert('Failed to add note. Please try again.');
          }
        };
        actionBar.appendChild(addBtn);
      }

      // Add a button to hide/unhide the company
      const hideBtn = document.createElement('button');
      hideBtn.className = 'my-custom-btn artdeco-button artdeco-button--secondary';
      hideBtn.style.marginLeft = '8px';
      
      // Function to set up hide functionality
      const setupHideButton = () => {
        hideBtn.textContent = 'Hide Company';
        hideBtn.onclick = async () => {
          try {
            const reason = prompt('Why do you want to hide this company?', 'Not interested');
            if (reason !== null) {
              await hideCompany(companyName, reason);
              setupUnhideButton();
              console.log('Job Notes Saver: Company hidden successfully');
            }
          } catch (error) {
            console.error('Job Notes Saver: Error hiding company:', error);
            alert('Failed to hide company. Please try again.');
          }
        };
      };
      
      // Function to set up unhide functionality
      const setupUnhideButton = () => {
        hideBtn.textContent = 'Unhide Company';
        hideBtn.onclick = async () => {
          try {
            await unhideCompany(companyName);
            setupHideButton();
            console.log('Job Notes Saver: Company unhidden successfully');
          } catch (error) {
            console.error('Job Notes Saver: Error unhiding company:', error);
            alert('Failed to unhide company. Please try again.');
          }
        };
      };
      
      // Check current state and set up button accordingly
      isCompanyHidden(companyName).then(isHidden => {
        if (isHidden) {
          setupUnhideButton();
        } else {
          setupHideButton();
        }
      }).catch(error => {
        console.error('Job Notes Saver: Error checking company hidden status:', error);
        setupHideButton(); // Default to hide button
      });
      
      actionBar.appendChild(hideBtn);
    } catch (error) {
      console.error('Job Notes Saver: Error inserting custom button:', error);
    }
  }
}