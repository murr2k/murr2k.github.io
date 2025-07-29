const express = require('express');
const router = express.Router();

const { strictLimiter } = require('../middleware/rateLimiter');
const { validateForm, detectSpam } = require('../utils/validation');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');

// Apply rate limiting
router.use(strictLimiter);

// Public endpoint - no API key required, but strict origin checking
router.post('/contact', async (req, res) => {
  const origin = req.get('origin') || req.get('referer');
  
  // Whitelist of allowed public domains
  const allowedDomains = [
    'https://murr2k.github.io',
    'https://murraykopit.com',
    'http://localhost:8000',
    'http://localhost:8001'
  ];
  
  // Check if request is from allowed domain
  const isAllowed = allowedDomains.some(domain => 
    origin && origin.startsWith(domain)
  );
  
  if (!isAllowed) {
    logger.warn(`Rejected public form from unauthorized origin: ${origin}`);
    return res.status(403).json({ 
      error: 'Unauthorized domain' 
    });
  }
  
  try {
    // Extract domain name for app identification
    const appName = new URL(origin).hostname.replace(/\./g, '-');
    
    const formData = {
      ...req.body,
      source: appName
    };
    
    // Validate and process same as authenticated endpoint
    const validatedData = validateForm(formData);
    
    if (detectSpam(validatedData)) {
      logger.warn(`Spam detected from ${req.ip}`, { data: validatedData });
      return res.json({ 
        success: true, 
        message: 'Form submitted successfully'
      });
    }
    
    await sendEmail(validatedData, appName);
    
    logger.info(`Public form submitted successfully`, {
      app: appName,
      from: validatedData.email
    });
    
    res.json({
      success: true,
      message: 'Form submitted successfully'
    });
    
  } catch (error) {
    logger.error(`Public form submission failed`, {
      error: error.message,
      origin: origin
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to process form submission'
    });
  }
});

module.exports = router;