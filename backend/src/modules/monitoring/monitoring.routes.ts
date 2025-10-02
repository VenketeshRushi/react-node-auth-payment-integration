import { Router, Request, Response } from 'express';
import { notificationQueue } from '@/services/notifications/index.js';
import { BullMQNotificationQueue } from '@/services/notifications/queues/bullmq.queue.js';

const router = Router();

// Type guard for notificationQueue
const checkQueue = (
  queue: BullMQNotificationQueue | null,
  res: Response
): queue is BullMQNotificationQueue => {
  if (!queue) {
    res.status(503).json({
      success: false,
      message: 'Notification queue not initialized',
    });
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

router.get('/queue/metrics', async (_req: Request, res: Response) => {
  if (!checkQueue(notificationQueue, res)) return;

  try {
    const metrics: QueueMetrics = await notificationQueue.getQueueMetrics();

    res.json({
      success: true,
      data: {
        queue: 'notifications',
        metrics,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queue metrics',
      error: err.message,
    });
  }
});

router.get('/queue/health', async (_req: Request, res: Response) => {
  if (!checkQueue(notificationQueue, res)) return;

  try {
    const metrics: QueueMetrics = await notificationQueue.getQueueMetrics();
    const isHealthy = metrics.failed < 100 && metrics.waiting < 1000;

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'degraded',
        metrics,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queue health',
      error: err.message,
    });
  }
});

export default router;
