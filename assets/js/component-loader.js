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
    for (const [tagName, dataLocation] of headComponents) {
        const element = document.getElementsByTagName(tagName)[0];
        if (element) {
            const component = await fetch(dataLocation);
            if (component) {
                element.innerHTML += await component.text();
            }
        }
    }
}

async function loadBodyComponents() {
    const bodyComponents = new Map([
        ["get-header", "/components/header.html"],
        ["get-footer", "/components/footer.html"]
    ]);
    for (const [idName, dataLocation] of bodyComponents) {
        const element = document.getElementById(idName);
        if (element) {
            const component = await fetch(dataLocation);
            if (component) {
                element.innerHTML = await component.text();
            }
        }
    }
}

async function setNav() {
    const navEle = document.getElementById('get-nav');
    if (navEle) {
        navEle.classList.remove('active');
        const url = location.pathname;
        if (url) {
            if (url.trim() === "/") {
                applyClass('home', 'active')

            } else if (url.trim() === '/about.html') {
                applyClass('about', 'active')
            }
        }
    }
}

async function applyClass(idName, className) {
    element = document.getElementById(idName);
    if (element) {
        element.classList.add(className);
    }
}
