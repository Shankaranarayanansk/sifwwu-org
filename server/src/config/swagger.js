const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIFWWU Admin Panel API',
      version: '1.0.0',
      description: 'Comprehensive Admin Panel Backend API for SIFWWU',
      contact: {
        name: 'SIFWWU Development Team',
        email: 'southindianfilmtrust@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.sifwwu.org',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            fullName: {
              type: 'string',
              description: 'User full name',
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'admin', 'moderator', 'user'],
              description: 'User role',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended', 'pending'],
              description: 'User status',
            },
            avatar: {
              type: 'string',
              description: 'User avatar URL',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
            },
            department: {
              type: 'string',
              description: 'User department',
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
            },
            emailVerified: {
              type: 'boolean',
              description: 'Email verification status',
            },
            preferences: {
              type: 'object',
              properties: {
                theme: {
                  type: 'string',
                  enum: ['light', 'dark', 'auto'],
                },
                language: {
                  type: 'string',
                },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean' },
                    push: { type: 'boolean' },
                    sms: { type: 'boolean' },
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Content: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Content ID',
            },
            title: {
              type: 'string',
              description: 'Content title',
            },
            slug: {
              type: 'string',
              description: 'Content slug',
            },
            type: {
              type: 'string',
              enum: ['page', 'post', 'news', 'announcement', 'service', 'leader', 'achievement'],
              description: 'Content type',
            },
            content: {
              type: 'string',
              description: 'Content body',
            },
            excerpt: {
              type: 'string',
              description: 'Content excerpt',
            },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'archived', 'pending_review'],
              description: 'Content status',
            },
            featured: {
              type: 'boolean',
              description: 'Featured content flag',
            },
            featuredImage: {
              type: 'string',
              description: 'Featured image URL',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Content tags',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Publication timestamp',
            },
            views: {
              type: 'number',
              description: 'View count',
            },
            likes: {
              type: 'number',
              description: 'Like count',
            },
            version: {
              type: 'number',
              description: 'Content version',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Log ID',
            },
            userId: {
              type: 'string',
              description: 'User ID who performed the action',
            },
            action: {
              type: 'string',
              enum: [
                'CREATE', 'READ', 'UPDATE', 'DELETE',
                'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
                'PASSWORD_CHANGE', 'PASSWORD_RESET',
                'ROLE_CHANGE', 'STATUS_CHANGE',
                'BULK_OPERATION', 'EXPORT', 'IMPORT'
              ],
              description: 'Action performed',
            },
            resource: {
              type: 'string',
              description: 'Resource affected',
            },
            resourceId: {
              type: 'string',
              description: 'Resource ID',
            },
            details: {
              type: 'object',
              description: 'Additional details',
            },
            ipAddress: {
              type: 'string',
              description: 'IP address',
            },
            userAgent: {
              type: 'string',
              description: 'User agent',
            },
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            errorMessage: {
              type: 'string',
              description: 'Error message if failed',
            },
            duration: {
              type: 'number',
              description: 'Operation duration in milliseconds',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Log timestamp',
            },
          },
        },
        SystemConfig: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Config ID',
            },
            key: {
              type: 'string',
              description: 'Configuration key',
            },
            value: {
              description: 'Configuration value (can be any type)',
            },
            type: {
              type: 'string',
              enum: ['string', 'number', 'boolean', 'object', 'array'],
              description: 'Value type',
            },
            category: {
              type: 'string',
              description: 'Configuration category',
            },
            description: {
              type: 'string',
              description: 'Configuration description',
            },
            isPublic: {
              type: 'boolean',
              description: 'Public configuration flag',
            },
            updatedBy: {
              type: 'string',
              description: 'User ID who last updated',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
              description: 'Validation errors',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = specs;