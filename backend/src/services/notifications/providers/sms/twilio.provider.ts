import twilio from 'twilio';
import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';
import { APIError } from '@/utils/apiError.js';
import { formatPhoneNumber } from '@/utils/ext.js';
import {
  ISMSProvider,
  SMSOptions,
  SMSResult,
  BulkSMSResult,
} from './sms-provider.interface.js';

export class TwilioSMSProvider implements ISMSProvider {
  private client: ReturnType<typeof twilio> | null = null;

  private getClient() {
    if (this.client) return this.client;

    const smsConfig = {
      accountSid: config.TWILIO_ACCOUNT_SID,
      authToken: config.TWILIO_AUTH_TOKEN,
      fromPhone: config.TWILIO_PHONE_NUMBER,
    };

    if (!smsConfig.accountSid || !smsConfig.authToken || !smsConfig.fromPhone) {
      throw new APIError('Twilio configuration missing', 500);
    }

    this.client = twilio(smsConfig.accountSid, smsConfig.authToken);
    return this.client;
  }

  async sendSMS(options: SMSOptions): Promise<SMSResult> {
    try {
      const twilioClient = this.getClient();
      const toNumber = Array.isArray(options.to) ? options.to[0] : options.to;

      const message = await twilioClient.messages.create({
        body: options.message,
        from: options.from || config.TWILIO_PHONE_NUMBER,
        to: formatPhoneNumber(toNumber),
      });

      logger.info('SMS sent successfully', {
        sid: message.sid,
        to: toNumber,
        status: message.status,
      });

      return {
        messageId: message.sid,
        status: message.status,
        to: toNumber,
      };
    } catch (error: any) {
      logger.error('SMS sending failed', {
        error: error.message,
        to: options.to,
        code: error.code,
      });
      throw new APIError(`Failed to send SMS: ${error.message}`, 500);
    }
  }

  async sendBulkSMS(messages: SMSOptions[]): Promise<BulkSMSResult> {
    const results = await Promise.allSettled(
      messages.map(sms => this.sendSMS(sms))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.info('Bulk SMS sending completed', {
      total: messages.length,
      successful,
      failed,
    });

    return { successful, failed, results };
  }
}
