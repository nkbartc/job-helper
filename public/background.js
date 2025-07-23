console.log('Job Notes Saver: Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Job Notes Saver: Extension installed');
});

// Inject content scripts when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('linkedin.com/jobs')) {
    console.log('Job Notes Saver: Injecting scripts for tab:', tabId);
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [
        'modules/storageManager.js',
        'modules/companyHighlight.js',
        'modules/customButtons.js',
        'modules/observerManager.js',
        'contentScript.js'
      ]
    }).then(() => {
      console.log('Job Notes Saver: Scripts injected successfully');
    }).catch((err) => {
      console.error('Job Notes Saver: Script injection failed:', err);
    });
  }
});

// Also inject when tab is activated (for existing tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url?.includes('linkedin.com/jobs')) {
      console.log('Job Notes Saver: Injecting scripts for activated tab:', activeInfo.tabId);
      chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: [
          'modules/storageManager.js',
          'modules/companyHighlight.js',
          'modules/customButtons.js',
          'modules/observerManager.js',
          'contentScript.js'
        ]
      }).then(() => {
        console.log('Job Notes Saver: Scripts injected successfully for activated tab');
      }).catch((err) => {
        console.error('Job Notes Saver: Script injection failed for activated tab:', err);
      });
    }
  });
});

// ... existing context menu code ...