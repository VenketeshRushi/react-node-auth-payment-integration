import { Redis } from 'ioredis';
import { redisConfig } from './redis.config.js';
import { logger } from '../../utils/logger.js';

export const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('ready', () => {
  logger.info('Redis is ready to accept commands');
});

redisClient.on('error', (error: Error) => {
  logger.error('Redis connection error:', error);
});

redisClient.on('close', () => {
  logger.info('Redis connection closed');
});

redisClient.on('reconnecting', (delay: number, attempt: number) => {
  logger.warn(`Redis reconnecting in ${delay}ms (attempt ${attempt})`);
});

// Graceful shutdown
const shutdownRedis = async () => {
  logger.info('Closing Redis connection...');
  await redisClient.quit();
  logger.info('Redis connection closed');
};

process.on('SIGINT', shutdownRedis);
process.on('SIGTERM', shutdownRedis);
