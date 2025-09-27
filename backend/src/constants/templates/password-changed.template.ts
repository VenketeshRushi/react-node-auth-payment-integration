import { EmailTemplate } from '../../../../New folder (9)/backend/src/types/email.types.js';
import { baseStyles } from './baseStyles.js';

export const passwordChangedTemplate: EmailTemplate = {
  subject: '🔑 Your Password Has Been Changed',
  html: (userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Password Changed</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>This is to confirm that your password was successfully changed.</p>
          <p>If you didn’t make this change, reset your password immediately.</p>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
