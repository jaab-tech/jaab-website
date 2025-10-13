# Blog System Documentation

## Overview

The JAAB website now includes a fully functional blog system with the following features:

- **Markdown-based posts** - Write blog entries in Markdown format
- **Spanish primary language** - All posts are written in Spanish initially
- **Google Translate integration** - Automatic translation options to English and Portuguese
- **Homepage carousel** - Rotating blog preview cards on the homepage
- **Category and tag filtering** - Advanced filtering on the blog listing page
- **SEO-friendly** - Proper metadata, structured URLs, and semantic HTML

---

## File Structure

```
_posts/                          # Blog posts directory
  └── 2025-10-13-valor-patrimonial.md

_layouts/
  └── post.html                  # Individual blog post layout

_includes/
  └── homepage.html              # Homepage template (includes blog preview section)

blog.html                        # Blog listing page with filters

assets/
  ├── css/style.scss             # Blog styling (lines 2511-3225)
  ├── js/main.js                 # Blog carousel JavaScript (lines 365-458)
  └── images/blog/               # Blog post images
      └── FACHADA_EL_GLOBO.jpg

_config.yml                      # Jekyll configuration (blog setup)
```

---

## Creating a New Blog Post

### 1. File Naming Convention

Blog posts must follow Jekyll's naming convention:

```
YYYY-MM-DD-post-slug.md
```

**Example:** `2025-10-13-valor-patrimonial.md`

### 2. Post Front Matter

Every blog post requires YAML front matter with the following fields:

```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD
author: "Author Name"
categories: [category1, category2]
tags: [tag1, tag2, tag3]
image: /assets/images/blog/image-name.jpg
excerpt: "Brief summary of the post (shown in cards and listings)"
lang: es
---
```

**Required fields:**
- `layout` - Must be "post"
- `title` - Post title
- `date` - Publication date
- `categories` - Array of categories (used for filtering)
- `tags` - Array of tags (used for filtering)
- `image` - Path to featured image
- `excerpt` - Summary text for cards/listings
- `lang` - Language code (default: "es")

**Optional fields:**
- `author` - Author name

### 3. Post Content

Write the post content in Markdown below the front matter:

```markdown
---
layout: post
title: "My Post Title"
date: 2025-10-13
...
---

Your markdown content here...

## Headings

**Bold text** and *italic text*

> Blockquotes for emphasis

- Bullet lists
- Another item

[Links](https://example.com)
```

### 4. Adding Images

1. Place images in `assets/images/blog/`
2. Reference in front matter: `image: /assets/images/blog/your-image.jpg`
3. Use in content: `![Alt text](/assets/images/blog/your-image.jpg)`

---

## Blog Features

### Homepage Blog Preview Carousel

**Location:** Homepage, between "Nosotros" and "Contacto" sections

**Features:**
- Shows the 3 most recent blog posts
- Auto-rotates every 5 seconds
- Manual navigation with prev/next arrows
- Dot indicators for each post
- Pause on hover
- Responsive design

**Customization:**
- Change number of posts: Edit line 165 in `_includes/homepage.html`
  ```liquid
  {% assign recent_posts = site.posts | limit: 3 %}
  ```
- Change rotation speed: Edit line 411 in `assets/js/main.js`
  ```javascript
  autoRotateInterval = setInterval(nextCard, 5000); // milliseconds
  ```

### Blog Listing Page

**URL:** `/blog/`

**Features:**
- Grid layout of all blog posts
- Filter by categories
- Filter by tags
- Combined filtering (category + tag)
- Deep linking support (URL hash navigation)
- Responsive grid layout

**How filtering works:**
1. Click a category button to filter by category
2. Click a tag button to filter by tag
3. Both filters work together (AND logic)
4. "Todas" button resets filters

**Deep linking:**
- Link to specific category: `/blog/#technology`
- Link to specific tag: `/blog/#entrepreneurship`

### Individual Blog Post

**URL Pattern:** `/blog/YYYY/MM/DD/post-slug/`

**Features:**
- Featured image
- Post metadata (date, author, read time)
- Category badges (clickable, link to blog filtered)
- Google Translate links (EN and PT)
- Full post content with Markdown formatting
- Tag list at bottom
- Navigation buttons (back to blog, contact us)

