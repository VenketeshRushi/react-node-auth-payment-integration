import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

const result = dotenv.config({
  path: path.resolve(__dirname, `../../${envFile}`),
});

if (result.error) {
  console.error('Error loading .env file:', result.error.message);
  process.exit(1);
}

const loadedVars = Object.keys(result.parsed || {}).length;
console.log(`✅ Environment loaded: ${loadedVars} variables from ${envFile}`);

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  HOST: process.env.HOST || '0.0.0.0',

  FRONTEND_URL: process.env.FRONTEND_URL!,
  BACKEND_URL: process.env.BACKEND_URL!,
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || '*',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  DATABASE_URL: process.env.DATABASE_URL!,
  DB_USER: process.env.DB_USER || 'devuser',
  DB_PASSWORD: process.env.DB_PASSWORD || 'devpass123',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || 'auth_db',

  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_DB: Number(process.env.REDIS_DB) || 0,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'redis123',
  REDIS_KEY_PREFIX: process.env.REDIS_KEY_PREFIX || 'app:',

  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_ISSUER: process.env.JWT_ISSUER || 'auth-service',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'auth-clients',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL!,

  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  SMTP_SERVICE: process.env.SMTP_SERVICE!,
  FROM_EMAIL: process.env.FROM_EMAIL!,
  FROM_NAME: process.env.FROM_NAME!,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER!,
};
