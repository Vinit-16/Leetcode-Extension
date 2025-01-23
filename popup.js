const PROBLEM_KEY="PROBLEM_KEY";
const bookmarkSection=document.getElementById("bookmarks");

const assetsURLMap={
    "play":chrome.runtime.getURL("assets/play.png"),
    "delete":chrome.runtime.getURL("assets/delete.png")
}

document.addEventListener("DOMContentLoaded",()=>{
    chrome.storage.sync.get([PROBLEM_KEY],(data)=>{
        const currentBookmarks= data[PROBLEM_KEY]||[];
        viewBookmarks(currentBookmarks);
    })
})

function viewBookmarks(bookmarks){
    bookmarkSection.innerHTML="";

    if(bookmarks.length === 0){
        bookmarkSection.innerHTML="<i>No Saved Problems</i>";
        return;
    }

    bookmarks.forEach(bookmark => addnewBookmark(bookmark));
}

function addnewBookmark(bookmark){
    const newBookmark=document.createElement("div");
    const bookmarkTitle=document.createElement("div");
    const bookmarkControls=document.createElement("div");

    bookmarkTitle.textContent=bookmark.name;
    bookmarkTitle.classList.add("bookmark-title");
    
    setControlsAttributes(assetsURLMap["play"],onPlay,bookmarkControls);
    setControlsAttributes(assetsURLMap["delete"],onDelete,bookmarkControls);
    
    bookmarkControls.classList.add("bookmark-controls");

    newBookmark.classList.add("bookmark");

    newBookmark.append(bookmarkTitle);
    newBookmark.append(bookmarkControls);

    newBookmark.setAttribute("url",bookmark.url);
    newBookmark.setAttribute("bookmark-id",bookmark.id);

    bookmarkSection.appendChild(newBookmark);
}


function setControlsAttributes(src,handler,parentDiv){
    const controlElement= document.createElement("img");
    controlElement.src=src;
    controlElement.addEventListener("click",handler);
    parentDiv.appendChild(controlElement);
}


function onPlay(event){
   const probURL= event.target.parentNode.parentNode.getAttribute("url");
   window.open(probURL,"_blank");
}

function onDelete(event){
    const bookmarkItem=event.target.parentNode.parentNode;
    const idToRemove =bookmarkItem.getAttribute("bookmark-id");
    bookmarkItem.remove();
    deleteItemFromStorage(idToRemove);
}

function deleteItemFromStorage(idToRemove){
    chrome.storage.sync.get([PROBLEM_KEY],(data)=>{
        const currrentBookmarks=data[PROBLEM_KEY]||[];
        const updatedBookmarks=currrentBookmarks.filter((bookmark) => bookmark.id !== idToRemove);
        chrome.storage.sync.set({PROBLEM_KEY:updatedBookmarks});
    })
}