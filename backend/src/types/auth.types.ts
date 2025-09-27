export interface TempUserData {
  name: string;
  email: string;
  mobile_no: string;
  password: string;
  email_verified: boolean;
  mobile_verified: boolean;
  email_otp_attempts: number;
  mobile_otp_attempts: number;
  created_at: number;
  last_otp_sent?: number;
}

export interface GetMachineIdResponse {
  machineId: string;
}

export interface RegisterTempUserParams {
  name: string;
  email: string;
  mobile_no: string;
  password: string;
}

export interface RegisterTempUserResponse {
  email: string;
  mobile_no: string;
  next_step: 'verify_otp';
  verification_required: ['email', 'mobile'];
  otp_validity: string;
}

export interface VerifyOTPRequest {
  email: string;
  mobile_no: string;
  type: VerificationType;
  otp: string;
}

export interface VerifyOTPPartialResponse {
  email: string;
  mobile_no: string;
  verifiedType: VerificationType;
  email_verified: boolean;
  mobile_verified: boolean;
  message: string;
  isComplete: false;
}

export interface VerifyOTPCompleteResponse {
  user: {
    id: string;
    name: string;
    email: string;
    mobile_no: string;
    role: string;
    created_at: string;
  };
  message: string;
  isComplete: true;
}

export type VerifyOTPResponse =
  | VerifyOTPPartialResponse
  | VerifyOTPCompleteResponse;

export enum VerificationType {
  EMAIL = 'email',
  MOBILE = 'mobile',
}

export interface ResendOTPRequest {
  email: string;
  mobile_no: string;
}

export interface ResendOTPResponse {
  email: string;
  mobile_no: string;
  otp_validity: string;
  resend_cooldown: string;
}

export interface LoginWithPasswordParams {
  email: string;
  password: string;
}

export interface SendMobileOTPParams {
  mobile_no: string;
}

export interface LoginWithMobileOTPParams {
  mobile_no: string;
  otp: string;
}

export interface LoginResult {
  user: {
    id: string;
    name: string;
    email: string;
    mobile_no: string;
    role: string;
    avatar_url?: string;
    last_login_at?: Date;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  message: string;
}

export interface MobileOTPResult {
  mobile_no: string;
  message: string;
  otp_validity: string;
}
