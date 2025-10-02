import { logger } from '@/config/logger/index.js';
import { NotificationChannel } from './types/index.js';
import { NotificationFactory } from './notification.factory.js';
import { getEmailTemplate } from './providers/email/templates/index.js';

const notificationService = NotificationFactory.createNotificationService();

export const sendVerificationNotifications = (
  email: string,
  mobile: string,
  name: string,
  emailOTP: string,
  mobileOTP: string
): void => {
  setImmediate(async () => {
    const template = getEmailTemplate('verification');

    try {
      await Promise.allSettled([
        notificationService.send({
          channel: NotificationChannel.EMAIL,
          to: email,
          subject: template.subject,
          html: template.html(emailOTP, name),
        }),
        notificationService.send({
          channel: NotificationChannel.SMS,
          to: mobile,
          message: `Your verification OTP is: ${mobileOTP}. Valid for 5 minutes.`,
        }),
      ]);
    } catch (err) {
      logger.error('Unexpected error in verification notifications:', err);
    }
  });
};

export const sendResendNotifications = async (
  email: string,
  mobile: string,
  name: string,
  emailOTP: string | null,
  mobileOTP: string | null
): Promise<void> => {
  const template = getEmailTemplate('verification');
  const notifications = [];

  if (emailOTP) {
    notifications.push({
      channel: NotificationChannel.EMAIL,
      to: email,
      subject: template.subject,
      html: template.html(emailOTP, name),
    });
  }

  if (mobileOTP) {
    notifications.push({
      channel: NotificationChannel.SMS,
      to: mobile,
      message: `Your verification OTP is: ${mobileOTP}. Valid for 5 minutes.`,
    });
  }

  await notificationService.sendBulk(notifications);
};

export const sendMobileOTPNotification = (
  mobile: string,
  name: string,
  otp: string
): void => {
  setImmediate(async () => {
    try {
      await notificationService.send({
        channel: NotificationChannel.SMS,
        to: mobile,
        message: `Hello ${name}, your login OTP is: ${otp}. Valid for 5 minutes.`,
      });
    } catch (err) {
      logger.error('Failed to send login OTP SMS:', err);
    }
  });
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const template = getEmailTemplate('welcome');

  await notificationService.send({
    channel: NotificationChannel.EMAIL,
    to: email,
    subject: template.subject,
    html: template.html(name),
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string,
  resetUrl: string
): Promise<void> => {
  const template = getEmailTemplate('password-reset');

  await notificationService.send({
    channel: NotificationChannel.EMAIL,
    to: email,
    subject: template.subject,
    html: template.html(name, resetUrl, resetToken),
  });
};
