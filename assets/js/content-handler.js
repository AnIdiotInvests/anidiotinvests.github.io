
class Content {
    constructor(id, title, date, description, category) {
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.description = description;
        this.category = category;
    }
}

class Dashboard {
    constructor(content, outlook) {
        this.content = content;
        this.outlook = outlook;
    }
}

async function loadPosts(searchKey) {
    try {
        const postsJsonFile = await tryFetch("/posts/data/posts.json");
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
        let dashJsonFile = await tryFetch("/dashboard/" + today + "-dashboard.json");
        if (!dashJsonFile) {
            startOfDayUTC.setDate(startOfDayUTC.getDate() - 1);
            dashJsonFile = await tryFetch("/dashboard/" + startOfDayUTC.toISOString().slice(0, 10) + "-dashboard.json");
        }
        if (dashJsonFile) {
            let jsonDash = await marshalDashboardJson(dashJsonFile, searchKey);
            if (jsonDash) outputDash(jsonDash, 'dashboard');
        }
    } catch (error) { }
}

async function tryFetch(path) {
    let response;
    try {
        response = await fetch(path);
        if (!response.ok) return null;
        return response;
    } catch (error) { }
    return null;
}

async function marshalDashboardJson(jsonData, searchKey) {
    let dashboard;
    let data = await jsonData.json();
    if (data) out = await mapPostsByAnyMatch(searchKey, data.content);
    if (out) {
        dashboard = new Dashboard(out, data.outlook);
    }
    return dashboard;
}

async function marshalContentJson(jsonData, searchKey) {
    let out;
    let data = await jsonData.json();
    if (data) out = await mapPostsByAnyMatch(searchKey, data);
    return out;
}

function outputDash(dashboard, element) {

    const dashboardEle = document.getElementById(element);
    if (!dashboardEle) return;

    const div = document.createElement('div');
    const outlook = document.createElement('p');
    const dashboardTitle = document.createElement('p');
    const ul = document.createElement('ul');

    outlook.textContent = dashboard.outlook;
    dashboardTitle.textContent = "AI Driven Dashboard Report (Not Financial Advice)";

    div.appendChild(dashboardTitle);
    div.appendChild(outlook);
    div.appendChild(ul);
    dashboardEle.appendChild(div);

    dashboard.content.forEach(board => {
        if (board) {
            let item = document.createElement('li');
            let title = document.createElement('p');
            title.textContent = board.description;
            item.appendChild(title);
            ul.appendChild(item);
        }
    });
}

function outputPosts(posts, element) {

    let postListEle = document.getElementById(element);
    if (!postListEle) return;

    postListEle.innerHTML = "";
    posts.sort(function (a, b) { return a.date - b.date; }).reverse();
    posts.forEach(post => {
        if (post) {
            div = document.createElement('div');
            link = document.createElement('a');
            date = document.createElement('p')
            link.href = `/posts/${post.id}.html`;
            link.textContent = post.title;
            if (post.date) {
                var dateStr = post.date.toLocaleDateString("en-US");
                date.textContent = dateStr;
            }
            div.classList.add("post")
            div.appendChild(link);
            div.appendChild(date);
            postListEle.appendChild(div);
        }
    });
}

function mapPostsByAnyMatch(searchKey, postJson) {
    if (searchKey) searchKey = searchKey.trim();
    return postJson.map(post => {
        if (!searchKey || isOf(post, searchKey)) {
            return new Content(post.id, post.title, post.date, post.description, post.category);
        }
    });
}

function isOf(post, searchKey) {
    const upperSearchKey = searchKey.toUpperCase();
    return (post.title.toUpperCase().indexOf(upperSearchKey) !== -1
        || post.postType.toUpperCase().indexOf(upperSearchKey) !== -1
        || post.id.toUpperCase().indexOf(upperSearchKey) !== -1);
}
