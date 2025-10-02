export interface ISMSProvider {
  sendSMS(options: SMSOptions): Promise<SMSResult>;
  sendBulkSMS(messages: SMSOptions[]): Promise<BulkSMSResult>;
}

export interface SMSOptions {
  to: string | string[];
  message: string;
  from?: string;
}

export interface SMSResult {
  messageId: string;
  status: string;
  to: string;
}

export interface BulkSMSResult {
  successful: number;
  failed: number;
  results: Array<{
    status: 'fulfilled' | 'rejected';
    value?: any;
    reason?: any;
  }>;
}
