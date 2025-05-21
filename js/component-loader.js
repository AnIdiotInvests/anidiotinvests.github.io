async function loadComponents() {
    await Promise.all([
        loadBodyComponents(),
        loadHeadComponents(),
    ]);
    setNav();
}

async function loadHeadComponents() {
    const headComponents = new Map([
        ["head", "/components/head.html"]
    ]);
    for (const [key, value] of headComponents) {
        document.getElementsByTagName(key)[0].innerHTML += await fetchHtml(value);
    }
}

async function loadBodyComponents() {
    const bodyComponents = new Map([
        ["get-header", "/components/header.html"],
        ["get-footer", "/components/footer.html"],
    ]);
    for (const [key, value] of bodyComponents) {
        document.getElementById(key).innerHTML = await fetchHtml(value);
    }
}

async function fetchHtml(loc) {
    response = await fetch(loc);
    return await response.text();
}

async function setNav() {
    const navEle = document.getElementById('get-nav');
    if (navEle) {
        navEle.classList.remove('active');
        const url = location.pathname;
        if (url) {
            if (url.trim() == "/") {
                applyClass('home')

            } else if (url.trim() === '/about.html') {
                applyClass('about')
            }
        }
    }
}

async function applyClass(id) {
    aboutEle = document.getElementById(id);
    aboutEle.classList.add('active');
}
