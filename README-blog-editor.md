# Blog Editor Setup

## Start the Blog Editor Server

1. Start the Node.js server:
   ```bash
   npm run start-editor
   ```
   Or start both Jekyll and the editor server:
   ```bash
   npm run dev
   ```

2. Access the blog editor at: http://localhost:4000/blog-editor/

3. Login with default credentials:
   - Username: `admin`
   - Password: `changeme`

## Features

- Create new blog posts with title, date, categories, and content
- Save posts to the `_posts` directory
- Publish button that commits and pushes changes to GitHub
- Basic authentication (change credentials in production!)
- List of existing posts

## Security Notes

⚠️ **Important**: The current setup uses basic authentication with hardcoded credentials. For production use:
- Use environment variables for credentials
- Implement proper authentication (OAuth, JWT, etc.)
- Add HTTPS
- Restrict access by IP or use a VPN
- Consider using GitHub Actions for publishing instead of direct git commands

## API Endpoints

- `POST /api/save-post` - Save a new blog post
- `POST /api/publish` - Commit and push changes to GitHub
- `GET /api/list-posts` - List all blog posts
- `GET /api/get-post/:filename` - Get a specific post (for editing)

All endpoints require Basic Authentication header.