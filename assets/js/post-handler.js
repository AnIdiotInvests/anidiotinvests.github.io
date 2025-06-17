
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
        const jsonFile = await fetch("/posts/data/posts.json");
        const jsonPosts = await jsonFile.json();
        console.log(jsonPosts);
        const posts = mapPostsByAnyMatch(searchKey, jsonPosts);
        if (posts) outputPosts(posts);
    } catch (error) {
        console.log(error)
    }
}

function outputPosts(posts) {
    let postListEle = document.getElementById('posts');

    if (!postListEle) {
        return;
    }

    postListEle.innerHTML = "";
    // TODO: Optimize
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
