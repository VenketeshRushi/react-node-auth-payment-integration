import nodemailer from 'nodemailer';
import { APIError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

let transporter: ReturnType<typeof nodemailer.createTransport>;

const getTransporter = (): ReturnType<typeof nodemailer.createTransport> => {
  if (transporter) return transporter;

  const config: EmailConfig = {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  };

  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new APIError('Email configuration is incomplete', 500);
  }

  transporter = nodemailer.createTransport(config);
  return transporter;
};

/**
 * Send a single email
 */
export const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });

    return info;
  } catch (error: any) {
    logger.error('Email sending failed', {
      error: error.message,
      to: options.to,
      subject: options.subject,
    });
    throw new APIError('Failed to send email', 500);
  }
};

/**
 * Send bulk emails concurrently
 */
export const sendBulkEmail = async (emails: EmailOptions[]) => {
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  logger.info('Bulk email sending completed', {
    total: emails.length,
    successful,
    failed,
  });

  return { successful, failed, results };
};
