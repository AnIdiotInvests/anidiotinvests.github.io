
class Content {
    constructor(id, title, date, description, category) {
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.description = description;
        this.category = category;
    }
}

async function loadPosts(searchKey) {
    try {
        const postsJsonFile = await fetch("/posts/data/posts.json");
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
            dashJsonFile = await fetch("/dashboard/" + startOfDayUTC.toISOString().slice(0, 10) + "-dashboard.json");
        }
        if (dashJsonFile) {
            let dashboard = await dashJsonFile.json();
            if (dashboard) outputDash(dashboard, 'dashboard', startOfDayUTC);
        }
    } catch (error) {
        console.log(error);
    }
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
        let title = document.createElement('p');
        title.textContent = cont.description;
        item.appendChild(title);
        ul.appendChild(item);
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
