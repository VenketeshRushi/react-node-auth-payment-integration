import { PoolConfig } from 'pg';
import { config } from '../config.js';

export const databaseConfig: PoolConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,

  // Pool configuration
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30_000, // Close idle connections after 30s
  connectionTimeoutMillis: 5_000, // Increased from 2s to 5s

  // SSL config (disable in dev, enable in prod)
  ssl:
    config.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined, // use undefined instead of false for PoolConfig type safety

  application_name: 'backend',

  // These are passed via `SET` after connection
  statement_timeout: 10_000, // 10 seconds
  query_timeout: 10_000, // 10 seconds
};
