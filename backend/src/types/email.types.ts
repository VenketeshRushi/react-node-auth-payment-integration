export interface EmailTemplate {
  subject: string;
  html: (...args: any[]) => string;
}

export interface EmailTemplates {
  verification: EmailTemplate;
  reset: EmailTemplate;
  welcome: EmailTemplate;
  loginAlert: EmailTemplate;
  accountLocked: EmailTemplate;
  passwordChanged: EmailTemplate;
  accountActivated: EmailTemplate;
  sessionExpiry: EmailTemplate;
}
