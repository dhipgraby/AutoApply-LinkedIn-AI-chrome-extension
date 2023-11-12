import { getActiveTabURL } from "../helpers/utils.js"

const searchBtn = document.querySelector('.searchBtn')
const message = document.querySelector('.message')
const title = document.querySelector('.title')
const system = document.querySelector('.system')

const getResponse = async (res) => {
    await res
    console.log('res', res);
    if (!res) return
    if (!res.status == 200) {
        console.error('error on getting message back');
        return
    }
    if (res.msg === 'FOUND') {
        console.log('executing jobs found!');
        jobsFound()
    }
};

async function isEnble() {
    const activeTab = await getActiveTabURL()

    if (!activeTab) {
        console.log("not working activeTab");
        return false
    }

    if (!activeTab.url.includes("linkedin.com/jobs/search/")) {
        const container = document.getElementById("extension_container")
        container.innerHTML = `<div class="title">This is not a LinkeIn page</div>`
        return false
    } else {
        console.log('Ready to search');
        return true
    }

}

async function renderContent() {
    getJobs()
}

async function getJobs() {

    const activeTab = await getActiveTabURL()
    if (!activeTab) {
        console.log('there is not activeTab');
        return
    }

    searchBtn.addEventListener("click", async () => {
        try {
            console.log("activeTab.id", activeTab.id);
            chrome.tabs.sendMessage(
                activeTab.id,
                { type: "SEARCH" }
            )
            searchBtn.innerHTML = `Searching Jobs...`
            searchBtn.disabled = true
        } catch (error) {
            searchBtn.innerHTML = `Search again`
            searchBtn.disabled = false
            console.error("Error sending message:", error);
        }
    })
}

async function jobsFound() {
    await chrome.storage.sync.get(["jobTitles"], (data) => {

        if (data["jobTitles"]) {
            const result = JSON.parse(data["jobTitles"])
            if (result.length && result.length > 0) {
                title.innerHTML = `${result.length} Jobs founded`
            }
        } else {
            title.innerHTML = `There is not jobs in this page, reload and try to scan again.`
            console.log('there is not jobs availables');
        }
        searchBtn.innerHTML = `Search again`
        searchBtn.disabled = false
    })
}

document.addEventListener("DOMContentLoaded", async () => {

    const isExtensionEnable = await isEnble()
    if (!isExtensionEnable) {
        console.log('Extension not enable');
        return
    }

    console.info('Extension enable!');

    chrome.runtime.onMessage.addListener(async (obj, sender, sendResponse) => {
        const { type } = obj;
        let response = { empty: true }
        console.log('receving messages...', type);

        if (type === "JobsFromBoardCompleted") {
            jobsFound()
        }
        sendResponse(response)
    });

    renderContent()

});