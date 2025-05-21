async function loadPosts() {

    // TODO: Switch to api later...
    const postList = document.getElementById('posts');

    const jsonFile = await fetch("/posts/prototype-posts.json");
    const postsData = await jsonFile.json();
    const posts = postsData.map(post => new Post(
        post.id,
        post.title,
        post.date,
        post.type
    ));

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
}

class Post {
    constructor(id, title, date, type) {
        this.id = id;
        this.title = title;
        this.date = new Date(date);
        this.type = type;
    }
}
