console.log('Job Notes Saver: Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Job Notes Saver: Extension installed');
});

// Track injected tabs to prevent duplicate injections
const injectedTabs = new Set();

// Function to inject scripts with duplicate prevention
async function injectScripts(tabId) {
  if (injectedTabs.has(tabId)) {
    console.log('Job Notes Saver: Scripts already injected for tab:', tabId);
    return;
  }

  try {
    // Check if content script is already injected
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => typeof window.jobNotesSaverInjected !== 'undefined'
    });

    if (result?.result) {
      console.log('Job Notes Saver: Scripts already present in tab:', tabId);
      injectedTabs.add(tabId);
      return;
    }

    // Inject scripts
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: [
        'modules/storageManager.js',
        'modules/companyHighlight.js',
        'modules/customButtons.js',
        'modules/observerManager.js',
        'contentScript.js'
      ]
    });

    // Mark injection
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => { window.jobNotesSaverInjected = true; }
    });

    injectedTabs.add(tabId);
    console.log('Job Notes Saver: Scripts injected successfully for tab:', tabId);
  } catch (err) {
    console.error('Job Notes Saver: Script injection failed:', err);
  }
}

// Clear injection tracking when tab is removed
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

// Clear injection tracking when tab navigates away
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && !changeInfo.url.includes('linkedin.com/jobs')) {
    injectedTabs.delete(tabId);
  }
});

// Inject content scripts when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('linkedin.com/jobs')) {
    console.log('Job Notes Saver: Tab update complete, checking injection for tab:', tabId);
    injectScripts(tabId);
  }
});

// Also inject when tab is activated (for existing tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url?.includes('linkedin.com/jobs')) {
      console.log('Job Notes Saver: Tab activated, checking injection for tab:', activeInfo.tabId);
      injectScripts(activeInfo.tabId);
    }
  });
});

// ... existing context menu code ...