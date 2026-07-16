const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');

const headMatch = index.match(/[\s\S]*?<!-- Hero Section -->/);
const header = headMatch ? headMatch[0].replace('<!-- Hero Section -->', '') : '';

const footerMatch = index.match(/<footer class="main-footer"[\s\S]*/);
const footer = footerMatch ? footerMatch[0] : '';

const blogHtml = header + `
  <section class="blog-page-section" style="padding: 120px 0 80px; background-color: #f8fafc;">
    <div class="section-container">
      <div class="section-header text-center" style="margin-bottom: 60px;">
        <span class="section-tag">OUR BLOG</span>
        <h2 class="section-title">Latest News & Insights</h2>
        <p class="section-desc">Stay updated with the latest tips, tricks, and industry news.</p>
      </div>
      <div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px;">
        <article class="blog-item" style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <h4 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;"><a href="blog-post.html" style="color: inherit; text-decoration: none;">5 Tips to Maintain Your AC for Longer Life</a></h4>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">Regular maintenance is key to ensuring your AC runs efficiently and lasts longer. Here are 5 essential tips...</p>
          <a href="blog-post.html" class="btn btn-outline" style="padding: 8px 16px; font-size: 14px;">Read More</a>
        </article>
        <article class="blog-item" style="background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <h4 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;"><a href="blog-post.html" style="color: inherit; text-decoration: none;">Why Regular Maintenance Saves You Money</a></h4>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">Skipping maintenance might seem like a good way to save money, but it actually costs you more in the long run...</p>
          <a href="blog-post.html" class="btn btn-outline" style="padding: 8px 16px; font-size: 14px;">Read More</a>
        </article>
      </div>
    </div>
  </section>
` + footer;

fs.writeFileSync('blog.html', blogHtml);

const blogPostHtml = header + `
  <section class="blog-post-section" style="padding: 120px 0 80px; background-color: #f8fafc;">
    <div class="section-container" style="max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <span class="section-tag" style="color: var(--accent-green); font-weight: 700; font-size: 14px;">Tips & Tricks</span>
      <h1 class="section-title" style="margin-bottom: 20px; margin-top: 10px;">5 Tips to Maintain Your AC for Longer Life</h1>
      <div style="color: #64748b; font-size: 14px; margin-bottom: 30px;">Published on May 10, 2026</div>
      <div class="post-content" style="color: #334155; line-height: 1.8; font-size: 16px;">
        <p style="margin-bottom: 16px;">Regular maintenance is key to ensuring your AC runs efficiently and lasts longer. Here are 5 essential tips to keep your AC in top condition:</p>
        <ol style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 8px;"><strong>Clean or replace filters regularly:</strong> Clogged filters restrict airflow and reduce efficiency.</li>
          <li style="margin-bottom: 8px;"><strong>Keep the coils clean:</strong> Dirty coils reduce the system's ability to absorb heat.</li>
          <li style="margin-bottom: 8px;"><strong>Check the condensate drain:</strong> A clogged drain can cause water damage and affect humidity levels.</li>
          <li style="margin-bottom: 8px;"><strong>Inspect the fins:</strong> Bent fins can block airflow through the coil.</li>
          <li style="margin-bottom: 8px;"><strong>Schedule professional maintenance:</strong> A professional tune-up ensures all components are working correctly.</li>
        </ol>
        <p>By following these simple steps, you can extend the life of your AC and save on energy bills.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <a href="blog.html" class="btn btn-outline">← Back to Blog</a>
        </div>
      </div>
    </div>
  </section>
` + footer;

fs.writeFileSync('blog-post.html', blogPostHtml);
console.log('Created blog.html and blog-post.html');
