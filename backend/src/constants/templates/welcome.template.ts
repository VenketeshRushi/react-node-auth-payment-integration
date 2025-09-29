import { EmailTemplate } from '../../types/email.types.js';
import { baseStyles } from './baseStyles.js';

export const welcomeTemplate: EmailTemplate = {
  subject: '🎉 Welcome to MyCompany!',
  html: (userName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Welcome Aboard, ${userName}!</h1>
        </div>
        <div class="content">
          <p>We're excited to have you at MyCompany. Start exploring our services today!</p>
          <a href="https://mycompany.com" class="button">Get Started</a>
        </div>
        <div class="footer">
          <p>© 2025 MyCompany. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
