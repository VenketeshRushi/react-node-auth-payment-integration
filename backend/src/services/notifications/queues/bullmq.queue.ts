import { Queue, Worker, QueueEvents } from 'bullmq';
import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';
import { NotificationPayload, NotificationPriority } from '../types/index.js';

const redisConnection = {
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT || 6379,
  password: config.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  enableOfflineQueue: false,
};

export class BullMQNotificationQueue {
  private static instance: BullMQNotificationQueue | null = null;

  private queue: Queue;
  private worker?: Worker;
  private queueEvents: QueueEvents;

  private constructor() {
    // Create queue
    this.queue = new Queue('notifications', {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: config.QUEUE_MAX_RETRIES || 3,
        backoff: {
          type: 'exponential',
          delay: config.QUEUE_BACKOFF_DELAY || 2000,
        },
        removeOnComplete: { age: 3600, count: 100 },
        removeOnFail: { age: 86400, count: 500 },
      },
    });

    // Queue events
    this.queueEvents = new QueueEvents('notifications', {
      connection: redisConnection,
    });
    this.setupEventListeners();

    logger.info('BullMQ queue initialized', {
      host: redisConnection.host,
      port: redisConnection.port,
    });
  }

  // Singleton getter
  static getInstance(): BullMQNotificationQueue {
    if (!BullMQNotificationQueue.instance) {
      BullMQNotificationQueue.instance = new BullMQNotificationQueue();
    }
    return BullMQNotificationQueue.instance;
  }

  private setupEventListeners() {
    this.queueEvents.on('completed', ({ jobId, returnvalue }) =>
      logger.info('Notification job completed', { jobId, returnvalue })
    );
    this.queueEvents.on('failed', ({ jobId, failedReason }) =>
      logger.error('Notification job failed', { jobId, reason: failedReason })
    );
    this.queueEvents.on('progress', ({ jobId, data }) =>
      logger.debug('Job progress', { jobId, progress: data })
    );
    this.queueEvents.on('waiting', ({ jobId }) =>
      logger.debug('Job waiting', { jobId })
    );
    this.queueEvents.on('active', ({ jobId }) =>
      logger.debug('Job active', { jobId })
    );
  }

  async add(payload: NotificationPayload) {
    await this.queue.add('send-notification', payload, {
      priority: this.getPriority(payload.priority),
    });
  }

  async addBulk(payloads: NotificationPayload[]) {
    const jobs = payloads.map(payload => ({
      name: 'send-notification',
      data: payload,
      opts: { priority: this.getPriority(payload.priority) },
    }));
    await this.queue.addBulk(jobs);
  }

  private getPriority(priority?: NotificationPriority): number {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return 1;
      case NotificationPriority.HIGH:
        return 2;
      case NotificationPriority.MEDIUM:
        return 3;
      case NotificationPriority.LOW:
        return 4;
      default:
        return 3;
    }
  }

  process(handler: (payload: NotificationPayload) => Promise<void>) {
    this.worker = new Worker(
      'notifications',
      async job => {
        logger.info('Processing notification job', {
          jobId: job.id,
          channel: job.data.channel,
        });
        await handler(job.data);
        return { success: true, jobId: job.id };
      },
      {
        connection: redisConnection,
        concurrency: config.QUEUE_CONCURRENCY || 5,
        limiter: { max: 100, duration: 60000 },
      }
    );

    this.worker.on('completed', job =>
      logger.info('Worker completed job', { jobId: job.id })
    );
    this.worker.on('failed', (job, err) =>
      logger.error('Worker failed job', { jobId: job?.id, error: err.message })
    );

    logger.info('BullMQ worker started', {
      concurrency: config.QUEUE_CONCURRENCY || 5,
    });
  }

  async getQueueMetrics() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + delayed,
    };
  }

  async close() {
    await this.worker?.close();
    await this.queue.close();
    await this.queueEvents.close();
    logger.info('BullMQ queue closed');
  }
}

// Export singleton instance
export const notificationQueue = BullMQNotificationQueue.getInstance();
