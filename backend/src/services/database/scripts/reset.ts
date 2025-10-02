import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { config } from '@/config/loadEnv.js';

const { Client } = pg;

const reset = async () => {
  // Safety check - prevent accidental production reset
  if (config.NODE_ENV === 'production') {
    console.error('❌ Cannot reset database in production environment!');
    process.exit(1);
  }

  const client = new Client({
    connectionString: config.DATABASE_URL,
  });

  try {
    console.log('🗑️  Resetting database...');
    console.log('⚠️  WARNING: This will delete all data!');

    await client.connect();
    console.log('✅ Connected to database');

    const db = drizzle(client);

    // Drop all tables and recreate schema
    console.log('🗑️  Dropping all tables...');
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);

    console.log('✅ Database reset successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run db:generate (if schema changed)');
    console.log('   2. Run: npm run db:migrate');
    console.log('   3. Run: npm run db:seed');
    console.log('\n💡 Or use: npm run db:fresh (does all steps)');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

reset();
