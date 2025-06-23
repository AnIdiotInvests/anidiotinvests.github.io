function navChange() {

    const navEle = document.getElementById('toggle-nav');
    if (!navEle) return;

    navEle.classList.remove('active');
    const url = location.pathname;
    if (!url) return;

    if (url.trim() === "/") {
        updateNav(['home']);
    } else if (url.trim() === "/about.html") {
        updateNav(['about']);
    } else if (url.trim() === "/social.html") {
        updateNav(['social']);
    } else if (url.trim() === "/reports.html") {
        updateNav(['repots', 'content']);
    } else if (url.trim() === "/posts.html") {
        updateNav(['posts', 'content']);
    }
}

function updateNav(ids) {
    for (id of ids) {
        let ele = document.getElementById(id);
        if (ele) ele.classList.add('active');
    }
}

function navToggle(id) {

    console.log(id);

    let ele = document.getElementById(id);

    if (!ele) return;

    if (ele.classList.contains('nav-visible')) {

        ele.classList.remove('nav-visible');

        ele.classList.add('nav-not-visible');

    } else {

        ele.classList.remove('nav-not-visible');

        ele.classList.add('nav-visible');
    }
}