**Google Translate Integration:**
- Translation links use Google Translate's URL API
- Opens in new tab
- Automatically detects source language (Spanish)
- Provides translations to English and Portuguese

---

## Styling

### CSS Architecture

All blog-related styles are in `assets/css/style.scss` (lines 2511-3225)

**Style sections:**
1. **Blog Preview Section** (Homepage carousel)
2. **Carousel Controls** (Navigation arrows and dots)
3. **Blog Listing Page** (Filters and grid)
4. **Blog Card Styles** (Cards in grid)
5. **Individual Blog Post** (Post layout and content)
6. **Responsive Styles** (Mobile adaptations)

### Color Variables Used

```scss
--color-primary: #8B5CF6          // Primary purple
--color-primary-light: rgba(139, 92, 246, 0.1)
--color-secondary: #3B82F6         // Secondary blue
--color-text: #1F2937              // Dark text
--color-text-light: #6B7280        // Light gray text
--color-border: #E5E7EB            // Border color
--color-bg: #F9FAFB                // Background
```

### Customizing Styles

**Change card appearance:**
```scss
.blog-card {
  border-radius: 12px;           // Rounded corners
  box-shadow: 0 2px 8px ...;     // Shadow
}
```

**Change carousel timing:**
```scss
.blog-preview-card {
  transition: opacity 0.5s ease, transform 0.5s ease;  // Animation speed
}
```

---

## JavaScript Functionality

### Carousel Code

Located in `assets/js/main.js` (lines 365-458)

**Key functions:**
- `showCard(index)` - Display specific card
- `nextCard()` - Advance to next card
- `prevCard()` - Go to previous card
- `startAutoRotate()` - Begin auto-rotation
- `stopAutoRotate()` - Pause auto-rotation

### Blog Filtering Code

Located in `blog.html` (lines 132-177)

**Key functions:**
- `filterPosts()` - Apply active filters to posts
- Category/tag click handlers - Update active filters
- `handleHash()` - Deep linking support

---

## Configuration

### Jekyll Configuration (`_config.yml`)

```yaml
collections:
  posts:
    output: true
    permalink: /blog/:title/

defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      lang: "es"
```

**Explanation:**
- `collections.posts.output: true` - Generate HTML for each post
- `permalink: /blog/:title/` - Simple URL structure using only the post title slug
- `defaults` - Automatically apply layout and language to all posts

---

## SEO Considerations

### Post URLs

Posts use a simple, clean permalink structure based on the post title:
```
/blog/valor-patrimonial/
```

**Benefits:**
- Clean, memorable URLs
- SEO-friendly slugs
- Easy to share and type
- Title-based organization

### Metadata

Each post includes:
- `<title>` tag (from post title)
- `<meta name="description">` (from excerpt)
- Structured content with semantic HTML
- Open Graph tags (via default layout)

### Google Translate

Translation links open in new tabs with:
- `target="_blank"` - New tab
- `rel="noopener noreferrer"` - Security and privacy

---

## Content Guidelines

### Writing Posts

1. **Title:** Clear, descriptive, 5-10 words
2. **Excerpt:** 1-2 sentences, ~150 characters
3. **Categories:** 1-3 broad topics (e.g., technology, leadership)
4. **Tags:** 3-6 specific keywords
5. **Image:** High quality, 1200x630px recommended
6. **Content:** 500-2000 words, use headings and formatting

### Image Guidelines

- **Format:** JPG (preferred) or WebP for photos, PNG for graphics with transparency
- **Size:** Optimize for web (<300KB for featured images, <150KB for in-content)
- **Quality:** 85% JPEG quality is optimal for most photos
- **Dimensions:** Max 1600px width (featured), 800px width (in-content)
- **Alt text:** Always include descriptive alt text
- **Optimization:** Use ImageMagick or online tools to compress images before uploading

**Optimization command:**
```bash
convert original.png -quality 85 -strip optimized.jpg
convert original.png -quality 85 -define webp:lossless=false optimized.webp
```

### Categories vs Tags

**Categories:**
- Broad content buckets
- Examples: technology, leadership, business
- Use 1-3 per post
- Appear as prominent badges

**Tags:**
- Specific keywords
- Examples: cobol, modernization, ebs, career
- Use 3-6 per post
- Smaller, less prominent

---

