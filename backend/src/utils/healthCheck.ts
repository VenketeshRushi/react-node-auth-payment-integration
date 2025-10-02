import { pool } from '@/services/database/connection.js';
import { checkDbConnection } from '@/services/database/utils/health.js';
import { redisClient } from '@/services/redis/client.js';
import { checkRedisConnection } from '@/services/redis/health.js';

export const checkAllConnections = async (): Promise<{
  database: boolean;
  redis: boolean;
}> => {
  const [dbOk, redisOk] = await Promise.allSettled([
    checkDbConnection(),
    checkRedisConnection(),
  ]);

  const dbStatus = dbOk.status === 'fulfilled' && dbOk.value;
  const redisStatus = redisOk.status === 'fulfilled' && redisOk.value;

  return { database: dbStatus, redis: redisStatus };
};

export const getHealthStatus = async () => {
  const { database, redis } = await checkAllConnections();

  return {
    status: database && redis ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    dbServices: {
      postgreSQL: {
        status: database ? 'healthy' : 'unhealthy',
        poolSize: pool.totalCount,
        idleConnections: pool.idleCount,
        waitingClients: pool.waitingCount,
      },
      redis: {
        status: redis ? 'healthy' : 'unhealthy',
        ready: redisClient.status === 'ready',
      },
    },
  };
};
