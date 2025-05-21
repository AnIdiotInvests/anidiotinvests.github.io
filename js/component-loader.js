async function loadComponents() {

    const tagComponents = new Map([
        ["head", "/components/head.html"]
    ]);

    const components = new Map([
        ["get-header", "/components/header.html"],
        ["get-footer", "/components/footer.html"],
    ]);

    for (const [key, value] of tagComponents) {
        document.getElementsByTagName(key)[0].innerHTML += await fetchHtml(value);
    }
    for (const [key, value] of components) {
        document.getElementById(key).innerHTML = await fetchHtml(value);
    }
    setNav();
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
