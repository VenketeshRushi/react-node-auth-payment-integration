import app from '@/app.js';
import { config } from '@/config/loadEnv.js';
import { checkAllConnections } from '@/utils/healthCheck.js';
import { startNotificationWorker } from '@/workers/notification.worker.js';

const { PORT, NODE_ENV, HOST } = config;

const connectToServices = async (): Promise<boolean> => {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await checkAllConnections();
      const failedServices = Object.entries(result)
        .filter(([_, ok]) => !ok)
        .map(([name]) => name);

      if (failedServices.length === 0) return true;

      console.error(`Failed services: ${failedServices.join(', ')}`);
    } catch (err: any) {
      console.error(`Connection attempt ${attempt} failed: ${err?.message}`);
    }

    if (attempt < maxRetries) {
      await new Promise(r => setTimeout(r, Math.min(3000 * attempt, 15000)));
    }
  }

  return false;
};

const startServer = async () => {
  const ok = await connectToServices();
  if (!ok) {
    console.error('Could not connect to services. Exiting.');
    process.exit(1);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT} [${NODE_ENV}]`);
    if (config.USE_QUEUE) {
      startNotificationWorker();
      console.info('BullMQ notification worker initialized');
    }
  });

  server.timeout = 30000;

  const shutdown = (signal: string) => {
    console.warn(`${signal} received, shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', reason =>
    console.error('Unhandled Rejection', reason)
  );
  process.on('uncaughtException', err =>
    console.error('Uncaught Exception', err)
  );

  console.log('═══════════════════════════════════════');
  console.log('Backend Server:');
  console.log('═══════════════════════════════════════');
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Node.js version: ${process.version}`);
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log('═══════════════════════════════════════\n');
};

startServer();
