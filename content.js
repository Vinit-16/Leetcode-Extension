const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
const PROBLEM_KEY = "PROBLEM_KEY";

window.addEventListener("load", addBookmarkButton);

function addBookmarkButton() {
    const bookmarkButton = document.createElement("img");
    bookmarkButton.id = "bookmark";
    bookmarkButton.src = bookmarkURL;
    bookmarkButton.style.height = "30px";
    bookmarkButton.style.width = "30px";

    const start = document.getElementsByClassName("flex items-start justify-between gap-4")[0];

    start.insertAdjacentElement("beforeend", bookmarkButton);

    bookmarkButton.addEventListener("click", addnewBookmarkHandler);
}

async function addnewBookmarkHandler() {
    const currentBookmarks = await getStorage(PROBLEM_KEY);

    const problemURL = window.location.href;
    const unid = extractTextBetween(problemURL);
    const probname = document
        .getElementsByClassName("no-underline hover:text-blue-s dark:hover:text-dark-blue-s truncate cursor-text whitespace-normal hover:!text-[inherit]")[0]
        .innerText;

    if (currentBookmarks.some((bookmark) => bookmark.id === unid)) {
        console.log("Bookmark already exists:", unid);
        return;
    }

    const BookmarkOBJ = {
        id: unid,
        name: probname,
        url: problemURL,
    };

    const updatedBookmarks = [...currentBookmarks, BookmarkOBJ];
    await setStorage({ [PROBLEM_KEY]: updatedBookmarks });
    console.log("Bookmark added successfully:", BookmarkOBJ);
}

function extractTextBetween(url) {
    const startMarker = "problems/";
    const endMarker = "/description";

    const start = url.indexOf(startMarker);
    const end = url.indexOf(endMarker);

    if (start !== -1 && end !== -1 && start < end) {
        return url.slice(start + startMarker.length, end);
    }
    return null;
}

function getStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (data) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(data[key] || []);
            }
        });
    });
}

function setStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}
