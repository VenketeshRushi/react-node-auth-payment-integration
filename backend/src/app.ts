import express, { type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import fs from 'fs';
import { logger } from './config/logger/index.js';
import { config } from './config/loadEnv.js';
import { setupSwagger } from './config/swagger/swagger.config.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { sendSuccessResponse, sendErrorResponse } from './utils/http.js';
import { getHealthStatus } from './utils/healthCheck.js';
import authRouter from './modules/auth/auth.route.js';
import queueMonitoringRouter from './modules/monitoring/monitoring.routes.js';
import { notificationQueue } from './services/notifications/index.js';

const app = express();

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info('Created logs directory', { path: logsDir });
}

// Trust proxy for load balancers
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Compression
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

// Helmet security
const isProduction = config.NODE_ENV === 'production';
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
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
        }
      : false,
    crossOriginEmbedderPolicy: false,
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  })
);

// Body parsing
app.use(
  express.json({
    limit: '10mb',
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf; // needed for webhooks
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
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (
      !isProduction &&
      /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):\d+$/.test(origin)
    ) {
      return callback(null, true);
    }
    logger.warn('CORS violation attempt', { origin });
    callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'x-Machine-Id',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-CSRF-Token',
  ],
};

app.use(cors(corsOptions));

setupSwagger(app);
app.use(requestLogger);

app.get('/', (_req: Request, res: Response) => {
  sendSuccessResponse(res, 200, 'Backend API is running');
});

app.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = await getHealthStatus();

    let queueStatus = {
      status: 'unknown',
      metrics: null as null | Record<string, number>,
    };

    if (notificationQueue) {
      try {
        const metrics = await notificationQueue.getQueueMetrics();
        const isHealthy = metrics.failed < 100 && metrics.waiting < 1000;
        queueStatus = {
          status: isHealthy ? 'healthy' : 'degraded',
          metrics,
        };
      } catch (err: any) {
        logger.error(
          'Failed to fetch notification queue metrics:',
          err?.message
        );
        queueStatus.status = 'unhealthy';
      }
    } else {
      queueStatus.status = 'uninitialized';
    }

    const servicesStatus = [
      health.status === 'healthy',
      queueStatus.status === 'healthy' ||
        queueStatus.status === 'uninitialized', // treat uninitialized as non-critical
    ];

    const overallHealthy = servicesStatus.every(Boolean);
    const statusCode = overallHealthy ? 200 : 503;

    const response = {
      name: 'Node.js Backend Service',
      message: 'Backend APIs are running 👍',
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
      health,
      queue: queueStatus,
      endpoints: { health: '/health', docs: '/api-docs' },
      features: [
        'PostgreSQL Database Integration',
        'Redis Database Integration',
        'Notification Queue Integration',
      ],
    };

    if (overallHealthy) {
      sendSuccessResponse(res, statusCode, 'Server is healthy', response);
    } else {
      sendErrorResponse(
        res,
        statusCode,
        'Server is degraded/unhealthy',
        response
      );
    }
  } catch (error: any) {
    logger.error('Server health endpoint failed:', error?.message);
    sendErrorResponse(res, 500, 'Server health check failed', {
      status: 'unhealthy',
      services: { postgreSQL: 'unknown', redis: 'unknown', queue: 'unknown' },
      timestamp: new Date().toISOString(),
    });
  }
});

// Routers
app.use('/auth', authRouter);
app.use('/queue', queueMonitoringRouter);

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
