import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { databaseConfig } from './database.config.js';
import { logger } from '../../utils/logger.js';

const pool = new Pool(databaseConfig);

pool.on('connect', () => {
  logger.info('PostgreSQL client connected');
});

pool.on('error', err => {
  logger.error('PostgreSQL pool error:', err);
});

const shutdownPool = async () => {
  try {
    logger.info('Closing PostgreSQL pool...');
    await pool.end();
    logger.info('PostgreSQL pool closed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing PostgreSQL pool', error);
    process.exit(1);
  }
};

process.on('SIGINT', shutdownPool);
process.on('SIGTERM', shutdownPool);

const db = drizzle(pool);

export { pool, db };
