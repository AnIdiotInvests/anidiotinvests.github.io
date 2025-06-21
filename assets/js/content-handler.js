
class Content {
    constructor(id, title, date, description, image, category) {
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.description = description;
        this.image = image;
        this.category = category;
    }
}

async function loadPosts(searchKey) {
    try {
        const postsJsonFile = await fetch("/posts/data/posts.json", {
            method: 'GET',
            cache: 'no-store'
        });
        if (postsJsonFile) {
            let jsonPosts = await marshalContentJson(postsJsonFile, searchKey);
            if (jsonPosts) outputPosts(jsonPosts, 'posts');
        }
        const startOfDayUTC = new Date(Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate()
        ));
        const today = startOfDayUTC.toISOString().slice(0, 10);
        let dashJsonFile = await fetch("/dashboard/" + today + "-dashboard.json");
        if (!dashJsonFile || !dashJsonFile.ok) {
            startOfDayUTC.setDate(startOfDayUTC.getDate() - 1);
            dashJsonFile = await fetch("/dashboard/" + startOfDayUTC.toISOString().slice(0, 10) + "-dashboard.json", {
                method: 'GET',
                cache: 'no-store'
            });
        }
        if (dashJsonFile) {
            let dashboard = await dashJsonFile.json();
            if (dashboard) outputDash(dashboard, 'dashboard', startOfDayUTC);
        }
    } catch (error) { }
}

async function marshalContentJson(jsonData, searchKey) {
    let out;
    let data = await jsonData.json();
    if (data) out = await mapPostsByAnyMatch(searchKey, data);
    return out;
}

function outputDash(dashboard, element, date) {

    const dashboardEle = document.getElementById(element);
    if (!dashboardEle) return;

    const div = document.createElement('div');
    const outlook = document.createElement('p');
    const dashboardTitle = document.createElement('h2');
    const faq = document.createElement('a');
    const ul = document.createElement('ul');

    faq.textContent = "What Is This?";
    faq.href = "/faq.html#ai-dashboard-faq"
    outlook.textContent = dashboard.outlook + " (Not Financial Advice)";
    dashboardTitle.textContent = "AI Driven Dashboard Report " + date.toISOString().slice(0, 10);

    div.appendChild(dashboardTitle);
    div.appendChild(outlook);
    div.appendChild(faq);
    div.appendChild(ul);
    dashboardEle.appendChild(div);
    dashboard.content.forEach(cont => {
        let item = document.createElement('li');
        item.textContent = cont.description;
        ul.appendChild(item);
    });
}

function outputPosts(posts, element) {

    let postListEle = document.getElementById(element);
    if (!postListEle) return;

    postListEle.innerHTML = "";
    let feedTitle = document.createElement('h2');
    feedTitle.textContent = "Recent Feed";
    postListEle.appendChild(feedTitle);
    posts.sort(function (a, b) { return a.date - b.date; }).reverse();

    let recentPostEle = document.getElementById('recent-post');
    if (recentPostEle && posts[0]) {

        let linkWrapper = document.createElement('a');
        let title = document.createElement('h2');
        let image = document.createElement('img');
        let desc = document.createElement('p');

        title.textContent = "Most Recent: " + posts[0].title;
        desc.textContent = posts[0].date.toLocaleDateString("en-US") + " | " + posts[0].description + "...";
        image.src = posts[0].image;

        linkWrapper.href = `/posts/${posts[0].id}.html`;
        linkWrapper.appendChild(title);
        linkWrapper.appendChild(image);
        linkWrapper.appendChild(desc);
        recentPostEle.appendChild(linkWrapper);
    }

    var max = 7;
    var count = 0;
    for (var post of posts) {
        if (!post) continue;
        count++;

        let div = document.createElement('div');
        let link = document.createElement('a');
        let date = document.createElement('p')
        link.href = `/posts/${post.id}.html`;
        link.textContent = post.title;
        div.classList.add("post")
        div.appendChild(link);

        if (post.description) {
            let desc = document.createElement('p')

            let descStr = post.description;

            if (post.date) {
                var dateStr = post.date.toLocaleDateString("en-US");
                descStr = dateStr + " | " + descStr;
            }
            desc.textContent = descStr;
            div.appendChild(desc);
        }
        postListEle.appendChild(div);

        if (count === max || count > max) break;
    }
}

function mapPostsByAnyMatch(searchKey, postJson) {
    if (searchKey) searchKey = searchKey.trim();
    return postJson.map(post => {
        if (!searchKey || isOf(post, searchKey)) {
            return new Content(post.id, post.title, post.date, post.description, post.image, post.category);
        }
    });
}

function isOf(post, searchKey) {
    const upperSearchKey = searchKey.toUpperCase();
    return (post.title.toUpperCase().indexOf(upperSearchKey) !== -1
        || post.postType.toUpperCase().indexOf(upperSearchKey) !== -1
        || post.id.toUpperCase().indexOf(upperSearchKey) !== -1);
}
