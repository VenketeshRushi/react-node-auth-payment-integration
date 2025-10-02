import { EmailTemplate } from '../email-provider.interface.js';
import { baseStyles } from './baseStyles.js';

export const resetTemplate: EmailTemplate = {
  subject: '🔄 Reset Your Password',
  html: (resetLink: string, userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Reset Password</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to proceed:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
