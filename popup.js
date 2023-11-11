import { getActiveTabURL } from "./utils.js"
// adding a new bookmark row to the popup

let jobs = []

const addNewBookmark = (bookmarksElements, bookmark) => {

    const bookmarkTitleElement = document.createElement('div')
    const newBookmarkElement = document.createElement('div')
    const controlsElement = document.createElement('div')

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title"

    controlsElement.className = "bookmark-controls"

    newBookmarkElement.id = "bookmark-" + bookmark.time
    newBookmarkElement.className = "bookmark"
    newBookmarkElement.setAttribute("timestamp", bookmark.time)

    setBookmarkAttributes("play", onPlay, controlsElement)
    setBookmarkAttributes("delete", onDelete, controlsElement)

    newBookmarkElement.appendChild(bookmarkTitleElement)
    newBookmarkElement.appendChild(controlsElement)
    bookmarksElements.appendChild(newBookmarkElement)

};

const viewBookmarks = (currentBookmarks = []) => {

    const bookmarksElements = document.getElementById("bookmarks")
    bookmarksElements.innerHTML = "";

    if (currentBookmarks.length > 0) {
        for (var i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i]
            addNewBookmark(bookmarksElements, bookmark)
        }
    } else {
        bookmarksElements.innerHTML = '<i class="row">No bookmarks to show</i>'
    }
};

const onPlay = async e => {

    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp")
    const activeTab = await getActiveTabURL()

    if (activeTab) {
        chrome.tabs.sendMessage(activeTab.id, {
            type: "PLAY",
            value: bookmarkTime
        })
    } else {
        console.log('there is not active tap');
    }
};

const onDelete = async e => {

    const activeTab = await getActiveTabURL()
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp")
    const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime)

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete)

    if (activeTab) {
        chrome.tabs.sendMessage(activeTab.id, {
            type: "DELETE",
            value: bookmarkTime
        }, viewBookmarks)
    } else {
        console.log('there is not active tap');
    }
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img")
    controlElement.src = `assets/${src}.png`
    controlElement.addEventListener("click", eventListener)
    controlParentElement.appendChild(controlElement)
};

document.addEventListener("DOMContentLoaded", async () => {

    const activeTap = await getActiveTabURL()

    console.log("activeTap", activeTap);

    if (!activeTap) {
        console.log("not working activeTap");
        return
    }

    if (activeTap.url.includes("linkedin.com/jobs/search/")) {


        console.log('Ready to search');

        chrome.storage.sync.get(["jobTitles"], (data) => {
            if (data["jobTitles"]) {
                const result = JSON.parse(data["jobTitles"])
                console.log('result', result);
                if (result.length && result.length > 0) {
                    const container = document.getElementById("extension_container")
                    container.innerHTML = `<div class="title">+${result.length} Jobs founded</div>`
                }
            }
        })



        // chrome.storage.sync.get(["key"]).then((result) => {
        //     console.log("Key Value currently is " + result.key);
        // });

    } else {
        console.log('not youtube page');
        const container = document.getElementById("extension_container")
        console.log('container', container);
        container.innerHTML = `<div class="title">This is not a LinkeIn page</div>`
    }

});