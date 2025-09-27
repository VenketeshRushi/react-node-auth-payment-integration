import { EmailTemplate } from '../../../../New folder (9)/backend/src/types/email.types.js';
import { baseStyles } from './baseStyles.js';

export const accountActivatedTemplate: EmailTemplate = {
  subject: '✅ Your Account is Activated',
  html: (userName: string = 'User') => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Activated</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Account Activated</h1>
        </div>
        <div class="content">
          <h2>Congratulations ${userName}!</h2>
          <p>Your account has been successfully activated. You can now log in and use our services.</p>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
