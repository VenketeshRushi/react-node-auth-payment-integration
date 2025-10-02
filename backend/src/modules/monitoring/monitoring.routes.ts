import { Router, Request, Response } from 'express';
import { notificationQueue } from '@/services/notifications/index.js';
import { BullMQNotificationQueue } from '@/services/notifications/queues/bullmq.queue.js';
import { sendSuccessResponse, sendErrorResponse } from '@/utils/http.js';

const router = Router();

// Type guard for notificationQueue
const checkQueue = (
  queue: BullMQNotificationQueue | null,
  res: Response
): queue is BullMQNotificationQueue => {
  if (!queue) {
    sendErrorResponse(res, 503, 'Notification queue not initialized');
    return false;
  }
  return true;
};

interface QueueMetrics {
  completed: number;
  failed: number;
  delayed: number;
  waiting: number;
  active: number;
  total: number;
  [key: string]: number;
}

router.get('/metrics', async (_req: Request, res: Response) => {
  if (!checkQueue(notificationQueue, res)) return;

  try {
    const metrics: QueueMetrics = await notificationQueue.getQueueMetrics();

    sendSuccessResponse(res, 200, 'Queue metrics fetched successfully', {
      queue: 'notifications',
      metrics,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    sendErrorResponse(res, 500, 'Failed to fetch queue metrics', {
      error: err.message,
    });
  }
});

router.get('/health', async (_req: Request, res: Response) => {
  if (!checkQueue(notificationQueue, res)) return;

  try {
    const metrics: QueueMetrics = await notificationQueue.getQueueMetrics();
    const isHealthy = metrics.failed < 100 && metrics.waiting < 1000;

    sendSuccessResponse(
      res,
      isHealthy ? 200 : 503,
      `Queue is ${isHealthy ? 'healthy' : 'degraded'}`,
      {
        status: isHealthy ? 'healthy' : 'degraded',
        metrics,
      }
    );
  } catch (err: any) {
    sendErrorResponse(res, 500, 'Failed to fetch queue health', {
      error: err.message,
    });
  }
});

export default router;
