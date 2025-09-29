import { EmailTemplate } from '../../types/email.types.js';
import { baseStyles } from './baseStyles.js';

export const sessionExpiryTemplate: EmailTemplate = {
  subject: '⌛ Session Expired',
  html: (userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Expired</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Session Expired</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Your session has expired due to inactivity.</p>
          <p>Log back in to continue using your account.</p>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
