chrome.tabs.onUpdated.addListener((tabId, tab) => {
  console.log('loading auto-applyer');
  if (tab.url && tab.url.includes("linkedin.com/jobs/search/")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    });
  }
});
