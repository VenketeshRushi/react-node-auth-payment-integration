import express, { type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import fs from 'fs';
import { logger } from './config/logger/index.js';
import { config } from './config/loadEnv.js';
import { setupSwagger } from './docs/swagger/swagger.config.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { getHealthStatus } from './utils/healthCheck.js';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from './utils/response.utils.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import authRouter from './modules/auth/auth.route.js';

const app = express();

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info('Created logs directory', { path: logsDir });
}

// Trust proxy for load balancers / reverse proxies
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Response compression
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

// Helmet for security
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
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
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
    if (!origin) return callback(null, true); // allow curl / mobile
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
    const statusCode = health.status === 'healthy' ? 200 : 503;

    const response = {
      name: 'Node.js Backend Service',
      message: 'Backend APIs is running now 👍',
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
      health,
      endpoints: { health: '/health', docs: '/api-docs' },
      features: [
        'PostgreSQL Database Integration',
        'Redis Database Integration',
      ],
    };

    if (statusCode === 200) {
      sendSuccessResponse(res, statusCode, 'Server is healthy', response);
    } else {
      sendErrorResponse(res, statusCode, 'Server is unhealthy', response);
    }
  } catch (error: any) {
    logger.error('Server health endpoint failed:', error?.message);
    sendErrorResponse(res, 500, 'Server health check failed', {
      status: 'unhealthy',
      services: { postgreSQL: 'unknown', redis: 'unknown' },
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/auth', authRouter);

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
