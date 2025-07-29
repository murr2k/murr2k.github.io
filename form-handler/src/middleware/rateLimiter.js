const rateLimit = require('express-rate-limit');
const { logger } = require('../utils/logger');

// Create different rate limiters for different purposes
const createRateLimiter = (options = {}) => {
  const defaults = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(options.statusCode).json({ error: options.message });
    }
  };
  
  return rateLimit({ ...defaults, ...options });
};

// Specific rate limiters
const generalLimiter = createRateLimiter();

const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many form submissions, please try again later.'
});

// Per-app rate limiter
const appLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Higher limit for authenticated apps
  keyGenerator: (req) => req.appName || req.ip, // Rate limit by app name
  message: 'App rate limit exceeded.'
});

module.exports = { generalLimiter, strictLimiter, appLimiter };