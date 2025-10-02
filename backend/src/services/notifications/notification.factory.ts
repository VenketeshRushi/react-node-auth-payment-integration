import { NotificationService } from './notification.service.js';
import { NodemailerEmailProvider } from './providers/email/nodemailer.provider.js';
import { TwilioSMSProvider } from './providers/sms/twilio.provider.js';

export class NotificationFactory {
  static createNotificationService(): NotificationService {
    const emailProvider = new NodemailerEmailProvider();
    const smsProvider = new TwilioSMSProvider();

    return new NotificationService(emailProvider, smsProvider);
  }
}
