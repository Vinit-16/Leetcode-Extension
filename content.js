const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");

window.addEventListener("load",addBookmarkButton);

function addBookmarkButton(){
    const bookmarkButton=document.createElement("img");
    bookmarkButton.id="bookmark";
    bookmarkButton.src=bookmarkURL;
    bookmarkButton.style.height="30px";
    bookmarkButton.style.width="30px";

    const start=document.getElementsByClassName("flex items-start justify-between gap-4")[0]; 

    start.insertAdjacentElement("beforeend",bookmarkButton);
}