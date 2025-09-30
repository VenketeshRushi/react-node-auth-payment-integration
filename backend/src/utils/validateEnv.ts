const requiredEnvVars = [
  // Server
  'NODE_ENV',
  'PORT',
  'HOST',
  'FRONTEND_URL',
  'BACKEND_URL',

  // CORS
  'ALLOWED_ORIGIN',

  // LOG level
  'LOG_LEVEL',

  // Database
  'DATABASE_URL',
  'REDIS_DB',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_DB',
  'BYPASS_RATE_LIMIT_CHECK',

  // Auth Settings
  'MAX_LOGIN_ATTEMPTS',
  'LOCKOUT_DURATION',
  'REFRESH_EXPIRES_IN',
  'MAX_CONCURRENT_SESSIONS',
  'BCRYPT_SALT_ROUNDS',

  // JWT
  'JWT_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_ISSUER',
  'JWT_AUDIENCE',

  // Google oAuth
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',

  // Facebook oAuth
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'FACEBOOK_CALLBACK_URL',

  // SMTP Email Configuration
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_SERVICE',
  'FROM_EMAIL',
  'FROM_NAME',

  // Twilio OTP
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
];

export const validateEnv = (): void => {
  const missingVars = requiredEnvVars.filter(key => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(
      ` Missing required environment variables:\n${missingVars.join('\n')}`
    );
    process.exit(1); // Exit immediately if any variable is missing
  }

  console.log('All required environment variables are present.');
};
