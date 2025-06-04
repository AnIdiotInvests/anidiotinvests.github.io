

class ComponentLoader {

    constructor(dynamicLoadId) {
        this.dynamicLoadId = dynamicLoadId;
    }

    async loadComponents() {
        // await this.#loadHeadComponents();
        await this.#renderContent();
    }

    // TODO: Not sure if this should be async for dynamic post to head content to be available quick enough
    // async #loadHeadComponents() {
    //     const headComponents = new Map([
    //         ["head", "/components/head.html"]
    //     ]);
    //     for (const [tagName, dataLocation] of headComponents) {
    //         const element = document.getElementsByTagName(tagName)[0];
    //         if (element) {
    //             const component = await fetch(dataLocation);
    //             if (component) {
    //                 element.innerHTML += await component.text();
    //             }
    //         }
    //     }
    // }

    async #renderContent() {
        const postName = new URLSearchParams(window.location.search).get('post');
        const pageName = new URLSearchParams(window.location.search).get('page');
        const url = location.pathname;
        if (!postName && !pageName && url.trim() !== "/") {
            return;
        }

        let rendered = false;
        if (postName) {
            rendered = await this.#renderPost(postName);
        } else {
            rendered = await this.#renderPage(pageName);
        }
        if (rendered) {
            rendered = document.dispatchEvent(new Event('Loaded'));
        }

        if (!rendered) return;

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

        let rendered = false;
        const contentEle = document.getElementById(this.dynamicLoadId);
        if (!contentEle) return;

        if (!pageName || pageName.trim() === "") {
            pageName = "home";
        }

        await fetch("/pages/" + pageName + ".html")
            .then(response => response.text())
            .then(pageHtml => {
                contentEle.innerHTML = "";
                if (pageHtml) {
                    contentEle.innerHTML += pageHtml;
                    rendered = true;
                }
            }).catch(err => {
                contentEle.innerHTML = '<p>Page not found</p>';
                console.error(err);
            });

        return rendered;
    }

    // TODO: Garbage duplicate of above.
    async #renderPost(postName) {

        let rendered = false;
        const contentEle = document.getElementById(this.dynamicLoadId);
        if (!contentEle) return;

        await fetch("/posts/" + postName + ".md")
            .then(response => response.text())
            .then(markdownText => {

                const converter = new showdown.Converter({ metadata: true });
                if (converter) {

                    const htmlContent = converter.makeHtml(markdownText);
                    const metadata = converter.getMetadata();

                    if (metadata) {
                        this.#renderMetadata(contentEle, metadata);
                    }
                    contentEle.innerHTML += "<div class=\"post-content\">" + htmlContent + "</div>";
                    rendered = true;
                }
            }).catch(err => {
                contentEle.innerHTML = '<p>Page not found</p>';
                console.error(err);
            });

        return rendered;
    }

    #renderMetadata(contentEle, metadata) {

        if (metadata.title) {
            contentEle.innerHTML += "<h1>" + metadata.title + "</h1>";

            document.title = metadata.title;

            var titleMetaTag = document.querySelector('meta[property="og:title"');
            if (titleMetaTag) {
                titleMetaTag.setAttribute("content", metadata.title);
            }

            var description = document.querySelector('meta[name="description"]');
            if (description) {
                if (metadata.description) {
                    description.setAttribute("content", metadata.description);

                } else {
                    description.setAttribute("content", metadata.title);
                }
            }

            if (metadata.image) {
                contentEle.innerHTML += "<div class=\"post-image\"><img src=\"" + metadata.image + "\"></div>"

                var ogImage = document.querySelector('meta[property="og:image"]');
                if (ogImage) {
                    ogImage.setAttribute("content", metadata.image);
                }

                var twitImage = document.querySelector('meta[name="twitter:image"]');
                if (twitImage) {
                    twitImage.setAttribute("content", metadata.image);
                }
            }
            if (metadata.date) {
                contentEle.innerHTML += "<p>" + new Date(metadata.date).toDateString() + "</p>";
            }
            contentEle.innerHTML += "</div>";
        }


    }
}

export { ComponentLoader };
