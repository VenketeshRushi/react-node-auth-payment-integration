import { pool } from '@/services/database/client.js';
import { redisClient } from '@/services/redis/client.js';

export const checkDbConnection = async (): Promise<boolean> => {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1'); // simple ping
    return true;
  } catch {
    return false;
  } finally {
    if (client) client.release();
  }
};

export const checkRedisConnection = async (): Promise<boolean> => {
  try {
    return (await redisClient.ping()) === 'PONG';
  } catch {
    return false;
  }
};

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
