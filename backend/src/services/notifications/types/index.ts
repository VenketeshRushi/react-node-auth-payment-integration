export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface NotificationPayload {
  channel: NotificationChannel;
  to: string | string[];
  subject?: string;
  message?: string;
  html?: string;
  template?: string;
  templateData?: Record<string, any>;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
  attachments?: any[] | undefined;
}

export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

export interface INotificationProvider {
  send(payload: NotificationPayload): Promise<NotificationResult>;
  sendBulk(payloads: NotificationPayload[]): Promise<NotificationResult[]>;
}

export interface INotificationQueue {
  add(payload: NotificationPayload): Promise<void>;
  addBulk(payloads: NotificationPayload[]): Promise<void>;
  process(handler: (payload: NotificationPayload) => Promise<void>): void;
}
