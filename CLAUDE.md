# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Murray Kopit's personal portfolio website - a static site hosted on GitHub Pages. It's built with vanilla HTML, CSS, and JavaScript without any build process or frameworks.

## Development Commands

```bash
# Start local development server with no-cache headers
python preview.py

# Alternative: Basic Python HTTP server
python -m http.server 8000
```

## Architecture

Single-page application with:
- `index.html` - Main page with all sections (hero, about, skills, projects, contact)
- `css/style.css` - All styles using CSS variables for theming
- `js/main.js` - Handles navigation, smooth scrolling, and GitHub API integration
- No build process - direct file editing and refresh

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