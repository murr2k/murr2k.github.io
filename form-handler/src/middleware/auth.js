const { logger } = require('../utils/logger');

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // Get valid API keys from environment
  const validApiKeys = process.env.API_KEYS 
    ? process.env.API_KEYS.split(',').map(k => k.trim())
    : [];
  
  // Find matching API key and extract app name
  const keyConfig = validApiKeys.find(config => {
    const [key] = config.split(':');
    return key === apiKey;
  });
  
  if (!keyConfig) {
    logger.warn(`Invalid API key attempt: ${apiKey.substring(0, 8)}...`);
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  // Extract app name from key config (format: "key:appname")
  const [, appName] = keyConfig.split(':');
  req.appName = appName || 'unknown';
  
  logger.info(`Authenticated request from app: ${req.appName}`);
  next();
};

module.exports = { validateApiKey };