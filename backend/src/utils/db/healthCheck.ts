import { pool } from '../../config/database/index.js';
import { redisClient } from '../../config/redis/client.js';
import { logger } from '../logger.js';

const checkDbConnection = async (): Promise<boolean> => {
  let client;
  try {
    // Get a client from the pool
    client = await pool.connect();

    // Execute a simple query
    const result = await client.query('SELECT 1 as test');

    logger.info('Database connection successful', {
      result: result.rows[0],
    });

    return true;
  } catch (error: any) {
    logger.error('Database connection failed', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      hint: error?.hint,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });

    // Log specific error types for debugging
    if (error?.code === 'ECONNREFUSED') {
      logger.error(
        'Connection refused - PostgreSQL may not be running or host/port is incorrect'
      );
    } else if (error?.code === '28P01') {
      logger.error('Authentication failed - check DB_USER and DB_PASSWORD');
    } else if (error?.code === '3D000') {
      logger.error('Database does not exist - check DB_NAME');
    } else if (error?.code === 'ETIMEDOUT') {
      logger.error('Connection timeout - PostgreSQL may be slow to respond');
    }

    return false;
  } finally {
    // Always release the client back to the pool
    if (client) {
      client.release();
    }
  }
};

const checkRedisConnection = async (): Promise<boolean> => {
  try {
    const result = await redisClient.ping();

    if (result === 'PONG') {
      logger.info('Redis connection successful');
      return true;
    }

    logger.error('Redis ping returned unexpected result', { result });
    return false;
  } catch (error: any) {
    logger.error('Redis connection failed', {
      message: error?.message,
      code: error?.code,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
    return false;
  }
};

// Returns per-service status
export const checkAllConnections = async (): Promise<{
  database: boolean;
  redis: boolean;
}> => {
  logger.info('Checking all service connections...');

  const [dbOk, redisOk] = await Promise.allSettled([
    checkDbConnection(),
    checkRedisConnection(),
  ]);

  const dbStatus = dbOk.status === 'fulfilled' && dbOk.value;
  const redisStatus = redisOk.status === 'fulfilled' && redisOk.value;

  logger.info('Connection check results', {
    database: dbStatus ? 'connected' : 'failed',
    redis: redisStatus ? 'connected' : 'failed',
  });

  return {
    database: dbStatus,
    redis: redisStatus,
  };
};

export const getHealthStatus = async () => {
  const [dbOk, redisOk] = await Promise.allSettled([
    checkDbConnection(),
    checkRedisConnection(),
  ]);

  const dbStatus = dbOk.status === 'fulfilled' && dbOk.value;
  const redisStatus = redisOk.status === 'fulfilled' && redisOk.value;
  const overallStatus = dbStatus && redisStatus ? 'healthy' : 'unhealthy';

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    dbServices: {
      postgreSQL: {
        status: dbStatus ? 'healthy' : 'unhealthy',
        poolSize: pool.totalCount,
        idleConnections: pool.idleCount,
        waitingClients: pool.waitingCount,
      },
      redis: {
        status: redisStatus ? 'healthy' : 'unhealthy',
        ready: redisClient.status === 'ready',
      },
    },
  };
};

export const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
};
