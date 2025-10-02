import { logger } from '@/config/logger/index.js';
import { APIError } from '@/utils/apiError.js';
import {
  NotificationPayload,
  NotificationResult,
  NotificationChannel,
  INotificationProvider,
} from './types/index.js';
import { IEmailProvider } from './providers/email/email-provider.interface.js';
import { ISMSProvider } from './providers/sms/sms-provider.interface.js';

export class NotificationService implements INotificationProvider {
  constructor(
    private emailProvider: IEmailProvider,
    private smsProvider: ISMSProvider
  ) {}

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    try {
      switch (payload.channel) {
        case NotificationChannel.EMAIL:
          return await this.sendEmail(payload);
        case NotificationChannel.SMS:
          return await this.sendSMS(payload);
        default:
          throw new APIError(
            `Unsupported notification channel: ${payload.channel}`,
            400
          );
      }
    } catch (error: any) {
      logger.error('Notification sending failed', {
        channel: payload.channel,
        error: error.message,
      });

      return {
        success: false,
        channel: payload.channel,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  private async sendEmail(
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    const result = await this.emailProvider.sendEmail({
      to: payload.to,
      subject: payload.subject || 'Notification',
      html: payload.html || payload.message || '',
      attachments: payload.attachments,
    });

    return {
      success: true,
      channel: NotificationChannel.EMAIL,
      messageId: result.messageId,
      timestamp: new Date(),
    };
  }

  private async sendSMS(
    payload: NotificationPayload
  ): Promise<NotificationResult> {
    const result = await this.smsProvider.sendSMS({
      to: payload.to,
      message: payload.message || '',
    });

    return {
      success: true,
      channel: NotificationChannel.SMS,
      messageId: result.messageId,
      timestamp: new Date(),
    };
  }

  async sendBulk(
    payloads: NotificationPayload[]
  ): Promise<NotificationResult[]> {
    const results = await Promise.allSettled(
      payloads.map(payload => this.send(payload))
    );

    return results.map(result =>
      result.status === 'fulfilled'
        ? result.value
        : {
            success: false,
            channel: NotificationChannel.EMAIL,
            error: result.reason?.message,
            timestamp: new Date(),
          }
    );
  }
}
