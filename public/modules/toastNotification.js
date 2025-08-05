// Toast notification system for Job Notes Saver
if (typeof showToast === 'undefined') {
  // Create toast container if it doesn't exist
  function createToastContainer() {
    let container = document.getElementById('job-notes-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'job-notes-toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  // Show toast notification
  function showToast(message, type = 'info', duration = 3000) {
    try {
      const container = createToastContainer();
      
      // Create toast element
      const toast = document.createElement('div');
      toast.style.cssText = `
        background: ${getToastColor(type)};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        pointer-events: auto;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      
      // Add icon based on type
      const icon = getToastIcon(type);
      toast.innerHTML = `
        <span style="font-size: 16px;">${icon}</span>
        <span>${message}</span>
      `;
      
      container.appendChild(toast);
      
      // Animate in
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      });
      
      // Auto remove
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast);
          }
        }, 300);
      }, duration);
      
    } catch (error) {
      console.error('Job Notes Saver: Error showing toast:', error);
      // Fallback to console log
      console.log(`Job Notes Saver: ${message}`);
    }
  }

  // Get toast color based on type
  function getToastColor(type) {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
      default:
        return '#0a66c2';
    }
  }

  // Get toast icon based on type
  function getToastIcon(type) {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  // Convenience functions
  window.showSuccessToast = (message, duration) => showToast(message, 'success', duration);
  window.showErrorToast = (message, duration) => showToast(message, 'error', duration);
  window.showWarningToast = (message, duration) => showToast(message, 'warning', duration);
  window.showInfoToast = (message, duration) => showToast(message, 'info', duration);
}