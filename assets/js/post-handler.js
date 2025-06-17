
class Post {
    constructor(id, title, date, postType) {
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.postType = postType;
    }
}

async function loadPosts(searchKey) {
    try {
        const postsJsonFile = await fetch("/posts/data/posts.json");
        const dashJsonFile = await fetch("/posts/data/dashboard.json");

        let jsonPosts
        if (postsJsonFile) jsonPosts = await postsJsonFile.json();

        let jsonDash
        if (dashJsonFile) jsonDash = await dashJsonFile.json();

        const dashboard = mapToDashboard(jsonDash)
        const posts = mapPostsByAnyMatch(searchKey, jsonPosts);

        if (posts) outputPosts(posts);
        if (dashboard) outputDash(dashboard);

    } catch (error) {
        console.log(error);
    }
}

function mapToDashboard(jsonDash) {
    return jsonDash;
}

function outputDash(dashboard) {
    let dashboardEle = document.getElementById('dashboard');
    if (!dashboardEle) return;

    const div = document.createElement('div');
    const date = document.createElement('p');

    date.textContent = new Date(new Date().setHours(0, 0, 0, 0)).toDateString()

    // div.classList.add("d")
    div.appendChild(date);
    dashboardEle.appendChild(div);

}

function outputPosts(posts) {
    let postListEle = document.getElementById('posts');
    if (!postListEle) return;

    postListEle.innerHTML = "";
    posts.sort(function (a, b) { return a.date - b.date; }).reverse();
    posts.forEach(post => {
        if (post) {
            const div = document.createElement('div');
            const link = document.createElement('a');
            const date = document.createElement('p')
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
            return new Post(post.id, post.title, post.date, post.postType);
        }
    });
}

function isOf(post, searchKey) {
    const upperSearchKey = searchKey.toUpperCase();
    return (post.title.toUpperCase().indexOf(upperSearchKey) !== -1
        || post.postType.toUpperCase().indexOf(upperSearchKey) !== -1
        || post.id.toUpperCase().indexOf(upperSearchKey) !== -1);
}
