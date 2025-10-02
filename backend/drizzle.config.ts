import { config } from './src/config/loadEnv.js';
import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/models/**/*.model.ts',
  out: './src/database/migrations',
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  migrations: {
    table: '__drizzle_migrations__', // Name of the migrations tracking table
    schema: 'public', // Schema where tracking table will live
  },
}) satisfies Config;
