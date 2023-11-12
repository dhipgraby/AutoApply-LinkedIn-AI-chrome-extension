chrome.tabs.onUpdated.addListener((tabId, tab) => {
  console.log('Triggering on Update');

});

chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab.
    // chrome.browserAction.show(sender.tab.id);
  }
  // else if (msg.type === 'JobsFromBoardCompleted') {
  //   console.log('JobsFromBoardCompleted message received!');
  //   jobsFound();
  // }
});