import { EmailTemplate } from '../../../../New folder (9)/backend/src/types/email.types.js';
import { baseStyles } from './baseStyles.js';

export const accountLockedTemplate: EmailTemplate = {
  subject: '🔒 Account Locked Due to Suspicious Activity',
  html: (unlockLink: string, userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Locked</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Account Locked</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Your account has been temporarily locked due to multiple failed login attempts.</p>
          <p>Click the button below to unlock your account:</p>
          <a href="${unlockLink}" class="button">Unlock Account</a>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
