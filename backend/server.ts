import app from './src/app.js';
import { checkAllConnections } from './src/utils/db/healthCheck.js';
import { config, logger } from './src/config/index.js';

const { PORT, NODE_ENV, HOST } = config;

const connectToServices = async (): Promise<boolean> => {
  const maxRetries = 5;
  const retryDelay = 3000; // 3s per attempt

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    logger.info(`Connecting to services... (${attempt}/${maxRetries})`);

    try {
      const result = await checkAllConnections();
      const failedServices = Object.entries(result)
        .filter(([_, ok]) => !ok)
        .map(([name]) => name);

      if (failedServices.length === 0) {
        logger.info('✅ All services connected successfully');
        return true;
      } else {
        logger.error(`❌ Failed to connect: ${failedServices.join(', ')}`);
      }
    } catch (error: any) {
      logger.error(
        `❌ Attempt ${attempt} failed: ${error?.message || 'Unknown error'}`
      );
    }

    if (attempt < maxRetries) {
      logger.info(`🔄 Retrying in ${retryDelay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    } else {
      logger.error('❌ All attempts exhausted. Shutting down.');
      return false;
    }
  }

  return false;
};

const startServer = async () => {
  logger.info(`🚀 Starting server in ${NODE_ENV} mode...`);

  const servicesOk = await connectToServices();
  if (!servicesOk) {
    logger.error('❌ Could not connect to services. Exiting.');
    process.exit(1);
  }

  const server = app.listen(PORT, HOST, () => {
    logger.info('✅ Server started successfully', {
      url: `http://${HOST}:${PORT}`,
      health: `http://${HOST}:${PORT}/health`,
      apiDocs: `http://${HOST}:${PORT}/api-docs`,
      environment: NODE_ENV,
    });
  });

  server.timeout = 30000;

  const shutdown = (signal: string) => {
    logger.warn(`⚠️ ${signal} received - shutting down gracefully...`);
    server.close((err: Error | undefined) => {
      if (err) {
        logger.error('❌ Error during shutdown', { error: err });
        process.exit(1);
      }
      logger.info('✅ Server closed successfully');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('⏱️ Force shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason, promise) =>
    logger.error('❌ Unhandled Rejection', { promise, reason })
  );
  process.on('uncaughtException', err =>
    logger.error('❌ Uncaught Exception', { error: err })
  );
  process.on('warning', warning =>
    logger.warn('⚠️ Process warning', {
      name: warning.name,
      message: warning.message,
    })
  );

  logger.info('═══════════════════════════════════════');
  logger.info('🚀 Backend Server Starting...');
  logger.info('═══════════════════════════════════════');
  logger.info(`📅 Started at: ${new Date().toISOString()}`);
  logger.info(`⚙️ Node.js version: ${process.version}`);
  logger.info(`📁 Working directory: ${process.cwd()}`);
  logger.info(`🌍 Environment: ${NODE_ENV}`);
  logger.info('═══════════════════════════════════════\n');
};

startServer();
