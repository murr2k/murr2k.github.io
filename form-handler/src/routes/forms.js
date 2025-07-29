const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { strictLimiter, appLimiter } = require('../middleware/rateLimiter');
const { validateForm, detectSpam } = require('../utils/validation');
const { sendEmail } = require('../services/emailService');
const { logger } = require('../utils/logger');

// Apply rate limiting
router.use(strictLimiter);
router.use(appLimiter);

// Handle form submission
router.post('/submit', async (req, res) => {
  const requestId = uuidv4();
  res.setHeader('X-Request-ID', requestId);
  
  try {
    // Add source app information
    const formData = {
      ...req.body,
      source: req.appName
    };
    
    // Validate form data
    const validatedData = validateForm(formData);
    
    // Check for spam
    if (detectSpam(validatedData)) {
      logger.warn(`Spam detected from ${req.ip}`, { requestId, data: validatedData });
      // Still return success to avoid revealing spam detection
      return res.json({ 
        success: true, 
        message: 'Form submitted successfully',
        id: requestId 
      });
    }
    
    // Send email
    await sendEmail(validatedData, req.appName);
    
    logger.info(`Form submitted successfully`, {
      requestId,
      app: req.appName,
      from: validatedData.email
    });
    
    res.json({
      success: true,
      message: 'Form submitted successfully',
      id: requestId
    });
    
  } catch (error) {
    logger.error(`Form submission failed`, {
      requestId,
      error: error.message,
      app: req.appName
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
      error: 'Failed to process form submission',
      id: requestId
    });
  }
});

// Get form submission status (for future webhook implementation)
router.get('/status/:id', async (req, res) => {
  res.json({
    id: req.params.id,
    status: 'delivered',
    message: 'Status tracking coming soon'
  });
});

module.exports = router;