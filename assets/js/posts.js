import { PostHandler } from "./post-handler.js";

const postLocation = '/posts/posts-prototype.json';
const activeBtn = 'active-btn';
const inputId = 'content-search';

(async function main() {

    const jsonFile = await fetch(postLocation);
    const jsonPosts = await jsonFile.json();

    // make two different impl for a DB and api connection, then make this one the static only impl
    const postHandler = new PostHandler('posts', jsonPosts);

    // Attach global functions AFTER handler is initialized
    window.loadPosts = () => postHandler.loadPosts();
    
    window.buttonSearch = async (clickedBtnId) => {
        if (!clickedBtnId) return;

        const navElements = document.getElementsByClassName(activeBtn);
        for (let ele of navElements) ele.classList.remove(activeBtn);
        document.getElementById(clickedBtnId)?.classList.add(activeBtn);

        if (clickedBtnId === "all") postHandler.loadPosts();
        else postHandler.loadPostsByType(clickedBtnId);
    };

    window.inputSearch = () => {
        const val = document.getElementById(inputId)?.value;
        if (val) postHandler.loadPosts(val);
    };

    window.loadPosts();
})();
