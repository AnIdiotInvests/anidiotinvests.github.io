
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
        const postsJsonFile = await fetch("/posts/data/posts.json", { method: 'GET', cache: 'no-store' });
        if (postsJsonFile) {
            let jsonPosts = await marshalContentJson(postsJsonFile, searchKey);
            if (jsonPosts) {
                jsonPosts.sort(function (a, b) { return a.date - b.date; }).reverse();
                placeMostRecentPost(jsonPosts[0], '/posts');
                outputPosts(jsonPosts, '/posts', 'posts');
            }
        }
        const dashJsonFilez = await fetch("/dashboard/data/dashboards.json", { method: 'GET', cache: 'no-store' });
        if (!dashJsonFilez) return;
        let dfeed = await marshalContentJson(dashJsonFilez)
        if (dfeed) {
            dfeed.sort(function (a, b) { return a.date - b.date; }).reverse();
            let dashJsonFilez = await fetch(`/dashboard/${dfeed[0].id}`, { method: 'GET', cache: 'no-store' });
            if (dashJsonFilez && dashJsonFilez.ok) {
                dashboardJson = await dashJsonFilez.json();
                outputDash(dashboardJson, 'dashboard');
                outputPosts(dfeed, '/dashboard', 'dashboard-feed');
            }
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

function outputDash(dashboard, element) {

    const dashboardEle = document.getElementById(element);
    if (!dashboardEle) return;

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
    dashboard.content.forEach(cont => {
        let item = document.createElement('li');
        item.textContent = cont.description;
        ul.appendChild(item);
    });
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

    linkWrapper.href = `${location}/${post.id}.html`;
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
        div.classList.add("post")
        div.appendChild(link);

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
