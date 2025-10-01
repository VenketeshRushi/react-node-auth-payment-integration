import twilio from 'twilio';
import { config } from '../config/config.js';
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
  const smsConfig = {
    accountSid: config.TWILIO_ACCOUNT_SID,
    authToken: config.TWILIO_AUTH_TOKEN,
    fromPhone: config.TWILIO_PHONE_NUMBER,
  };

  if (!smsConfig.accountSid || !smsConfig.authToken || !smsConfig.fromPhone) {
    throw new APIError('Twilio configuration missing', 500);
  }

  return smsConfig;
};

// Lazy initialization - don't create client until first use
let client: ReturnType<typeof twilio> | null = null;

const getClient = () => {
  if (!client) {
    const smsConfig = getSMSConfig();
    client = twilio(smsConfig.accountSid, smsConfig.authToken);
  }
  return client;
};

export const sendSMS = async (options: SMSOptions) => {
  try {
    const smsConfig = getSMSConfig();
    const twilioClient = getClient();

    const message = await twilioClient.messages.create({
      body: options.message,
      from: smsConfig.fromPhone,
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
