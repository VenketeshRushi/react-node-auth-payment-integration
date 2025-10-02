import { config } from '@/config/loadEnv.js';
import { NotificationFactory } from './notification.factory.js';
import { BullMQNotificationQueue } from './queues/bullmq.queue.js';

// synchronous (immediate) notifications
export const notificationService =
  NotificationFactory.createNotificationService();

// async (queued) notifications
export const notificationQueue = config.USE_QUEUE
  ? new BullMQNotificationQueue()
  : null;

// Start queue worker if enabled
if (notificationQueue) {
  notificationQueue.process(async payload => {
    await notificationService.send(payload);
  });
}

export * from './notification.helper.js';
export * from './types/index.js';
