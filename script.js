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
      'posts/post1.md',
      'posts/post2.md',
      'posts/post3.md'
    ];

    // Fetch and parse all posts
    const posts = await Promise.all(postFiles.map(async (file) => {
      const response = await fetch(file);
      const markdownText = await response.text();
      const htmlContent = marked(markdownText); // Convert Markdown to HTML
      return htmlContent;
    }));

    return posts;
  }

  function displayPosts(posts) {
    posts.forEach((postContent, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>Post ${index + 1}</h3>
        <div class="post-content">${postContent}</div>
      `;
      postList.appendChild(li);
    });
  }
};
