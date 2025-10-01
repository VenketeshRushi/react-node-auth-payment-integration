import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { config } from '../config.js';

const { Client } = pg;

const runMigrations = async () => {
  const client = new Client({
    connectionString: config.DATABASE_URL,
  });

  try {
    console.log('Connecting to PostgreSQL for migrations...');
    await client.connect();

    const db = drizzle(client);

    console.log('Running migrations...');
    await migrate(db, {
      migrationsFolder: 'src/database/migrations',
    });

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    console.log('Closing PostgreSQL client...');
    await client.end();
  }
};

runMigrations();
