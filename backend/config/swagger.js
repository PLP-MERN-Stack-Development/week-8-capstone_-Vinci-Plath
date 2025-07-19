const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Safety App API',
      version: '1.0.0',
      description: 'API documentation for the Safety App',
      contact: {
        name: 'API Support',
        url: 'https://your-support-url.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123'
            },
            emergencyContacts: {
              type: 'array',
              items: {
                type: 'string',
                format: 'email'
              },
              example: ['contact1@example.com', 'contact2@example.com']
            }
          }
        },
        Checkin: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID of the user who created the check-in'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the check-in will expire'
            },
            active: {
              type: 'boolean',
              description: 'Whether the check-in is still active'
            },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', format: 'float' },
                lng: { type: 'number', format: 'float' }
              }
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the check-in was completed',
              nullable: true
            }
          }
        },
        SOSEvent: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID of the user who triggered the SOS'
            },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', format: 'float' },
                lng: { type: 'number', format: 'float' },
                address: { type: 'string' }
              }
            },
            status: {
              type: 'string',
              enum: ['triggered', 'auto-triggered', 'resolved'],
              default: 'triggered'
            },
            resolvedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
              description: 'Full name of the contact'
            },
            phone: {
              type: 'string',
              example: '+1234567890',
              description: 'Phone number with country code'
            },
            relationship: {
              type: 'string',
              example: 'Friend',
              description: 'Relationship to the user',
              enum: ['Family', 'Friend', 'Colleague', 'Other']
            },
            isEmergencyContact: {
              type: 'boolean',
              default: false,
              description: 'Whether this is an emergency contact'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the contact was created'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../models/*.js')
  ]
};

const specs = swaggerJsdoc(options);
module.exports = specs;
