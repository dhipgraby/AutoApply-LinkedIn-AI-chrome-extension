export function smoothScroll(isScrollToBottom = true) {
    console.log(`scanning jobs to ${(isScrollToBottom) ? 'bottom' : 'top'}`);

    var scrollingDiv = document.querySelector('.jobs-search-results-list');

    if (!scrollingDiv) {
        console.log('There is not a job list to scan');
        return;
    }

    scrollingDiv.style.border = 'solid #57c995 2px';
    var scrollHeight = scrollingDiv.scrollHeight;
    var currentScroll = isScrollToBottom ? 0 : scrollingDiv.scrollTop;
    var targetScroll = isScrollToBottom ? scrollHeight : 0;
    var duration = 1000; // milliseconds
    var startTime;

    function scrollStep(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        var progress = timestamp - startTime;
        scrollingDiv.scrollTop = easeInOut(progress, currentScroll, targetScroll - currentScroll, duration);

        if (progress < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    function easeInOut(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(scrollStep);

    setTimeout(() => {
        scrollingDiv.style.border = 'none';
    }, duration * 2);
}


export async function executeTasksSequentially(tasks) {
    for (const task of tasks) {
        await task();
    }
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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