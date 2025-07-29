const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Handle different error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details || err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

module.exports = { errorHandler };