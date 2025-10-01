import { EmailTemplate } from '@/types/emailTemplate.js';
import { baseStyles } from './baseStyles.js';

export const verificationTemplate: EmailTemplate = {
  subject: '🔐 Verify Your Email Address',
  html: (otp: string, userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔐 Email Verification</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Thank you for signing up! To complete your registration, please verify your email address using the code below:</p>
          
          <div class="otp-container">
            <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">This code expires in 10 minutes</p>
          </div>

          <div class="security-tip">
            <strong>🔒 Security Tip:</strong> Never share this code with anyone. We will never ask for your verification code via phone or email.
          </div>

          <p>If you didn't request this verification, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2025 ACME INC. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
