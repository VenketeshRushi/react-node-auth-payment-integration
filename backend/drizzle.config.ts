import { config } from '@/config/loadEnv.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/services/database/schema.ts',
  out: './src/services/database/migrations',
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
  migrations: {
    table: '__drizzle_migrations__', // Name of the migrations tracking table
    schema: 'public', // Schema where tracking table will live
  },
});
