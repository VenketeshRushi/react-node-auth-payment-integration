import { NotificationFactory } from './notification.factory.js';
import { BullMQNotificationQueue } from './queues/bullmq.queue.js';
import { NotificationPayload } from './types/index.js';

// synchronous (immediate) notifications
export const notificationService =
  NotificationFactory.createNotificationService();

// async (queued) notifications (singleton)
export const notificationQueue = BullMQNotificationQueue.getInstance();

// Start queue worker if enabled
notificationQueue.process(async (payload: NotificationPayload) => {
  await notificationService.send(payload);
});

export * from './notification.helper.js';
export * from './types/index.js';
