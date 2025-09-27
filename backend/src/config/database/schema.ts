import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';

export const UserRoleEnum = pgEnum('user_role', [
  'user',
  'admin',
  'superadmin',
]);

export const LoginMethodEnum = pgEnum('login_method', [
  'email_password',
  'google_oauth',
  'facebook_oauth',
  'mobile_otp',
]);

// Main Users table
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),

  // Basic Info
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  mobile_no: varchar('mobile_no', { length: 15 }).notNull().unique(),

  // OAuth IDs
  google_id: varchar('google_id', { length: 100 }).unique(),
  facebook_id: varchar('facebook_id', { length: 100 }).unique(),

  // Account Status
  is_active: boolean('is_active').notNull().default(false),
  is_banned: boolean('is_banned').notNull().default(false),

  // Role
  role: UserRoleEnum('role').notNull().default('user'),

  // Profile
  avatar_url: varchar('avatar_url', { length: 500 }),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  language: varchar('language', { length: 10 }).default('en'),

  // Tracking
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  last_login_method: LoginMethodEnum('last_login_method'),
  login_count: integer('login_count').notNull().default(0),

  failed_login_attempts: integer('failed_login_attempts').notNull().default(0),
  locked_until: timestamp('locked_until', { withTimezone: true }),

  // Soft Delete
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
  deleted_by: uuid('deleted_by'),

  // Timestamps
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
