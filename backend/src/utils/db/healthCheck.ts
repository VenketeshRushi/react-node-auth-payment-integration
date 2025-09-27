import { db } from '../../config/database/index.js';
import { redisClient } from '../../config/redis/client.js';

const checkDbConnection = async (): Promise<boolean> => {
  try {
    await db.execute('SELECT 1');
    return true;
  } catch (error: any) {
    console.error('Database connection failed:', error?.message);
    return false;
  }
};

const checkRedisConnection = async (): Promise<boolean> => {
  try {
    const result = await redisClient.ping();
    return result === 'PONG';
  } catch (error: any) {
    console.error('Redis connection failed:', error?.message);
    return false;
  }
};

// Returns per-service status
export const checkAllConnections = async (): Promise<{
  database: boolean;
  redis: boolean;
}> => {
  const [dbOk, redisOk] = await Promise.all([
    checkDbConnection(),
    checkRedisConnection(),
  ]);

  return {
    database: dbOk,
    redis: redisOk,
  };
};

export const getHealthStatus = async () => {
  const [dbOk, redisOk] = await Promise.all([
    checkDbConnection(),
    checkRedisConnection(),
  ]);

  const status = dbOk && redisOk ? 'healthy' : 'unhealthy';

  return {
    status,
    dbServices: {
      postgreSQL: dbOk ? 'healthy' : 'unhealthy',
      redis: redisOk ? 'healthy' : 'unhealthy',
    },
  };
};
