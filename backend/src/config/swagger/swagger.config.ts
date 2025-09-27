import type { Express } from 'express';
import type { Options } from 'swagger-jsdoc';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import path from 'path';
import { logger } from '../../utils/logger.js';

const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description:
        'Comprehensive backend API with authentication and user management',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL || 'http://localhost:8000',
        description: 'Development server',
      },
      {
        url: 'https://api.yourdomain.com',
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
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth-token',
        },
      },
    },
  },
  // Load YAML schemas and route files
  apis: [
    path.resolve(process.cwd(), 'src/routes/*.ts'),
    path.resolve(process.cwd(), 'src/routes/**/*.ts'),
    path.resolve(process.cwd(), 'src/integrations/swagger/schemas/*.yaml'),
    // Also include compiled JS files for production
    path.resolve(process.cwd(), 'dist/routes/*.js'),
    path.resolve(process.cwd(), 'dist/routes/**/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerConfig);

export const setupSwagger = (app: Express): void => {
  try {
    // Standard /api-docs path (no versioning)
    app.use('/api-docs', serve);
    app.get(
      '/api-docs',
      setup(swaggerSpec, {
        swaggerOptions: {
          deepLinking: true,
          displayRequestDuration: true,
          docExpansion: 'none',
          filter: true,
          showRequestDuration: true,
        },
        customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 20px 0 }
      `,
        customSiteTitle: 'Backend API Documentation',
      })
    );

    // JSON endpoint for the raw spec
    app.get('/api-docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  } catch (error) {
    logger.error('Failed to setup Swagger documentation', { error });
  }
};
