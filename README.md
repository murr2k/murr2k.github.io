# murr2k.github.io

Personal portfolio website hosted on GitHub Pages.

## 🌐 Live Site

Visit: [https://murr2k.github.io](https://murr2k.github.io)

## 🚀 Features

- **Responsive Design**: Looks great on all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Dynamic Content**: Automatically fetches latest GitHub projects
- **Fast Performance**: Optimized for speed and SEO
- **Working Contact Form**: Sends real emails via custom form handler API
- **Jekyll Blog**: Full-featured blog with Markdown support
- **Blog Editor**: Web-based interface for creating and publishing blog posts
- **Form Handler API**: Secure email delivery without exposing API keys

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables and Grid/Flexbox)
- Vanilla JavaScript
- Jekyll (for blog functionality)
- Node.js/Express (for blog editor & form handler)
- Docker & Docker Compose (for containerized development)
- GitHub Pages for hosting
- Fly.io for form handler API
- Font Awesome for icons
- Google Fonts (Inter)

## 📂 Structure

```
murr2k.github.io/
├── index.html             # Main homepage
├── blog.html              # Blog listing page
├── blog-editor.html       # Blog editor interface
├── blog-editor-server.js  # Blog editor backend
├── _posts/                # Jekyll blog posts
├── _layouts/              # Jekyll layouts
├── css/
│   └── style.css         # Main stylesheet
├── js/
│   ├── main.js           # Main site functionality
│   └── blog-editor.js    # Blog editor frontend
├── assets/
│   └── favicon.svg       # Site favicon
├── api/                   # API scripts (legacy)
└── _config.yml           # Jekyll configuration
```

## 🔧 Local Development

### 🐳 Docker Setup (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/murr2k/murr2k.github.io.git
   cd murr2k.github.io
   ```

2. Set up environment:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env to set your credentials and GitHub token
   # BLOG_EDITOR_USERNAME=your-username
   # BLOG_EDITOR_PASSWORD=your-secure-password
   # GITHUB_TOKEN=ghp_your-github-personal-access-token
   ```

3. Start with Docker:
   ```bash
   # Build and start all services
   npm run docker:up
   
   # Or run in background
   npm run docker:dev
   ```

4. Visit:
   - Main site: `http://localhost:4000`
   - Blog: `http://localhost:4000/blog/`
   - Blog editor: `http://localhost:3002/blog-editor-standalone.html`

### Traditional Setup

1. Install dependencies:
   ```bash
   # Install Jekyll (requires Ruby)
   gem install jekyll bundler
   
   # Install Node.js dependencies for blog editor
   npm install
   ```

2. Start development servers:
   ```bash
   # Option 1: Jekyll only
   jekyll serve
   
   # Option 2: Blog editor only
   npm run start-editor
   
   # Option 3: Both Jekyll and blog editor
   npm run dev
   ```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Color Scheme

- Primary: #3b82f6 (Blue)
- Secondary: #8b5cf6 (Purple)
- Accent: #ec4899 (Pink)
- Text: #1f2937 (Dark Gray)
- Background: #ffffff (White)

## 📝 Blog

The site includes a Jekyll-powered blog with a web-based editor:

- **Blog URL**: `/blog/`
- **Editor URL**: `http://localhost:3002/blog-editor-standalone.html` (requires authentication)
- **Authentication**: Set in `.env` file

### Writing Blog Posts

1. Access the blog editor at `http://localhost:3002/blog-editor-standalone.html`
2. Enter your credentials (set in `.env` file)
3. Fill in the post details (title, date, categories, content)
4. Click "Save Post" to save locally
5. Click "Publish to GitHub" to commit and push to GitHub

### Security Configuration

The blog editor requires authentication and a GitHub Personal Access Token:

1. **Create GitHub Token**:
   - Go to https://github.com/settings/tokens
   - Generate new token with `repo` scope
   - Add to `.env` file as `GITHUB_TOKEN`

2. **Set Credentials**:
   - Edit `.env` file
   - Set `BLOG_EDITOR_USERNAME` and `BLOG_EDITOR_PASSWORD`
   - Never commit `.env` to version control

### Docker Commands

```bash
npm run docker:build    # Build images
npm run docker:up       # Start services (foreground)
npm run docker:dev      # Start services (background)
npm run docker:down     # Stop services
npm run docker:logs     # View logs
npm run docker:rebuild  # Rebuild and restart
```

## 📈 Future Enhancements

- [x] Blog section with markdown support
- [ ] Dark mode toggle
- [ ] More interactive animations
- [ ] Project case studies
- [ ] Newsletter integration
- [ ] Enhanced blog editor with image uploads
- [ ] Blog post preview functionality

## 📄 License

© 2024 Murray Kopit. All rights reserved.

---

Built with ❤️ by Murray Kopit