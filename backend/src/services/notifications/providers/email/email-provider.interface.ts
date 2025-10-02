export interface IEmailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResult>;
  sendBulkEmail(emails: EmailOptions[]): Promise<BulkEmailResult>;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[] | undefined;
  replyTo?: string;
  cc?: string[] | undefined;
  bcc?: string[] | undefined;
}

export interface EmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

export interface BulkEmailResult {
  successful: number;
  failed: number;
  results: Array<{
    status: 'fulfilled' | 'rejected';
    value?: any;
    reason?: any;
  }>;
}

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
