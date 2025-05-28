async function loadComponents() {
    await Promise.all([
        loadHeadComponents(),
        renderContent()
    ]);
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

async function renderContent() {
    const postName = new URLSearchParams(window.location.search).get('post');
    const pageName = new URLSearchParams(window.location.search).get('page');
    const url = location.pathname;

    if (!postName && !pageName && url.trim() !== "/") {
        return;
    }

    if (postName) {

        postHeader = document.createAttribute("div");
        postContent = document.createAttribute("div");
        contentEle = document.getElementById("dynamic-content");

        fetch("/posts/" + postName + ".md")
            .then(response => response.text())
            .then(markdownText => {

                const converter = new showdown.Converter({ metadata: true });
                if (converter) {

                    contentEle.innerHTML = "";
                    const htmlContent = converter.makeHtml(markdownText);
                    const metadata = converter.getMetadata();

                    if (metadata) {
                        if (postHeader && metadata.title) {
                            postHeader.innerHTML = "<h1>" + metadata.title + "</h1>";
                        }
                        if (postHeader && metadata.date) {
                            postHeader.innerHTML += "<p>" + new Date(metadata.date).toDateString() + "</p>";
                        }
                    }
                    contentEle.innerHTML += postHeader.innerHTML;
                    contentEle.innerHTML += htmlContent;
                }
            })
            .catch(error => {
                postContent.innerHTML = '<p>Post not found.</p>';
            });
    } else if (pageName) {

        postHeader = document.createAttribute("div");
        postContent = document.createAttribute("div");
        contentEle = document.getElementById("dynamic-content");

        fetch("/pages/" + pageName + ".md")
            .then(response => response.text())
            .then(pageHtml => {

                contentEle.innerHTML = "";
                contentEle.innerHTML += pageHtml;
            })
            .catch(error => {
                postContent.innerHTML = '<p>Page not found</p>';
            });
    }

    const navEle = document.getElementById('get-nav');
    if (navEle) {
        navEle.classList.remove('active');
        console.log(url);
        if (url) {
            if (url.trim() === "/" && (!pageName && !postName)) {
                applyClass('home', 'active')

            } else if (pageName === "about") {
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
