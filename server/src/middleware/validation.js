const Joi = require('joi');
const logger = require('../utils/logger');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation error:', { errors, url: req.originalUrl });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User schemas
  userRegistration: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
    department: Joi.string().max(100).optional()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  userUpdate: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
    department: Joi.string().max(100).optional(),
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark', 'auto').optional(),
      language: Joi.string().max(10).optional(),
      notifications: Joi.object({
        email: Joi.boolean().optional(),
        push: Joi.boolean().optional(),
        sms: Joi.boolean().optional()
      }).optional()
    }).optional()
  }),

  passwordChange: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
  }),

  passwordReset: Joi.object({
    email: Joi.string().email().required()
  }),

  passwordResetConfirm: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
  }),

  // Content schemas
  contentCreate: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    content: Joi.string().min(1).required(),
    type: Joi.string().valid('page', 'post', 'news', 'announcement', 'service', 'leader', 'achievement').required(),
    excerpt: Joi.string().max(500).optional(),
    status: Joi.string().valid('draft', 'published', 'archived', 'pending_review').default('draft'),
    featured: Joi.boolean().default(false),
    featuredImage: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string().max(50)).optional(),
    metadata: Joi.object({
      seoTitle: Joi.string().max(60).optional(),
      seoDescription: Joi.string().max(160).optional(),
      seoKeywords: Joi.array().items(Joi.string().max(50)).optional(),
      customFields: Joi.object().optional()
    }).optional(),
    scheduledAt: Joi.date().greater('now').optional()
  }),

  contentUpdate: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    content: Joi.string().min(1).optional(),
    excerpt: Joi.string().max(500).optional(),
    status: Joi.string().valid('draft', 'published', 'archived', 'pending_review').optional(),
    featured: Joi.boolean().optional(),
    featuredImage: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string().max(50)).optional(),
    metadata: Joi.object({
      seoTitle: Joi.string().max(60).optional(),
      seoDescription: Joi.string().max(160).optional(),
      seoKeywords: Joi.array().items(Joi.string().max(50)).optional(),
      customFields: Joi.object().optional()
    }).optional(),
    scheduledAt: Joi.date().greater('now').optional()
  }),

  // System config schemas
  systemConfigUpdate: Joi.object({
    value: Joi.any().required(),
    description: Joi.string().max(500).optional()
  }),

  // Query schemas
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().max(100).optional(),
    filter: Joi.object().optional()
  }),

  // Bulk operations
  bulkOperation: Joi.object({
    action: Joi.string().valid('delete', 'activate', 'deactivate', 'export').required(),
    ids: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).min(1).required(),
    options: Joi.object().optional()
  })
};

module.exports = { validate, schemas };