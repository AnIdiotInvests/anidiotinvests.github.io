
class Post {
    constructor(id, title, date, postType) {
        this.id = id;
        this.title = title;
        if (date) this.date = new Date(date);
        this.postType = postType;
    }
}

class PostHandler {

    constructor(outputId, postJson) {
        this.outputId = outputId;
        this.postJson = postJson;
    }

    loadPostsByType(searchKey) {
        if (!searchKey) return
        try {
            const posts = this.#mapPostsByType(searchKey.trim());
            if (posts) this.#outputPosts(posts);
        } catch (error) { }
    }

    loadPosts(searchKey) {
        try {
            const posts = this.#mapPostsByAnyMatch(searchKey);
            if (posts) this.#outputPosts(posts);
        } catch (error) { }
    }

    #outputPosts(posts) {
        const postListEle = document.getElementById(this.outputId);
        if (!postListEle) {
            return;
        }

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
                    var dateStr = post.date.toLocaleDateString("en-US");
                    date.textContent = dateStr;
                }
                li.appendChild(link);
                li.appendChild(date);
                postListEle.appendChild(li);
            }
        });
    }

    #mapPostsByAnyMatch(searchKey) {
        if (searchKey) searchKey = searchKey.trim();
        return this.postJson.map(post => {
            if (!searchKey || this.#isOf(post, searchKey)) {
                return new Post(post.id, post.title, post.date, post.postType);
            }
        });
    }

    #mapPostsByType(searchKey) {
        const upperSearchKey = searchKey.toUpperCase();
        return this.postJson.map(post => {
            if (upperSearchKey === post.postType.toUpperCase().trim()) {
                return new Post(post.id, post.title, post.date, post.postType);
            }
        });
    }

    #isOf(post, searchKey) {
        const upperSearchKey = searchKey.toUpperCase();
        return (post.title.toUpperCase().indexOf(upperSearchKey) !== -1
            || post.postType.toUpperCase().indexOf(upperSearchKey) !== -1
            || post.id.toUpperCase().indexOf(upperSearchKey) !== -1);
    }
}

export { PostHandler };
