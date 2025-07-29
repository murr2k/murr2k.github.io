const Joi = require('joi');

// Form submission schema
const formSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().max(200),
  message: Joi.string().min(10).max(5000).required(),
  phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).allow('').optional(),
  company: Joi.string().max(100).allow('').optional(),
  website: Joi.string().uri().allow('').optional(),
  metadata: Joi.object().optional(), // For custom fields
  source: Joi.string().max(50).optional() // Which app sent this
});

// Email template schema
const emailTemplateSchema = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ).required(),
  subject: Joi.string().required(),
  replyTo: Joi.string().email().optional(),
  template: Joi.string().valid('default', 'custom').default('default'),
  customTemplate: Joi.string().when('template', {
    is: 'custom',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// Validate form data
const validateForm = (data) => {
  const { error, value } = formSchema.validate(data, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    validationError.details = details;
    throw validationError;
  }
  
  return value;
};

// Basic spam detection
const detectSpam = (formData) => {
  const spamIndicators = [
    /viagra|cialis|pharmacy/i,
    /click here|buy now|limited offer/i,
    /\b(?:https?:\/\/)\S+/g, // URLs in message
    /[A-Z]{10,}/, // Excessive caps
  ];
  
  const message = formData.message || '';
  const spamScore = spamIndicators.reduce((score, pattern) => {
    return score + (pattern.test(message) ? 1 : 0);
  }, 0);
  
  // Check for honeypot field
  if (formData.honeypot) {
    return true;
  }
  
  return spamScore >= 2;
};

module.exports = { validateForm, detectSpam, emailTemplateSchema };