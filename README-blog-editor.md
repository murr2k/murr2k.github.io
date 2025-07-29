# Blog Editor Setup

## Start the Blog Editor Server

1. Start the Node.js server:
   ```bash
   # With default credentials (development only)
   npm run start-editor
   
   # With custom credentials (recommended)
   BLOG_EDITOR_USERNAME=myuser BLOG_EDITOR_PASSWORD=mypass npm run start-editor
   ```
   Or start both Jekyll and the editor server:
   ```bash
   npm run dev
   ```

2. Access the blog editor at: http://localhost:3002/blog-editor-standalone.html

3. Login credentials:
   - Default: `admin` / `changeme` (development only)
   - Custom: Set via environment variables

## Features

- Create new blog posts with title, date, categories, and content
- Save posts to the `_posts` directory
- Publish button that commits and pushes changes to GitHub
- Basic authentication (change credentials in production!)
- List of existing posts

## Security Configuration

### Setting Custom Credentials

The blog editor uses environment variables for authentication:

```bash
# Method 1: Direct environment variables
BLOG_EDITOR_USERNAME=myusername BLOG_EDITOR_PASSWORD=mysecurepassword node blog-editor-server.js

# Method 2: Using .env file
cp .env.example .env
# Edit .env with your credentials, then:
npm install dotenv  # if not already installed
node -r dotenv/config blog-editor-server.js
```

### Security Best Practices

⚠️ **Important**: Never use default credentials in production!

- **Always** set custom credentials via environment variables
- Use HTTPS in production environments
- Consider implementing OAuth or JWT for enhanced security
- Add rate limiting and CSRF protection
- Restrict access by IP address or use a VPN
- Regularly update dependencies for security patches
- Consider using GitHub Actions for publishing instead of direct git commands

## API Endpoints

- `POST /api/save-post` - Save a new blog post
- `POST /api/publish` - Commit and push changes to GitHub
- `GET /api/list-posts` - List all blog posts
- `GET /api/get-post/:filename` - Get a specific post (for editing)

All endpoints require Basic Authentication header.