import { defineConfig } from 'drizzle-kit';
import { config } from './src/config/config.js';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/config/database/schema.ts',
  out: './src/config/database/migrations',
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
  migrations: {
    table: '__drizzle_migrations__', // Name of the migrations tracking table
    schema: 'public', // Schema where tracking table will live
  },
});