## Testing Checklist

### Homepage Blog Carousel

- [ ] 3 most recent posts display
- [ ] Auto-rotation works (5 second intervals)
- [ ] Previous/Next arrows work
- [ ] Dot indicators work
- [ ] Hover pauses rotation
- [ ] Links navigate to correct posts
- [ ] Responsive on mobile

### Blog Listing Page (`/blog/`)

- [ ] All posts display in grid
- [ ] Category filter works
- [ ] Tag filter works
- [ ] Combined filters work (category + tag)
- [ ] "Todas" resets filters
- [ ] Deep linking works (`/blog/#category`)
- [ ] No results message shows when no matches
- [ ] Responsive grid on mobile

### Individual Blog Post

- [ ] Featured image displays correctly
- [ ] Metadata shows (date, author, read time)
- [ ] Title and excerpt display
- [ ] Categories are clickable and link to blog
- [ ] Google Translate links work (EN and PT)
- [ ] Content renders properly (Markdown → HTML)
- [ ] Blockquotes styled correctly
- [ ] Code blocks styled correctly
- [ ] Tags display at bottom
- [ ] Navigation buttons work
- [ ] Responsive on mobile

### Cross-Browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Maintenance

### Regular Tasks

1. **Backup posts:** `_posts/` directory contains all content
2. **Optimize images:** Use tools like ImageOptim or TinyPNG
3. **Review analytics:** Track popular posts and categories
4. **Update categories/tags:** Keep taxonomy consistent

### Adding Features

**Ideas for future enhancements:**
- Related posts section
- Post search functionality
- Social sharing buttons
- Comments system (Disqus, etc.)
- RSS feed customization
- Author pages
- Series/collections of related posts

---

## Troubleshooting

### Post Not Showing Up

1. Check filename follows `YYYY-MM-DD-slug.md` format
2. Verify front matter is valid YAML
3. Ensure `layout: post` is set
4. Check date isn't in the future
5. Rebuild Jekyll: `bundle exec jekyll build --verbose`

### Carousel Not Working

1. Check JavaScript console for errors
2. Verify at least 1 post exists
3. Ensure `main.js` is loaded
4. Check browser console for: "Blog preview carousel functionality"

### Filters Not Working

1. Verify categories/tags in front matter are arrays
2. Check JavaScript console for errors
3. Ensure blog.html has filter script
4. Test with multiple posts in different categories

### Images Not Loading

1. Verify image path is correct: `/assets/images/blog/filename.jpg`
2. Check file actually exists in `assets/images/blog/`
3. Ensure proper file permissions
4. Check image isn't corrupt

---

## Quick Reference

### File Locations

| Item | Location |
|------|----------|
| Blog posts | `_posts/YYYY-MM-DD-slug.md` |
| Post layout | `_layouts/post.html` |
| Blog listing | `blog.html` |
| Blog images | `assets/images/blog/` |
| Blog CSS | `assets/css/style.scss` (lines 2511-3225) |
| Blog JS | `assets/js/main.js` (lines 365-458) |

### Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| Blog listing | `/blog/` | All posts with filters |
| Individual post | `/blog/post-slug/` | Single post view |
| Category filter | `/blog/#category-name` | Deep link to category |
| Tag filter | `/blog/#tag-name` | Deep link to tag |

### Command Reference

```bash
# Start development server
bundle exec jekyll serve --host 0.0.0.0 --livereload

# Build for production
bundle exec jekyll build

# Check for errors
bundle exec jekyll build --verbose

# Clean build files
bundle exec jekyll clean
```

---

## Example Post Template

```markdown
---
layout: post
title: "Your Compelling Title Here"
date: 2025-10-13
author: "Your Name"
categories: [technology, business]
tags: [modernization, legacy-systems, transformation]
image: /assets/images/blog/your-image.jpg
excerpt: "A brief, engaging summary of your post that entices readers to click and read more."
lang: es
---

Your opening paragraph should hook the reader immediately...

## First Major Section

Content with **bold** and *italic* text.

> Important quote or callout

## Second Major Section

More great content with:

- Bullet points
- For clarity
- And readability

### Subsection

[Links to relevant resources](https://example.com)

## Conclusion

Wrap up your thoughts and provide a call to action.
```

---

*Last updated: October 13, 2025*

