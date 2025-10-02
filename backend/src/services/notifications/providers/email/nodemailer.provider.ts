import nodemailer from 'nodemailer';
import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';
import { APIError } from '@/utils/apiError.js';
import {
  IEmailProvider,
  EmailOptions,
  EmailResult,
  BulkEmailResult,
} from './email-provider.interface.js';

export class NodemailerEmailProvider implements IEmailProvider {
  private transporter: ReturnType<typeof nodemailer.createTransport> | null =
    null;

  private getTransporter() {
    if (this.transporter) return this.transporter;

    const emailConfig = {
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    };

    if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
      throw new APIError('Email configuration is incomplete', 500);
    }

    this.transporter = nodemailer.createTransport(emailConfig);
    return this.transporter;
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const transporter = this.getTransporter();

      const mailOptions = {
        from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
        replyTo: options.replyTo,
        cc: options.cc?.join(', '),
        bcc: options.bcc?.join(', '),
      };

      const info = await transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return {
        messageId: info.messageId,
        accepted: info.accepted as string[],
        rejected: info.rejected as string[],
      };
    } catch (error: any) {
      logger.error('Email sending failed', {
        error: error.message,
        to: options.to,
        subject: options.subject,
      });
      throw new APIError(`Failed to send email: ${error.message}`, 500);
    }
  }

  async sendBulkEmail(emails: EmailOptions[]): Promise<BulkEmailResult> {
    const results = await Promise.allSettled(
      emails.map(email => this.sendEmail(email))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.info('Bulk email sending completed', {
      total: emails.length,
      successful,
      failed,
    });

    return { successful, failed, results };
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      logger.info('Email provider connection verified');
      return true;
    } catch (error: any) {
      logger.error('Email provider connection failed', {
        error: error.message,
      });
      return false;
    }
  }
}
