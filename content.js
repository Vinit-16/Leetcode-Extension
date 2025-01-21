const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
const PROBLEM_KEY="PROBLEM_KEY";
window.addEventListener("load",addBookmarkButton);

function addBookmarkButton(){
    const bookmarkButton=document.createElement("img");
    bookmarkButton.id="bookmark";
    bookmarkButton.src=bookmarkURL;
    bookmarkButton.style.height="30px";
    bookmarkButton.style.width="30px";

    const start=document.getElementsByClassName("flex items-start justify-between gap-4")[0]; 

    start.insertAdjacentElement("beforeend",bookmarkButton);

    bookmarkButton.addEventListener("click",addnewBookmarkHandler);
}
async function addnewBookmarkHandler(){
    const currrentBookmarks= await getCurrentBookmarks();

    const problemURL=window.location.href;
    const unid=extractTextBetween(problemURL);
    const probname=document.getElementsByClassName("no-underline hover:text-blue-s dark:hover:text-dark-blue-s truncate cursor-text whitespace-normal hover:!text-[inherit]")[0].innerText;
    
    if(currrentBookmarks.some((bookmark)=>bookmark.id===unid))return;

    const BookmarkOBJ={
        id:unid,
        name:probname,
        url:problemURL
    }
    const updatedBookmarks = [...currrentBookmarks,BookmarkOBJ];
    chrome.storage.sync.set({PROBLEM_KEY:updatedBookmarks},()=>{
        console.log("Updated the bookmarks correctly to ",updatedBookmarks);
    });
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
function getCurrentBookmarks(){
    return new Promise((resolve,reject)=>{
        chrome.storage.sync.get([PROBLEM_KEY],(results)=>{
            resolve(results[PROBLEM_KEY]||[]);
        });
    });
}

