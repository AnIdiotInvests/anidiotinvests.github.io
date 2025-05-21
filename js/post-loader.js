async function loadPosts() {
    // Switch to api later...
    const postList = document.getElementById('posts');
    const postMap = new Map([
        ["post1", "Am I A BlackRock Funded Tesla Killbot?"],
        ["post2", "Observing Solana Meme Coins In The Wild"]
    ]);
    for (const [key, value] of postMap) {
        const li = document.createElement('li');
        const link = document.createElement('a');

        link.href = `post.html?post=${key}`;
        link.textContent = value;

        li.appendChild(link);
        postList.appendChild(li);
    }
}
