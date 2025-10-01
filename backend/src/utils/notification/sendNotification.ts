import { sendEmail } from '../../services/email.service.js';
import { sendSMS } from '../../services/sms.service.js';
import { getEmailTemplate } from '../../constants/templates/index.js';
import { APIError } from '../apiError.js';
import { logger } from '../../config/index.js';

export const sendVerificationNotifications = (
  email: string,
  mobile: string,
  name: string,
  emailOTP: string,
  mobileOTP: string
): void => {
  setImmediate(() => {
    const template = getEmailTemplate('verification');

    Promise.all([
      sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(emailOTP, name),
      }).catch(err => {
        logger.error('Failed to send verification email:', err);
        return null;
      }),
      sendSMS({
        to: mobile,
        message: `Your verification OTP is: ${mobileOTP}. Valid for 5 minutes.`,
      }).catch(err => {
        logger.error('Failed to send verification SMS:', err);
        return null;
      }),
    ])
      .then(results => {
        const emailSent = results[0] !== null;
        const smsSent = results[1] !== null;

        if (!emailSent || !smsSent) {
          logger.warn('Some notifications failed to send', {
            email: emailSent,
            sms: smsSent,
            userEmail: email,
          });
        }
      })
      .catch(err => {
        logger.error('Unexpected error in notification sending:', err);
      });
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
  const promises: Promise<any>[] = [];

  if (emailOTP) {
    promises.push(
      sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(emailOTP, name),
      }).catch(err => {
        logger.error('Failed to resend verification email:', err);
        throw new APIError('Failed to send email OTP', 500);
      })
    );
  }

  if (mobileOTP) {
    promises.push(
      sendSMS({
        to: mobile,
        message: `Your verification OTP is: ${mobileOTP}. Valid for 5 minutes.`,
      }).catch(err => {
        logger.error('Failed to resend verification SMS:', err);
        throw new APIError('Failed to send mobile OTP', 500);
      })
    );
  }

  await Promise.all(promises);
};

export const sendMobileOTPNotification = (
  mobile: string,
  name: string,
  otp: string
): void => {
  setImmediate(() => {
    sendSMS({
      to: mobile,
      message: `Hello ${name}, your login OTP is: ${otp}. Valid for 5 minutes.`,
    }).catch(err => {
      logger.error('Failed to send login OTP SMS:', err);
    });
  });
};
