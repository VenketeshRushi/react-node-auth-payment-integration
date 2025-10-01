import express, { type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import fs from 'fs';

import { setupSwagger } from './config/swagger/swagger.config.js';
import { config, logger } from './config/index.js';
import { httpLogger } from './middlewares/httpLogger.middleware.js';
import { sendSuccessResponse } from './utils/http/responses.utils.js';
import { errorHandlerMiddleware } from './middlewares/error.middleware.js';
import { getHealthStatus } from './utils/db/healthCheck.js';
import authRoutes from './modules/auth/routes/auth.route.js';

const app = express();

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info('Created logs directory', { path: logsDir });
}

// Trust proxy for load balancers / reverse proxies
app.set('trust proxy', 1);
app.disable('x-powered-by');

// response compression
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Helmet for Security
const isProduction = config.NODE_ENV === 'production';

if (isProduction) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", config.FRONTEND_URL, 'wss:'],
          fontSrc: ["'self'", 'https:', 'data:'],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );
} else {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      hsts: false,
    })
  );
}

// Body Parsing with rate limiting considerations
app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      // Store raw body for webhook verification if needed
      (req as any).rawBody = buf;
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 1000,
  })
);

app.use(cookieParser());

const allowedOrigins: string[] = [
  config.ALLOWED_ORIGIN,
  config.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ): void => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      logger.debug('Request with no origin allowed');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      logger.debug('CORS allowed for origin', { origin });
      return callback(null, true);
    }

    // Allow localhost in development
    if (
      !isProduction &&
      /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):\d+$/.test(origin)
    ) {
      logger.debug('Development localhost origin allowed', { origin });
      return callback(null, true);
    }

    logger.warn('CORS violation attempt', {
      origin,
      userAgent: undefined, // Will be filled by middleware if available
      timestamp: new Date().toISOString(),
      allowedOrigins,
    });

    callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'x-machine-id',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-CSRF-Token',
  ],
  // exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  // maxAge: isProduction ? 86400 : 300, // 24h in prod, 5min in dev
};

app.use(cors(corsOptions));

setupSwagger(app);

app.use(httpLogger);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('ok');
});

app.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = await getHealthStatus();

    const response = {
      name: 'Genie Backend Service',
      message: 'Backend APIs is running now 👍',
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
      health,
      endpoints: {
        health: '/health',
        docs: '/api-docs',
      },
      features: [
        'PostgreSQL Database Integration',
        'Redis Database Integration',
      ],
    };

    // Use 503 if any service is unhealthy
    const statusCode = health.status === 'healthy' ? 200 : 503;

    sendSuccessResponse(res, statusCode, 'Server is healthy', response);
  } catch (error: any) {
    console.error('Server health endpoint failed:', error?.message);
    sendSuccessResponse(res, 500, 'Server is unhealthy', {
      status: 'unhealthy',
      services: {
        postgreSQL: 'unknown',
        redis: 'unknown',
      },
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api/auth', authRoutes);

// Catch-all 404 handler
app.get('/{*splat}', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandlerMiddleware);

export default app;
