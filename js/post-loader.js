


async function loadPostsByType(searchKey) {
    const posts = await mapPosts(searchKey);
    if (posts) await outputPosts(posts);
}

async function loadPosts() {
    const posts = await mapPosts();
    if (posts) await outputPosts(posts);
}

async function mapPosts(searchKey) {
    // TODO: Switch to api vs static condition later...
    const jsonFile = await fetch("/posts/posts-prototype.json");
    try {
        const postsData = await jsonFile.json();
        return await postsData.map(post => {
            if (!searchKey || (searchKey && searchKey === post.postType)) {
                return new Post(
                    post.id,
                    post.title,
                    post.date,
                    post.postType
                );
            }
        });
    } catch {
        console.log("No Content Found");
    }
}

async function outputPosts(posts) {

    const postListEle = document.getElementById('posts');
    if (postListEle) {

        postListEle.innerHTML = "";

        // TODO: Optimize
        // posts.sort((a, b) => a.date - b.date);
        posts.sort().reverse();
        posts.forEach(post => {
            if (post) {
                const li = document.createElement('li');
                const link = document.createElement('a');
                const date = document.createElement('p')

                link.href = `post.html?post=${post.id}`;
                link.textContent = post.title;

                if (post.date) {
                    dateStr = post.date.toLocaleDateString("en-US");
                    date.textContent = dateStr;
                }

                li.appendChild(link);
                li.appendChild(date);
                postListEle.appendChild(li);
            }
        });
    } else {
        postListEle.innerHTML = "<p>No Content Found</p>";
    }
}

class Post {
    constructor(id, title, date, postType) {
        this.id = id;
        this.title = title;
        if (date) {
            this.date = new Date(date);
        }
        this.postType = postType;
    }
}
