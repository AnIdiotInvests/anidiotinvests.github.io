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
        var data = await fetchDataFromLocation(value);
        if (data) {
            document.getElementsByTagName(key)[0].innerHTML += data;
        }
    }
}

async function loadBodyComponents() {
    const bodyComponents = new Map([
        ["get-header", "/components/header.html"],
        ["get-footer", "/components/footer.html"]
    ]);
    for (const [className, dataLocation] of bodyComponents) {
        innnerHtmlIfExistsById(className, dataLocation);
    }
}

async function innnerHtmlIfExistsById(idName, dataLocation) {
    var ele = document.getElementById(idName);
    if (ele) {
        ele.innerHTML = await fetchDataFromLocation(dataLocation);
    }
}

async function fetchDataFromLocation(loc) {
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
                applyClass('home', 'active')

            } else if (url.trim() === '/about.html') {
                applyClass('about', 'active')
            }
        }
    }
}

async function applyClass(idName, className) {
    aboutEle = document.getElementById(idName);
    aboutEle.classList.add(className);
}
