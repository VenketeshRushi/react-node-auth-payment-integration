import type { Express } from 'express';
import type { Options } from 'swagger-jsdoc';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import path from 'path';
import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';

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
        url: config.BACKEND_URL,
        description:
          config.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
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
    // TypeScript route files (development)
    path.resolve(process.cwd(), 'src/modules/*/routes/*.ts'),

    // YAML schema files
    path.resolve(process.cwd(), 'src/config/swagger/schemas/*.yaml'),

    // Compiled JavaScript files (production)
    path.resolve(process.cwd(), 'dist/modules/*/routes/*.js'),
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

    app.get('/api-docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  } catch (error) {
    logger.error('Failed to setup Swagger documentation', { error });
  }
};
