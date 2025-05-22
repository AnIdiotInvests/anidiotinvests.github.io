


async function loadPostsByType(type) {
    const posts = await mapPosts(type);
    if (posts) {
        await outputPosts(posts);
    }
}

async function loadPosts() {
    const posts = await mapPosts();
    if (posts) {
        await outputPosts(posts);
    }
}

async function mapPosts(type) {

    // TODO: Switch to api later...
    const jsonFile = await fetch("/posts/prototype-posts.json");
    const postsData = await jsonFile.json();
    const posts = await postsData.map(post => {
        if (!type || (type && type === post.type)) {
            return new Post(
                post.id,
                post.title,
                post.date,
                post.type
            );
        }
    });
    return posts;
}

async function outputPosts(posts) {

    const postList = document.getElementById('posts');
    if (postList) {

        postList.innerHTML = "";

        // TODO: Optimize
        posts.sort((a, b) => a.date + b.date);
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
                postList.appendChild(li);
            }
        });
    } else {
        postList.innerHTML = "<p>No Content Found</p>";
    }

}

class Post {
    constructor(id, title, date, type) {
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.type = type;
    }
}
