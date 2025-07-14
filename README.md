# murr2k.github.io

Personal portfolio website hosted on GitHub Pages.

## 🌐 Live Site

Visit: [https://murr2k.github.io](https://murr2k.github.io)

## 🚀 Features

- **Responsive Design**: Looks great on all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Dynamic Content**: Automatically fetches latest GitHub projects
- **Fast Performance**: Optimized for speed and SEO
- **Contact Form**: Easy way to get in touch
- **Jekyll Blog**: Full-featured blog with Markdown support
- **Blog Editor**: Web-based interface for creating and publishing blog posts

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables and Grid/Flexbox)
- Vanilla JavaScript
- Jekyll (for blog functionality)
- Node.js/Express (for blog editor)
- GitHub Pages for hosting
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

1. Clone the repository:
   ```bash
   git clone https://github.com/murr2k/murr2k.github.io.git
   cd murr2k.github.io
   ```

2. Install dependencies:
   ```bash
   # Install Jekyll (requires Ruby)
   gem install jekyll bundler
   
   # Install Node.js dependencies for blog editor
   npm install
   ```

3. Start development servers:
   ```bash
   # Option 1: Jekyll only
   jekyll serve
   
   # Option 2: Blog editor only
   npm run start-editor
   
   # Option 3: Both Jekyll and blog editor
   npm run dev
   ```

4. Visit:
   - Main site: `http://localhost:4000`
   - Blog: `http://localhost:4000/blog/`
   - Blog editor: `http://localhost:4000/blog-editor/` (auth: admin/changeme)

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
- **Editor URL**: `/blog-editor/` (requires authentication)
- **Default credentials**: admin/changeme (⚠️ Change in production!)

### Writing Blog Posts

1. Access the blog editor at `/blog-editor/`
2. Fill in the post details (title, date, categories, content)
3. Click "Save Post" to save locally
4. Click "Publish to Live Site" to commit and push to GitHub

### Security Note

The blog editor uses basic authentication. For production use:
- Change default credentials
- Use environment variables for sensitive data
- Implement proper authentication (OAuth, JWT)
- Add HTTPS and access restrictions

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