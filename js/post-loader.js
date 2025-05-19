
async function loadPosts() {
    const postList = document.getElementById('posts');
    // Switch to api later...
    const posts = [
        "post1"
    ];

    if (posts === null || posts === undefined) {
        return
    }

    posts.forEach((post, index) => {
        const li = document.createElement('li');
        const link = document.createElement('a');

        link.href = `post.html?post=${post}`;
        link.textContent = `Post ${index + 1}`;

        li.appendChild(link);
        postList.appendChild(li);
    });
}
