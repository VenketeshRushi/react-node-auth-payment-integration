import twilio from 'twilio';
import { APIError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
import { formatPhoneNumber } from '../utils/validations/mobile.utils.js';

interface SMSOptions {
  to: string;
  message: string;
}

interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromPhone: string;
}

const getSMSConfig = (): SMSConfig => {
  const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    fromPhone: process.env.TWILIO_PHONE_NUMBER!,
  };

  if (!config.accountSid || !config.authToken || !config.fromPhone) {
    throw new APIError('Twilio configuration missing', 500);
  }

  return config;
};

// Create Twilio client singleton
const client = (() => {
  const config = getSMSConfig();
  return twilio(config.accountSid, config.authToken);
})();

/**
 * Send a single SMS
 */
export const sendSMS = async (options: SMSOptions) => {
  try {
    const config = getSMSConfig();

    const message = await client.messages.create({
      body: options.message,
      from: config.fromPhone,
      to: formatPhoneNumber(options.to),
    });

    logger.info('SMS sent successfully', {
      sid: message.sid,
      to: options.to,
      status: message.status,
    });

    return message;
  } catch (error: any) {
    logger.error('SMS sending failed', {
      error: error.message,
      to: options.to,
      code: error.code,
    });
    throw new APIError('Failed to send SMS', 500);
  }
};

/**
 * Send multiple SMS messages concurrently
 */
export const sendBulkSMS = async (messages: SMSOptions[]) => {
  const results = await Promise.allSettled(messages.map(sms => sendSMS(sms)));

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  logger.info('Bulk SMS sending completed', {
    total: messages.length,
    successful,
    failed,
  });

  return { successful, failed, results };
};
