import app from './src/app.js';
// import { validateEnv } from './src/utils/validateEnv.js';
import { checkAllConnections } from './src/utils/db/healthCheck.js';
import dotenv from 'dotenv';

console.log('NODE_ENV:', process.env.NODE_ENV);

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
console.log(`Loading environment variables from: ${envFile}`);

dotenv.config({ path: envFile });

// validateEnv();

const PORT = Number(process.env.PORT) || 5000;

const connectToServices = async (): Promise<boolean> => {
  const maxRetries = 5;
  const retryDelay = 3000; // 3s between retries
  const connectionTimeout = 10000; // 10s per attempt

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Connecting to services... (${attempt}/${maxRetries})`);

    try {
      const connectionPromise = checkAllConnections();
      const timeoutPromise = new Promise<Record<string, boolean>>((_, reject) =>
        setTimeout(
          () => reject(new Error('Connection timeout')),
          connectionTimeout
        )
      );

      const result = await Promise.race([connectionPromise, timeoutPromise]);

      const failedServices = Object.entries(result)
        .filter(([_, ok]) => !ok)
        .map(([name]) => name);

      if (failedServices.length === 0) {
        console.log('✅ All services connected successfully');
        return true;
      } else {
        console.error(`❌ Failed to connect: ${failedServices.join(', ')}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Attempt ${attempt} failed: ${message}`);
    }

    if (attempt < maxRetries) {
      console.log(`⏳ Retrying in ${retryDelay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    } else {
      console.error('💥 All 5 attempts exhausted. Shutting down.');
      return false;
    }
  }

  return false;
};

const startServer = async () => {
  console.log(
    `🚀 Starting server in ${process.env.NODE_ENV || 'development'} mode...`
  );

  const servicesOk = await connectToServices();

  if (!servicesOk) {
    console.log('❌ Could not connect to services. Exiting.');
    process.exit(1);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 Server started successfully!');
    console.log(`🌐 Server running at http://localhost:${PORT}`);
    console.log(`💓 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.timeout = 30000;

  const shutdown = (signal: string) => {
    console.log(`\n🛑 ${signal} received - shutting down gracefully`);
    server.close(err => {
      if (err) {
        console.error('❌ Error during shutdown:', err);
        process.exit(1);
      }
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
    setTimeout(() => {
      console.log('⚡ Force shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    if (process.env.NODE_ENV !== 'production') process.exit(1);
  });

  process.on('uncaughtException', err => {
    console.error('🚨 Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('warning', warning => {
    console.warn('⚠️ Process warning:', warning.name, warning.message);
  });
};

console.log('📱 Backend Server Starting...');
console.log(`📅 Started at: ${new Date().toISOString()}`);
console.log(`🔧 Node.js version: ${process.version}`);
console.log(`📁 Working directory: ${process.cwd()}`);

startServer();
