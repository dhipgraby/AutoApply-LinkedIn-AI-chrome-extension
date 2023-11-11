
(() => {

    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let allJobs = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
        console.log('getting event');
        if (type === "NEW") {
            fetchJobs()
        }
        // else if (type === "PLAY") {
        //     console.log('play event');
        //     youtubePlayer.currentTime = value
        // }
        // else if (type === "DELETE") {
        //     console.log('delete event');
        //     currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value)
        //     chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) })

        //     response(currentVideoBookmarks)
        // }
    });

    const fetchJobs = async () => {

        function jobScanner(times) {
            console.log('scanning jobs...');
            setTimeout(() => {
                smoothScrollToBottom()
                if (times > 0) jobScanner(0)
            }, 2000)
        }

        jobScanner(1)

        setTimeout(() => {
            const jobsList = document.querySelectorAll('.scaffold-layout__list-container li .job-card-list__title')
            if (jobsList && jobsList.length) {
                allJobs = []
                for (var i = 0; i < jobsList.length; i++) {
                    const title = jobsList[i].innerText
                    allJobs.push(title)
                }
                console.log('allJobs', allJobs);

                chrome.storage.sync.set({ "key": "this is KEY value" }).then(() => {
                    console.log("Value is set");
                });

                chrome.storage.sync.set({ ["jobTitles"]: JSON.stringify(allJobs) }).then(() => {
                    console.log("Jobs list is set");
                });
                return allJobs
            } else {
                console.log('there is not job list');
            }
        }, 5000)
    }

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            })
        })
    }

    // const newVideoLoaded = async () => {
    //     const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
    //     currentVideoBookmarks = await fetchBookmarks()
    //     console.log(bookmarkBtnExists);

    //     const validPage = window.location.href.includes("youtube.com/watch")
    //     console.log("validPage", validPage);
    //     if (!validPage) return

    //     if (!bookmarkBtnExists) {
    //         const bookmarkBtn = document.createElement("img");

    //         bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    //         bookmarkBtn.className = "ytp-button " + "bookmark-btn";
    //         bookmarkBtn.title = "Click to bookmark current timestamp";

    //         youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    //         youtubePlayer = document.getElementsByClassName("video-stream")[0];

    //         youtubeLeftControls.append(bookmarkBtn);
    //         bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    //     }
    // }

    // const addNewBookmarkEventHandler = async () => {
    //     const currentTime = youtubePlayer.currentTime;

    //     const newBookmark = {
    //         time: currentTime,
    //         desc: "Bookmark at " + getTime(currentTime),
    //     };

    //     console.log("newBookmark", newBookmark);

    //     currentVideoBookmarks = await fetchBookmarks()

    //     chrome.storage.sync.set({
    //         [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    //     });
    // }

    // newVideoLoaded();
    console.log('Starting Auto Link');
    fetchJobs()
})();

function smoothScrollToBottom() {
    var scrollingDiv = document.querySelector('.jobs-search-results-list');
    var scrollHeight = scrollingDiv.scrollHeight;
    var currentScroll = scrollingDiv.scrollTop;
    var targetScroll = scrollHeight;
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
        // Use easeInOutQuad easing function
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(scrollStep);
}

// const getTime = t => {
//     var date = new Date(0);
//     date.setSeconds(t);

//     return date.toISOString().substr(11).replace("Z", "").replace(".000", "");
// }
