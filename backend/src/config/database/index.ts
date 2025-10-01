import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, DatabaseError } from 'pg';
import { databaseConfig } from './database.config.js';
import { config, logger } from '../index.js';

// Create the connection pool
const pool = new Pool(databaseConfig);

// Pool event handlers
pool.on('connect', _client => {
  logger.info('PostgreSQL client connected to pool');
});

pool.on('acquire', _client => {
  logger.debug('PostgreSQL client acquired from pool');
});

pool.on('remove', _client => {
  logger.debug('PostgreSQL client removed from pool');
});

pool.on('error', (err: Error, _client) => {
  const dbError = err as DatabaseError;
  logger.error('PostgreSQL pool error', {
    message: dbError.message,
    code: dbError.code,
    stack: config.NODE_ENV === 'development' ? dbError.stack : undefined,
  });
});

// Test the pool connection on startup
const testPoolConnection = async () => {
  try {
    logger.info('Testing PostgreSQL pool connection...');
    const client = await pool.connect();
    const result = await client.query(
      'SELECT NOW() as time, current_database() as db, current_user as user'
    );
    logger.info('PostgreSQL pool connection test successful', {
      time: result.rows[0].time,
      database: result.rows[0].db,
      user: result.rows[0].user,
    });
    client.release();
    return true;
  } catch (error) {
    const dbError = error as DatabaseError;
    logger.error('PostgreSQL pool connection test failed', {
      message: dbError.message,
      code: dbError.code,
      hint: (dbError as any).hint,
    });
    return false;
  }
};

const shutdownPool = async () => {
  try {
    logger.info('Closing PostgreSQL pool...');
    await pool.end();
    logger.info('PostgreSQL pool closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing PostgreSQL pool', {
      message: (error as Error).message,
    });
    process.exit(1);
  }
};

process.on('SIGINT', shutdownPool);
process.on('SIGTERM', shutdownPool);

const db = drizzle(pool, {
  logger: config.NODE_ENV === 'development',
});

export { pool, db, testPoolConnection };
