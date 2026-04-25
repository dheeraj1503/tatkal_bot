/**
 * RailAssist – Background Service Worker (MV3)
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[RailAssist] Extension installed.');
});

// Toggle sidebar visibility via action click
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SIDEBAR' }).catch(() => {});
});
