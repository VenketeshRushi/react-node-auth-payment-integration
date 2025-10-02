import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';
import {
  NotificationPayload,
  notificationQueue,
} from '@/services/notifications/index.js';
import { NotificationFactory } from '@/services/notifications/notification.factory.js';

const startNotificationWorker = () => {
  if (!config.USE_QUEUE) {
    logger.info('Queue processing disabled');
    return;
  }

  const notificationService = NotificationFactory.createNotificationService();

  // Start processing jobs
  notificationQueue.process(async (payload: NotificationPayload) => {
    logger.info('Worker processing notification', {
      channel: payload.channel,
      to: payload.to,
    });
    await notificationService.send(payload);
  });

  logger.info('Notification worker started and listening for jobs');

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, closing worker...`);
    await notificationQueue.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// Run if file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startNotificationWorker();
}

export { startNotificationWorker };
