async function loadPosts() {

    // Switch to api later...
    const postList = document.getElementById('posts');
    const jsonFile = await fetch("/posts/prototype-posts.json");
    const postsData = await jsonFile.json();

    const posts = postsData.map(post => new Post(
        post.id,
        post.title,
        post.date
    ));

    posts.forEach(post => {

        const li = document.createElement('li');
        const link = document.createElement('a');
        const date = document.createElement('p')

        link.href = `post.html?post=${post.id}`;
        link.textContent = post.title;
        date.textContent = post.date;

        li.classList.add('flexium');

        li.appendChild(link);
        li.appendChild(date);
        postList.appendChild(li);

    });
}

class Post {
    constructor(id, title, date) {
        this.id = id;
        this.title = title;
        this.date = date;
    }
}
