import {
    executeTasksSequentially,
    smoothScroll,
    delay
} from "../../../helpers/utils.js"

const fetchJobs = async () => {
    console.log('Fetching jobs...');
    await jobScanner()
}

async function jobScanner() {
    const tasks = [
        smoothScroll,
        async () => {
            await delay(2000);
        },
        smoothScroll,
        async () => {
            await delay(2000);
        },
        () => smoothScroll(false),
        async () => {
            await delay(2000);
        },
        smoothScroll,
        async () => {
            await delay(1000);
        },
        () => getJobsFromBoard()
    ];

    await executeTasksSequentially(tasks);
}

function getJobsFromBoard() {
    const jobsList = document.querySelectorAll('.scaffold-layout__list-container li .job-card-list__title')
    if (jobsList && jobsList.length) {

        const allJobs = []

        for (var i = 0; i < jobsList.length; i++) {
            const title = jobsList[i].innerText
            allJobs.push(title)
        }

        chrome.storage.sync.set({ ["jobTitles"]: JSON.stringify(allJobs) })
        chrome.runtime.sendMessage({ type: 'JobsFromBoardCompleted' });

    } else {
        console.log('there is not job list');
    }
}

export default fetchJobs