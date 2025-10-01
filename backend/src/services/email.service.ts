import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';
import { APIError } from '@/utils/apiError.js';
import nodemailer from 'nodemailer';

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

  const emailConfig: EmailConfig = {
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

  transporter = nodemailer.createTransport(emailConfig);
  return transporter;
};

export const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
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
