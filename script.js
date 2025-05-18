// script.js

window.onload = () => {
  
  const postList = document.getElementById('posts');

  fetchPosts();
  
  async function fetchPosts() {
    const posts = [
      "post1",
      "post2",
      "post3"
    ];

    if (Array.isArray(posts)) {
      displayPosts(posts);
    }
  }

  function displayPosts(posts) {
  
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

};
