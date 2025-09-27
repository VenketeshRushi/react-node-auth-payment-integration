export const databaseConfig = {
  connectionString: process.env.DATABASE_URL || '',
  max: 20, // Maximum connections in pool
  min: 2, // Minimum connections to keep open
  idleTimeoutMillis: 30_000, // Close idle connections after 30s
  connectionTimeoutMillis: 2_000, // Connection timeout
};
