import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';
import { config } from '@/config/loadEnv.js';
import { usersTable } from '@/models/users.model.js';

const { Client } = pg;

const seed = async () => {
  const client = new Client({
    connectionString: config.DATABASE_URL,
  });

  try {
    console.log('🌱 Starting database seeding...');
    await client.connect();
    console.log('✅ Connected to database');

    const db = drizzle(client);

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Password@123', 10);

    console.log('👥 Seeding users...');

    // Create Super Admin
    await db.insert(usersTable).values({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      mobile_no: '+1234567890',
      role: 'superadmin',
      is_active: true,
      is_banned: false,
      timezone: 'UTC',
      language: 'en',
      last_login_method: 'email_password',
      login_count: 0,
      failed_login_attempts: 0,
    });

    // Create Admin
    await db.insert(usersTable).values({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      mobile_no: '+1234567891',
      role: 'admin',
      is_active: true,
      is_banned: false,
      timezone: 'UTC',
      language: 'en',
      last_login_method: 'email_password',
      login_count: 0,
      failed_login_attempts: 0,
    });

    // Create Regular Users
    await db.insert(usersTable).values([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        mobile_no: '+1234567892',
        role: 'user',
        is_active: true,
        is_banned: false,
        timezone: 'America/New_York',
        language: 'en',
        last_login_method: 'email_password',
        login_count: 5,
        failed_login_attempts: 0,
      },
    ]);

    console.log('✅ Seeding completed successfully!');
    console.log('\n📋 Default Credentials:');
    console.log('   Super Admin: superadmin@example.com / Password@123');
    console.log('   Admin: admin@example.com / Password@123');
    console.log('   User: john.doe@example.com / Password@123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    console.log('🔌 Closing database connection...');
    await client.end();
    console.log('✅ Connection closed');
  }
};

seed();
