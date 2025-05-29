import { PostHandler } from "./post-handler.js";
import { ComponentLoader } from "./component-loader.js";

const postLocation = '/posts/posts-prototype.json';
const activeBtn = 'active-btn';
const inputId = 'content-search';

const jsonFile = await fetch(postLocation);
const jsonPosts = await jsonFile.json();

// make two different impl for a DB and api connection, then make this one the static only impl
const postHandler = new PostHandler('posts', jsonPosts);
const compLoader = new ComponentLoader('dynamic-content');

document.addEventListener('Loaded', () => {
    postHandler.loadPostsByType('podcast');
});

window.buttonSearch = async (clickedBtnId) => {
    if (!clickedBtnId) return;

    const navElements = document.getElementsByClassName(activeBtn);
    for (let ele of navElements) ele.classList.remove(activeBtn);
    document.getElementById(clickedBtnId)?.classList.add(activeBtn);

    if (clickedBtnId === "all") postHandler.loadPosts();
    else postHandler.loadPostsByType(clickedBtnId);
};

window.inputSearch = async () => {
    const searchKey = document.getElementById(inputId)?.value;
    if (searchKey) postHandler.loadPosts(searchKey);
};

compLoader.loadComponents();
