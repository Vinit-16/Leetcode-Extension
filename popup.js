const PROBLEM_KEY = "PROBLEM_KEY";
const bookmarkSection = document.getElementById("bookmarks");

const assetsURLMap = {
    play: chrome.runtime.getURL("assets/play.png"),
    delete: chrome.runtime.getURL("assets/delete.png"),
};

document.addEventListener("DOMContentLoaded", () => {
    refreshBookmarks();
});

async function refreshBookmarks() {
    const currentBookmarks = await getStorage(PROBLEM_KEY);
    viewBookmarks(currentBookmarks);
}

function viewBookmarks(bookmarks) {
    bookmarkSection.innerHTML = "";

    if (bookmarks.length === 0) {
        bookmarkSection.innerHTML = "<i>No Saved Problems</i>";
        return;
    }

    bookmarks.forEach((bookmark) => addNewBookmark(bookmark));
}

function addNewBookmark(bookmark) {
    const newBookmark = document.createElement("div");
    const bookmarkTitle = document.createElement("div");
    const bookmarkControls = document.createElement("div");

    bookmarkTitle.textContent = bookmark.name;
    bookmarkTitle.classList.add("bookmark-title");

    setControlsAttributes(assetsURLMap.play, onPlay, bookmarkControls);
    setControlsAttributes(assetsURLMap.delete, () => onDelete(bookmark.id), bookmarkControls);

    bookmarkControls.classList.add("bookmark-controls");
    newBookmark.classList.add("bookmark");

    newBookmark.append(bookmarkTitle);
    newBookmark.append(bookmarkControls);

    bookmarkSection.appendChild(newBookmark);
}

function setControlsAttributes(src, handler, parentDiv) {
    const controlElement = document.createElement("img");
    controlElement.src = src;
    controlElement.addEventListener("click", handler);
    parentDiv.appendChild(controlElement);
}

function onPlay(event) {
    const probURL = event.target.parentNode.parentNode.getAttribute("url");
    window.open(probURL, "_blank");
}

async function onDelete(idToRemove) {
    const currentBookmarks = await getStorage(PROBLEM_KEY);
    const updatedBookmarks = currentBookmarks.filter((bookmark) => bookmark.id !== idToRemove);

    await setStorage({ [PROBLEM_KEY]: updatedBookmarks });
    console.log("Bookmark deleted:", idToRemove);

    refreshBookmarks();
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
