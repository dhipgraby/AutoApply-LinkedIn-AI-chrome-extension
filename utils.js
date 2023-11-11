export async function getActiveTabURL() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

export async function isYoutubePage() {
    const activeTap = await getActiveTabURL()

    if (!activeTap.url.includes("linkedin.com/jobs/search/")) {
        console.log('Is not linkedin Job search page!');
        return false
    }


    return true
}
