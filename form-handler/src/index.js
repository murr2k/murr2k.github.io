const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
require('dotenv').config();

const { corsConfig } = require('./config/cors');
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { validateApiKey } = require('./middleware/auth');
const formRoutes = require('./routes/forms');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());
app.use(cors(corsConfig));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
});

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Public routes (no auth required, but domain-restricted)
app.use('/api/public', publicRoutes);

// API routes with authentication
app.use('/api/v1/forms', validateApiKey, formRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Form Handler API running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});