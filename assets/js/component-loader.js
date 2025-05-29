

class ComponentLoader {

    async loadComponents() {
        await Promise.all([
            this.#renderContent(),
            this.#loadHeadComponents()
        ])
    }

    async #loadHeadComponents() {
        const headComponents = new Map([
            ["head", "/components/head.html"]
        ]);
        for (const [tagName, dataLocation] of headComponents) {
            const element = document.getElementsByTagName(tagName)[0];
            if (element) {
                const component = await fetch(dataLocation);
                if (component) {
                    element.innerHTML += component.text();
                }
            }
        }
    }

    async #renderContent() {

        const postName = new URLSearchParams(window.location.search).get('post');
        const pageName = new URLSearchParams(window.location.search).get('page');
        const url = location.pathname;
        if (!postName && !pageName && url.trim() !== "/") {
            return;
        }


        if (postName) {
            await this.#renderPost(postName);
        } else if (pageName) {
            await this.#renderPage(pageName);
        } else {
            await this.#renderPage("home");
        }

        document.dispatchEvent(new Event('Loaded'));

        const navEle = document.getElementById('get-nav');
        if (navEle) {
            navEle.classList.remove('active');
            if (url) {
                if (url.trim() === "/" && (!pageName && !postName)) {
                    this.#applyClassToId('home', 'active');

                } else if (pageName === "about") {
                    this.#applyClassToId('about', 'active');
                }
            }
        }
    }

    async #applyClassToId(epicId, epicClass) {
        let homeEle = document.getElementById(epicId);
        if (homeEle) {
            homeEle.classList.add(epicClass);
        }
    }

    async #renderPage(pageName) {

        const contentEle = document.getElementById("dynamic-content");

        await fetch("/pages/" + pageName + ".html")
            .then(response => response.text())
            .then(pageHtml => {
                contentEle.innerHTML = "";
                contentEle.innerHTML += pageHtml;
            })
            .catch(error => {
                contentEle.innerHTML = '<p>Page not found</p>';
                console.error(error);
            });
    }

    async #renderPost(postName) {

        const contentEle = document.getElementById("dynamic-content");

        await fetch("/posts/" + postName + ".md")
            .then(response => response.text())
            .then(markdownText => {

                const converter = new showdown.Converter({ metadata: true });
                if (converter) {

                    const htmlContent = converter.makeHtml(markdownText);
                    const metadata = converter.getMetadata();

                    if (metadata) {
                        if (metadata.title) {
                            contentEle.innerHTML += "<h1>" + metadata.title + "</h1>";
                        }
                        if (metadata.date) {
                            contentEle.innerHTML += "<p>" + new Date(metadata.date).toDateString() + "</p>";
                        }
                    }
                    contentEle.innerHTML += "<div class=\"post-content\">" + htmlContent + "</div>";
                }
            })
            .catch(error => {
                contentEle.innerHTML = '<p>Post not found.</p>';
                console.error(error);
            });
    }

}

export { ComponentLoader };
