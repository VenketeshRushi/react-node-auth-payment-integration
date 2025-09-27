import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/config/database/schema.ts', // Path to your schema
  out: './src/config/database/migrations', // Must be a folder, not a file
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use the connection string from .env
  },
  migrations: {
    table: '__drizzle_migrations__', // Name of the migrations tracking table
    schema: 'public', // Schema where tracking table will live
  },
});
