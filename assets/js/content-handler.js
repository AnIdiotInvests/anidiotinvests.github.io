
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

async function loadAllContent(searchKey) {
    try {
        const [result1, result2] = await Promise.all([
            handlePostsAsyncStub(searchKey),
            handleDashboardAsyncStub()
        ]);
    } catch (error) { }
}

async function handlePostsAsyncStub(searchKey) {
    const postsJsonFile = await fetch("/posts/data/posts.json", { method: 'GET', cache: 'no-store' });
    if (postsJsonFile) {
        let jsonPosts = await marshalContentJson(postsJsonFile, searchKey);
        if (jsonPosts) {
            jsonPosts.sort(function (a, b) { return a.date - b.date; }).reverse();
            placeMostRecentPost(jsonPosts[0], '/posts');
            outputPosts(jsonPosts, '/posts', 'posts-feed');
        }
    }
}

async function handleDashboardAsyncStub() {

    const dashJsonFilez = await fetch("/dashboard/data/dashboards.json", { method: 'GET', cache: 'no-store' });
    if (!dashJsonFilez) return;

    let dfeed = await marshalContentJson(dashJsonFilez)
    if (dfeed) {
        dfeed.sort(function (a, b) { return a.date - b.date; }).reverse();
        let dashJsonLatestFile = await fetch(`/dashboard/${dfeed[0].id}`, { method: 'GET', cache: 'no-store' });
        if (dashJsonLatestFile && dashJsonLatestFile.ok) {

            dashboardJson = await dashJsonLatestFile.json();
            outputDash(dashboardJson, 'dashboard');
            // outputPosts(dfeed, '/dashboard', 'dashboard-feed');
        }
    }
}

async function marshalContentJson(jsonData, searchKey) {
    let out;
    let data = await jsonData.json();
    if (data) out = await mapPostsByAnyMatch(searchKey, data);
    return out;
}

async function updateDash(dashboardFileName) {

    const dashJsonFilez = await fetch(`/dashboard/${dashboardFileName}`, { method: 'GET', cache: 'no-store' });
    if (!dashJsonFilez) return;

    let toOut = document.getElementById(dashboardFileName);
    let feed = document.getElementById('dashboard-feed');
    let opts = feed.getElementsByTagName('div');

    for (o of opts) o.classList.remove('active');
    toOut.classList.add('active');

    const dashboard = await dashJsonFilez.json();
    outputDash(dashboard, 'dashboard');
}

async function outputAllDash() {

    const dashJsonFilez = await fetch("/dashboard/data/dashboards.json", { method: 'GET', cache: 'no-store' });
    if (!dashJsonFilez) return;

    let dfeed = await marshalContentJson(dashJsonFilez)
    if (!dfeed) return;

    dfeed.sort(function (a, b) { return a.date - b.date; }).reverse();
    let dashJsonLatestFile = await fetch(`/dashboard/${dfeed[0].id}`, { method: 'GET', cache: 'no-store' });

    if (dashJsonLatestFile && dashJsonLatestFile.ok) {
        dashboardJson = await dashJsonLatestFile.json();
        // outputDash(dashboardJson, 'dashboard');
        outputPosts(dfeed, '/dashboard', 'dashboard');
    }
}

function outputDash(dashboard, element) {

    const dashboardEle = document.getElementById(element);
    if (!dashboardEle) return;

    dashboardEle.innerHTML = "";
    const div = document.createElement('div');
    const outlook = document.createElement('p');
    const dashboardTitle = document.createElement('h2');
    const faq = document.createElement('a');
    const ul = document.createElement('ul');

    faq.textContent = "What Is This?";
    faq.href = "/faq.html#ai-dashboard-faq";

    outlook.textContent = dashboard.outlook + " (Not Financial Advice)";
    dashboardTitle.textContent = "AI Driven Dashboard Report ";
    if (dashboard.printDate) {
        dashboardTitle.textContent = dashboardTitle.textContent + new Date(dashboard.printDate).toISOString().substring(0, 10);
    }
    div.appendChild(dashboardTitle);
    div.appendChild(outlook);
    div.appendChild(faq);
    div.appendChild(ul);
    dashboardEle.appendChild(div);
    if (dashboard.content) {
        dashboard.content.forEach(cont => {
            let item = document.createElement('li');
            item.textContent = cont.description;
            ul.appendChild(item);
        });
    }
}

function placeMostRecentPost(post, location) {

    let recentPostEle = document.getElementById('recent-post');
    if (!recentPostEle || !post) return;

    let linkWrapper = document.createElement('a');
    let title = document.createElement('h2');
    let image = document.createElement('img');
    let desc = document.createElement('p');

    title.textContent = "Most Recent: " + post.title;
    desc.textContent = post.date.toISOString().substring(0, 10) + " | " + post.description + "...";
    image.src = post.image;

    linkWrapper.href = `${location}/${post.id}`;
    linkWrapper.appendChild(title);
    linkWrapper.appendChild(image);
    linkWrapper.appendChild(desc);
    recentPostEle.appendChild(linkWrapper);
}

function outputPosts(posts, location, element) {

    let postListEle = document.getElementById(element);
    if (!postListEle) return;

    postListEle.innerHTML = "";
    let feedTitle = document.createElement('h2');
    feedTitle.textContent = "Recent Feed";
    postListEle.appendChild(feedTitle);

    var max = 7;
    var count = 0;
    for (var post of posts) {
        if (!post) continue;
        count++;

        let div = document.createElement('div');
        let link = document.createElement('a');
        link.href = `${location}/${post.id}`;
        if (post.title) {
            link.textContent = post.title;
        } else {
            link.textContent = post.id;
        }
        div.appendChild(link);

        div.classList.add("post")

        if (post.description) {
            let desc = document.createElement('p')
            let descStr = post.description;
            if (post.date) {
                var dateStr = post.date.toISOString().substring(0, 10);
                descStr = dateStr + " | " + descStr;
            }
            desc.textContent = descStr;
            div.appendChild(desc);
        }
        link.setAttribute("id", post.id);
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
