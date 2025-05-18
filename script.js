// script.js

window.onload = () => {
  const postList = document.getElementById('posts');

  // Fetch list of posts
  fetchPosts();
  
  async function fetchPosts() {
    const posts = await getMarkdownPosts();
    displayPosts(posts);
  }

  async function getMarkdownPosts() {
    // Hardcoded list of markdown files (in a real app, this would likely come from a server or API)
    const postFiles = [
      'post1'
    ];

    return posts;
  }

function displayPosts(posts) {
    posts.forEach((post, index) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `post.html?post=${post}`;
      link.textContent = `Post ${index + 1}`;
      li.appendChild(link);
      postList.appendChild(li);
    });
  }
};
