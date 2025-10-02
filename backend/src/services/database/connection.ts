import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolClient, DatabaseError } from 'pg';
import { databaseConfig } from './database.config.js';
import { logger } from '@/config/logger/index.js';
import { config } from '@/config/loadEnv.js';

// Create the connection pool
const pool = new Pool(databaseConfig);

// Pool event handlers
pool.on('connect', (_client: PoolClient) => {
  logger.info('PostgreSQL client connected to pool');
});

pool.on('acquire', (_client: PoolClient) => {
  logger.debug('PostgreSQL client acquired from pool');
});

pool.on('remove', (_client: PoolClient) => {
  logger.debug('PostgreSQL client removed from pool');
});

pool.on('error', (err: Error, _client: PoolClient) => {
  const dbError = err as DatabaseError;
  logger.error('PostgreSQL pool error', {
    message: dbError.message,
    code: dbError.code,
    stack: config.NODE_ENV === 'development' ? dbError.stack : undefined,
  });
});

const shutdownPool = async (): Promise<void> => {
  try {
    logger.info('Closing PostgreSQL pool...');
    await pool.end();
    logger.info('PostgreSQL pool closed successfully');
    process.exit(0);
  } catch (error) {
    const e = error as Error;
    logger.error('Error closing PostgreSQL pool', { message: e.message });
    process.exit(1);
  }
};

process.on('SIGINT', shutdownPool);
process.on('SIGTERM', shutdownPool);

const db = drizzle(pool, {
  logger: config.NODE_ENV === 'development',
});

export { pool, db };
