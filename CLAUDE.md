# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Murray Kopit's personal portfolio website - a static site hosted on GitHub Pages. It's built with vanilla HTML, CSS, and JavaScript without any build process or frameworks.

## Development Commands

### Traditional Setup
```bash
# Start local development server with no-cache headers
python preview.py

# Alternative: Basic Python HTTP server
python -m http.server 8000

# Start Jekyll server
jekyll serve

# Start blog editor server (requires Node.js)
npm run start-editor

# Start both Jekyll and blog editor
npm run dev
```

### Docker Setup (Recommended)
```bash
# Build Docker images
npm run docker:build

# Start all services (Jekyll on port 4000, blog editor on port 3002)
npm run docker:up

# Start services in background
npm run docker:dev

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Rebuild and restart
npm run docker:rebuild
```

## Architecture

### Main Portfolio Site
Single-page application with:
- `index.html` - Main page with all sections (hero, about, skills, projects, contact)
- `css/style.css` - All styles using CSS variables for theming
- `js/main.js` - Handles navigation, smooth scrolling, and GitHub API integration
- No build process - direct file editing and refresh

### Jekyll Blog
- `_posts/` - Blog posts in Markdown format
- `_layouts/` - Jekyll layouts (default.html, post.html)
- `blog.html` - Blog listing page
- `_config.yml` - Jekyll configuration

### Blog Editor
- `blog-editor.html` - Web-based blog editor interface
- `blog-editor-server.js` - Node.js/Express backend for blog management
- `js/blog-editor.js` - Frontend JavaScript for editor functionality
- Basic authentication (update credentials in production)

## Key Implementation Details

### CSS Architecture
- CSS variables for consistent theming (see `:root` in style.css)
- Mobile-first responsive design with breakpoints at 768px and 1024px
- Component-based organization within single CSS file

### JavaScript Features
- Dynamic navbar behavior (show/hide on scroll)
- Smooth scrolling for navigation links
- Mobile menu toggle functionality
- GitHub API integration to fetch projects dynamically
- Form submission handling

### GitHub Pages Deployment
- Deploys automatically from main branch
- Available at https://murr2k.github.io
- Custom 404 page included

## Common Tasks

### Adding new sections
1. Add section HTML to index.html
2. Add corresponding styles to style.css
3. Update navigation in index.html if needed
4. Test responsive behavior at all breakpoints

### Updating projects
Projects are fetched dynamically from GitHub API in main.js:fetchGitHubProjects(). To feature specific projects, update the hardcoded array or modify the API filtering logic.

### Testing changes
Simply edit files and refresh browser - no build step required. Use `python preview.py` for local testing with proper headers.

### Managing blog posts
1. Access blog editor at http://localhost:4000/blog-editor/ (requires blog-editor-server.js running)
2. Create new posts with title, date, categories, and content
3. Posts are saved to _posts/ directory
4. Use publish button to commit and push changes to GitHub

### Blog Security
- Default credentials: admin/changeme (MUST change in production)
- Implement proper authentication before deploying
- Consider using environment variables for sensitive data
- Add HTTPS and access restrictions

## Form Handler Integration

### Overview
The contact form is powered by a custom form handler API deployed on Fly.io. It sends emails via Gmail and requires no API keys in the public code.

### Architecture
- **API**: https://murr2k-form-handler.fly.dev
- **Public Endpoint**: `/api/public/contact` (domain-validated, no API key needed)
- **Email Provider**: Gmail with app-specific password
- **Security**: Rate limiting, spam detection, CORS protection

### Local Testing
The form works on localhost (ports 8000, 8001) without modification.

### Managing the Form Handler
```bash
# Check status
cd form-handler
fly status -a murr2k-form-handler

# View logs
fly logs -a murr2k-form-handler

# Update secrets (e.g., change email password)
fly secrets set GMAIL_APP_PASSWORD="new-password" -a murr2k-form-handler
```

### Troubleshooting Form Submissions
1. **Check logs**: `fly logs -a murr2k-form-handler`
2. **Verify health**: https://murr2k-form-handler.fly.dev/health
3. **Test from CLI**:
   ```bash
   curl -X POST "https://murr2k-form-handler.fly.dev/api/public/contact" \
     -H "Content-Type: application/json" \
     -H "Origin: https://murr2k.github.io" \
     -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
   ```

### Adding New Domains
To allow form submissions from additional domains:
1. Edit `form-handler/src/routes/public.js`
2. Add domain to `allowedDomains` array
3. Deploy: `cd form-handler && fly deploy`