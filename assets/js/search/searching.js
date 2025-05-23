


const activeBtn = 'active-btn';

// TODO: build abstraction to make this work for any page implementation, it should not be hardcoded to this extent
async function searchButton(buttonId) {
    if (buttonId) {
        const navEle = document.getElementsByClassName(activeBtn);
        if (navEle) {
            for (activeEle of navEle) {
                activeEle.classList.remove(activeBtn);
            }
        }
        const ele = document.getElementById(buttonId);
        if (ele) {
            ele.classList.add(activeBtn);
            runSearch(buttonId);
        }
    }
}

async function runSearch(buttonId) {
    if (!buttonId || buttonId === "all") {
        loadPosts();
    } else {
        loadPostsByType(buttonId);
    }
}
