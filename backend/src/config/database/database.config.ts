import { configDotenv } from 'dotenv';
import { PoolConfig } from 'pg';

configDotenv();

export const databaseConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'devuser',
  password: process.env.DB_PASSWORD || 'devpass123',
  database: process.env.DB_NAME || 'auth_db',

  // Pool configuration
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30_000, // Close idle connections after 30s
  connectionTimeoutMillis: 5_000, // Increased from 2s to 5s

  // SSL config (disable in dev, enable in prod)
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined, // use undefined instead of false for PoolConfig type safety

  application_name: 'backend',

  // These are passed via `SET` after connection
  statement_timeout: 10_000, // 10 seconds
  query_timeout: 10_000, // 10 seconds
};
