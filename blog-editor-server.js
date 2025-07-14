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
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  // In production, use environment variables or secure storage
  if (username === 'admin' && password === 'changeme') {
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

// List posts endpoint
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

// Publish endpoint
app.post('/api/publish', basicAuth, async (req, res) => {
  try {
    // Git add all changes
    await execPromise('git add .');
    
    // Git commit
    const commitMessage = req.body.message || 'Update blog content';
    await execPromise(`git commit -m "${commitMessage}"`);
    
    // Git push
    const { stdout, stderr } = await execPromise('git push origin main');
    
    res.json({ 
      success: true, 
      message: 'Published successfully',
      output: stdout || stderr
    });
  } catch (error) {
    console.error('Error publishing:', error);
    
    // Check if error is due to no changes
    if (error.message.includes('nothing to commit')) {
      return res.json({ 
        success: false, 
        message: 'No changes to publish',
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: error.message,
      details: error.stderr || error.stdout
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog editor server running on http://localhost:${PORT}`);
  console.log('Default credentials: admin / changeme');
  console.log('Remember to change these in production!');
});