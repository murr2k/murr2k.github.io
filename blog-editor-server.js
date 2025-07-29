const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Basic authentication middleware
const authenticate = basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  // Use environment variables for credentials, with defaults for development
  const BLOG_EDITOR_USERNAME = process.env.BLOG_EDITOR_USERNAME || 'admin';
  const BLOG_EDITOR_PASSWORD = process.env.BLOG_EDITOR_PASSWORD || 'changeme';
  
  if (username === BLOG_EDITOR_USERNAME && password === BLOG_EDITOR_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Save post endpoint
app.post('/api/save-post', basicAuth, async (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing filename or content' });
    }
    
    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
    const filePath = path.join(__dirname, '_posts', sanitizedFilename);
    
    // Ensure _posts directory exists
    await fs.mkdir(path.join(__dirname, '_posts'), { recursive: true });
    
    // Write the file
    await fs.writeFile(filePath, content, 'utf8');
    
    res.json({ success: true, message: 'Post saved successfully' });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get post endpoint
app.get('/api/get-post/:filename', basicAuth, async (req, res) => {
  try {
    const { filename } = req.params;
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
    const filePath = path.join(__dirname, '_posts', sanitizedFilename);
    
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ success: true, content });
  } catch (error) {
    console.error('Error reading post:', error);
    res.status(404).json({ error: 'Post not found' });
  }
});

// List posts endpoint (original)
app.get('/api/list-posts', basicAuth, async (req, res) => {
  try {
    const postsDir = path.join(__dirname, '_posts');
    const files = await fs.readdir(postsDir);
    const posts = files.filter(file => file.endsWith('.md'));
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error listing posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all posts with metadata
app.get('/api/posts', authenticate, async (req, res) => {
  try {
    const postsDir = path.join(__dirname, '_posts');
    await fs.mkdir(postsDir, { recursive: true }); // Ensure directory exists
    
    const files = await fs.readdir(postsDir);
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
          const lines = content.split('\n');
          
          // Extract front matter
          let title = '';
          let date = '';
          let categories = '';
          
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('title:')) {
              title = lines[i].replace('title:', '').trim().replace(/['"]/g, '');
            }
            if (lines[i].startsWith('date:')) {
              date = lines[i].replace('date:', '').trim();
            }
            if (lines[i].startsWith('categories:')) {
              categories = lines[i].replace('categories:', '').trim();
            }
            if (lines[i] === '---' && i > 0) break;
          }
          
          return { filename: file, title, date, categories };
        })
    );
    
    res.json(posts.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (error) {
    console.error('Error listing posts:', error);
    res.status(500).send('Failed to list posts');
  }
});

// Get a specific post
app.get('/api/posts/:filename', authenticate, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '_posts', filename);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Parse front matter
    let inFrontMatter = false;
    let frontMatterEnd = 0;
    let title = '', date = '', categories = '', excerpt = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === '---') {
        if (!inFrontMatter) {
          inFrontMatter = true;
        } else {
          frontMatterEnd = i + 1;
          break;
        }
      } else if (inFrontMatter) {
        if (lines[i].startsWith('title:')) {
          title = lines[i].replace('title:', '').trim().replace(/['"]/g, '');
        } else if (lines[i].startsWith('date:')) {
          date = lines[i].replace('date:', '').trim();
        } else if (lines[i].startsWith('categories:')) {
          categories = lines[i].replace('categories:', '').trim()
            .replace(/[\[\]]/g, '').split(',').map(c => c.trim()).join(', ');
        } else if (lines[i].startsWith('excerpt:')) {
          excerpt = lines[i].replace('excerpt:', '').trim().replace(/['"]/g, '');
        }
      }
    }
    
    const postContent = lines.slice(frontMatterEnd).join('\n').trim();
    
    res.json({
      title,
      date,
      categories,
      excerpt,
      content: postContent
    });
  } catch (error) {
    console.error('Error reading post:', error);
    res.status(404).send('Post not found');
  }
});

// Publish endpoint
app.post('/api/publish', basicAuth, async (req, res) => {
  try {
    // Git add all changes
    await execPromise('git add .');
    
    // Try to commit
    const commitMessage = req.body.message || 'Update blog content';
    let commitMade = false;
    
    try {
      await execPromise(`git commit -m "${commitMessage}"`);
      commitMade = true;
    } catch (commitError) {
      // If nothing to commit, that's okay - we might still have unpushed commits
      if (!commitError.message.includes('nothing to commit')) {
        throw commitError;
      }
    }
    
    // Check if there are unpushed commits
    const { stdout: unpushedCommits } = await execPromise('git rev-list HEAD...origin/main --count');
    const unpushedCount = parseInt(unpushedCommits.trim()) || 0;
    
    if (commitMade || unpushedCount > 0) {
      // Git push with authentication
      const githubToken = process.env.GITHUB_TOKEN;
      let pushCommand = 'git push origin main';
      
      if (githubToken) {
        // Get the remote URL
        const { stdout: remoteUrl } = await execPromise('git remote get-url origin');
        const url = remoteUrl.trim();
        
        // If it's an HTTPS URL, add the token
        if (url.startsWith('https://')) {
          const authUrl = url.replace('https://', `https://x-access-token:${githubToken}@`);
          pushCommand = `git push ${authUrl} main`;
        }
      }
      
      const { stdout, stderr } = await execPromise(pushCommand);
      
      res.json({ 
        success: true, 
        message: commitMade 
          ? 'Published successfully' 
          : `Pushed ${unpushedCount} pending commit${unpushedCount > 1 ? 's' : ''}`,
        output: stdout || stderr
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Everything is already up to date',
        info: 'No changes to commit and no pending commits to push'
      });
    }
  } catch (error) {
    console.error('Error publishing:', error);
    
    res.status(500).json({ 
      error: error.message,
      details: error.stderr || error.stdout
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog editor server running on http://localhost:${PORT}`);
  
  // Show security warning if using default credentials
  if (!process.env.BLOG_EDITOR_USERNAME || !process.env.BLOG_EDITOR_PASSWORD) {
    console.log('\n⚠️  WARNING: Using default credentials (admin/changeme)');
    console.log('Set BLOG_EDITOR_USERNAME and BLOG_EDITOR_PASSWORD environment variables for production!');
    console.log('Example: BLOG_EDITOR_USERNAME=myuser BLOG_EDITOR_PASSWORD=mysecurepass node blog-editor-server.js\n');
  } else {
    console.log('✓ Using custom credentials from environment variables');
  }
});