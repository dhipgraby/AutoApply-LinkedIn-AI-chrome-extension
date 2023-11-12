(async () => {
    try {
        const src = chrome.runtime.getURL("./src/controllers/JobsController/index.js");
        const contentMain = await import(src);
        const fetchJobs = contentMain.default;

        function ping() {
            chrome.runtime.sendMessage('ping', response => {
                if (chrome.runtime.lastError) {
                    setTimeout(ping, 1000);
                } else {
                    chrome.runtime.sendMessage({
                        from: 'content',
                        subject: 'showPageAction',
                    });
                }
            });
        }
        ping();

        chrome.runtime.onMessage.addListener(async (obj, sender, sendResponse) => {
            const { type, tabId } = obj;
            let response = { empty: true }

            if (type === "SEARCH") {
                console.log('SEARCH EVENT');
                try {
                    await fetchJobs()
                } catch (e) {
                    console.log('search err:', e);
                    response = { status: 400 };
                    sendResponse(response)
                }
            } else if (type === "TEST") {
                sendResponse({ msg: "test msg" })
            }

            sendResponse(response)
        });

        console.log('CT Loaded correctly');
    } catch (error) {
        console.error('Error:', error);
    }

})();
