// Custom modal system for Job Notes Saver
if (typeof showCustomPrompt === 'undefined') {
  // Create and show custom prompt modal
  function showCustomPrompt(title, message, placeholder = '', defaultValue = '') {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;

      // Create modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        width: 90%;
        padding: 0;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `;

      // Create modal content
      modal.innerHTML = `
        <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #e9ecef;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #212529;">${title}</h3>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #6c757d; line-height: 1.4;">${message}</p>
        </div>
        <div style="padding: 20px 24px;">
          <input type="text" id="custom-prompt-input" placeholder="${placeholder}" value="${defaultValue}" 
                 style="width: 100%; padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 8px; 
                        font-size: 14px; outline: none; transition: border-color 0.2s ease;
                        font-family: inherit;" />
        </div>
        <div style="padding: 0 24px 24px 24px; display: flex; gap: 12px; justify-content: flex-end;">
          <button id="custom-prompt-cancel" 
                  style="padding: 10px 20px; border: 1px solid #dee2e6; background: white; 
                         border-radius: 6px; font-size: 14px; font-weight: 500; color: #6c757d;
                         cursor: pointer; transition: all 0.2s ease;">
            Cancel
          </button>
          <button id="custom-prompt-confirm" 
                  style="padding: 10px 20px; border: none; background: #0a66c2; color: white;
                         border-radius: 6px; font-size: 14px; font-weight: 500;
                         cursor: pointer; transition: all 0.2s ease;">
            Confirm
          </button>
        </div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Get elements
      const input = modal.querySelector('#custom-prompt-input');
      const cancelBtn = modal.querySelector('#custom-prompt-cancel');
      const confirmBtn = modal.querySelector('#custom-prompt-confirm');

      // Add hover effects
      const addHoverEffect = (btn, hoverStyle, normalStyle) => {
        btn.addEventListener('mouseenter', () => {
          Object.assign(btn.style, hoverStyle);
        });
        btn.addEventListener('mouseleave', () => {
          Object.assign(btn.style, normalStyle);
        });
      };

      addHoverEffect(cancelBtn, 
        { backgroundColor: '#f8f9fa', borderColor: '#adb5bd' },
        { backgroundColor: 'white', borderColor: '#dee2e6' }
      );

      addHoverEffect(confirmBtn,
        { backgroundColor: '#0056b3' },
        { backgroundColor: '#0a66c2' }
      );

      // Focus input and select text
      setTimeout(() => {
        input.focus();
        if (defaultValue) {
          input.select();
        }
      }, 100);

      // Handle input focus
      input.addEventListener('focus', () => {
        input.style.borderColor = '#0a66c2';
        input.style.boxShadow = '0 0 0 3px rgba(10, 102, 194, 0.1)';
      });

      input.addEventListener('blur', () => {
        input.style.borderColor = '#e9ecef';
        input.style.boxShadow = 'none';
      });

      // Handle actions
      const handleConfirm = () => {
        const value = input.value.trim();
        closeModal();
        resolve(value || null);
      };

      const handleCancel = () => {
        closeModal();
        resolve(null);
      };

      const closeModal = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
        }, 300);
      };

      // Event listeners
      confirmBtn.addEventListener('click', handleConfirm);
      cancelBtn.addEventListener('click', handleCancel);
      
      // Enter key to confirm
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleConfirm();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleCancel();
        }
      });

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          handleCancel();
        }
      });

      // Animate in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      });
    });
  }
}