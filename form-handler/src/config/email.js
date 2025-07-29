const { createTransport } = require('nodemailer');
const { logger } = require('../utils/logger');

// Email configuration based on provider
const getTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
  
  switch (emailProvider.toLowerCase()) {
    case 'sendgrid':
      return createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
      
    case 'gmail':
      return createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      
    case 'ses':
      return createTransport({
        host: process.env.AWS_SES_ENDPOINT || 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.AWS_SES_ACCESS_KEY,
          pass: process.env.AWS_SES_SECRET_KEY
        }
      });
      
    default: // Generic SMTP
      return createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
  }
};

const transporter = getTransporter();

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email configuration error:', error);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

module.exports = { transporter };