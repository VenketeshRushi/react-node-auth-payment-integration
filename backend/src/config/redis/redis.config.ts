import { config } from '../index.js';

export const redisConfig = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  db: config.REDIS_DB,
  password: config.REDIS_PASSWORD,
  lazyConnect: true,
  keepAlive: 30000,
  family: 4,
  keyPrefix: config.REDIS_KEY_PREFIX,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  maxLoadingTimeout: 10000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};
