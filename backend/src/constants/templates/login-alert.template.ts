import { EmailTemplate } from '../../types/email.types.js';
import { baseStyles } from './baseStyles.js';

export const loginAlertTemplate: EmailTemplate = {
  subject: '⚠️ New Login Detected',
  html: (location: string, device: string, userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Alert</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Login Alert</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>A new login to your account was detected:</p>
          <div class="alert-box">
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Device:</strong> ${device}</p>
          </div>
          <p>If this wasn't you, please reset your password immediately.</p>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
