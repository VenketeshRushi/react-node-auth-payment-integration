import { verificationTemplate } from './verification.template.js';
import { resetTemplate } from './reset.template.js';
import { welcomeTemplate } from './welcome.template.js';
import { loginAlertTemplate } from './login-alert.template.js';
import { accountLockedTemplate } from './account-locked.template.js';
import { passwordChangedTemplate } from './password-changed.template.js';
import { accountActivatedTemplate } from './account-activated.template.js';
import { sessionExpiryTemplate } from './session-expiry.template.js';
import { EmailTemplates } from '../email-provider.interface.js';

const emailTemplates: EmailTemplates = {
  verification: verificationTemplate,
  reset: resetTemplate,
  welcome: welcomeTemplate,
  loginAlert: loginAlertTemplate,
  accountLocked: accountLockedTemplate,
  passwordChanged: passwordChangedTemplate,
  accountActivated: accountActivatedTemplate,
  sessionExpiry: sessionExpiryTemplate,
};

export const getEmailTemplate = (type: keyof EmailTemplates) =>
  emailTemplates[type];

export default emailTemplates;
