document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'blog-data.json';
  
  // Elements
  const homeBlogList = document.getElementById('home-blog-list');
  const blogGrid = document.getElementById('blog-grid');
  const singleBlogPost = document.getElementById('single-blog-post');

  // Utility to generate a realistic date based on ID
  const generateDate = (id) => {
    const date = new Date(2026, 4, 20); // Base date: May 20, 2026
    date.setDate(date.getDate() - (id * 3)); // Subtract days based on ID
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  // Utility to get a random category
  const getCategory = (tags) => {
    return tags && tags.length > 0 ? tags[0].toUpperCase() : 'MAINTENANCE';
  };

  // 1. Fetch & Render Home Page (2 posts)
  if (homeBlogList) {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        homeBlogList.innerHTML = ''; // clear loading
        const latestPosts = data.posts.slice(0, 2);
        latestPosts.forEach(post => {
          const html = `
            <article class="blog-item">
              <div class="blog-item-img">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="#ccc"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </div>
              <div class="blog-item-info">
                <h4 class="blog-item-title"><a href="blog-post.html?id=${post.id}">${post.title}</a></h4>
                <div class="blog-item-meta">
                  <span>${generateDate(post.id)}</span>
                  <span class="meta-dot">•</span>
                  <span class="meta-cat">${getCategory(post.tags)}</span>
                </div>
              </div>
            </article>
          `;
          homeBlogList.insertAdjacentHTML('beforeend', html);
        });
      })
      .catch(err => {
        homeBlogList.innerHTML = '<p>Failed to load latest posts.</p>';
        console.error(err);
      });
  }

  // 2. Fetch & Render Blog Page (Grid of posts)
  if (blogGrid) {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        blogGrid.innerHTML = '';
        data.posts.forEach(post => {
          const preview = post.body.substring(0, 100) + '...';
          const html = `
            <article class="blog-item blog-item-card">
              <div class="blog-item-meta card-meta">
                <span>${generateDate(post.id)}</span> • <span class="meta-highlight">${getCategory(post.tags)}</span>
              </div>
              <h4 class="card-title"><a href="blog-post.html?id=${post.id}">${post.title}</a></h4>
              <p class="card-preview">${preview}</p>
              <a href="blog-post.html?id=${post.id}" class="btn btn-outline btn-read-more">Read More</a>
            </article>
          `;
          blogGrid.insertAdjacentHTML('beforeend', html);
        });
      })
      .catch(err => {
        blogGrid.innerHTML = '<p class="error-msg">Failed to load blog posts.</p>';
        console.error(err);
      });
  }

  // 3. Fetch & Render Single Blog Post Page
  if (singleBlogPost) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id') || 1); 

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const post = data.posts.find(p => p.id === postId);
        if (!post) throw new Error("Post not found");
        
        // Format body text by splitting into paragraphs for better readability
        const paragraphs = post.body.split('\\n').map(p => {
          if (p.trim() === '') return '';
          return `<p>${p}</p>`;
        }).join('');
        
        singleBlogPost.innerHTML = `
          <span class="article-category">${getCategory(post.tags)}</span>
          <h1 class="article-title">${post.title}</h1>
          <div class="article-meta">Published on ${generateDate(post.id)}</div>
          <div class="article-content">
            ${paragraphs}
            
            <div class="article-footer">
              <a href="blog.html" class="btn btn-outline">← Back to Blog</a>
            </div>
          </div>
        `;
      })
      .catch(err => {
        singleBlogPost.innerHTML = `
          <div class="article-error">
            <h2>Post Not Found</h2>
            <p>Sorry, we couldn't load this article.</p>
            <a href="blog.html" class="btn btn-primary btn-back">Back to Blog</a>
          </div>
        `;
        console.error(err);
      });
  }
});
