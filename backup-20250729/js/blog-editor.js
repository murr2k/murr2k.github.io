document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('blog-post-form');
    const publishBtn = document.getElementById('publish-btn');
    const statusMessage = document.getElementById('status-message');
    const postsList = document.getElementById('posts-list');
    
    // API configuration
    const API_BASE = 'http://localhost:3002';
    const AUTH_TOKEN = btoa('admin:changeme'); // Basic auth
    
    // Set today's date as default
    document.getElementById('post-date').valueAsDate = new Date();
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const date = document.getElementById('post-date').value;
        const categories = document.getElementById('post-categories').value;
        const content = document.getElementById('post-content').value;
        
        // Generate filename
        const filename = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
        
        // Create front matter
        const frontMatter = `---
layout: post
title: "${title}"
date: ${date}
categories: ${categories || 'general'}
---

${content}`;
        
        try {
            const response = await fetch(`${API_BASE}/api/save-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${AUTH_TOKEN}`
                },
                body: JSON.stringify({
                    filename: filename,
                    content: frontMatter
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showStatus('Post saved successfully!', 'success');
                form.reset();
                document.getElementById('post-date').valueAsDate = new Date();
                // Reload the page to show the new post in the list
                setTimeout(() => location.reload(), 1000);
            } else {
                throw new Error(result.error || 'Failed to save post');
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
            console.error('Error saving post:', error);
        }
    });
    
    // Publish button handler
    publishBtn.addEventListener('click', async function() {
        if (!confirm('Are you sure you want to publish all changes to the live site?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/api/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${AUTH_TOKEN}`
                },
                body: JSON.stringify({
                    message: 'Update blog content'
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showStatus('Changes published successfully!', 'success');
            } else {
                throw new Error(result.error || result.message || 'Failed to publish');
            }
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
            console.error('Error publishing:', error);
        }
    });
    
    // Edit post handler
    postsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-post')) {
            e.preventDefault();
            const filename = e.target.getAttribute('data-filename');
            showStatus(`Edit functionality requires backend implementation. File: ${filename}`, 'error');
        }
    });
    
    // Show status message
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
});