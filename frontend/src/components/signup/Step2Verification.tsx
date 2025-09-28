import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircleIcon,
  ArrowLeft,
  Smartphone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface OTPStatus {
  email: {
    sent: boolean;
    countdown: number;
  };
  mobile: {
    sent: boolean;
    countdown: number;
  };
}

interface Step2Props {
  formData: {
    email: string;
    phone: string;
    emailOtp: string;
    mobileOtp: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  otpStatus: OTPStatus;
  onFieldChange: (field: string, value: string) => void;
  onSendEmailOTP: () => void;
  onSendMobileOTP: () => void;
  onVerify: () => void;
  onBack: () => void;
  onResendEmailOTP: () => void;
  onResendMobileOTP: () => void;
  onValidateEmail: () => boolean;
  onValidatePhone: () => boolean;
}

export default function Step2Verification({
  formData,
  errors,
  isLoading,
  otpStatus,
  onFieldChange,
  onSendEmailOTP,
  onSendMobileOTP,
  onVerify,
  onBack,
  onResendEmailOTP,
  onResendMobileOTP,
  onValidateEmail,
  onValidatePhone,
}: Step2Props) {
  const canVerify =
    otpStatus.email.sent &&
    otpStatus.mobile.sent &&
    formData.emailOtp.length === 6 &&
    formData.mobileOtp.length === 6;

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h3 className='text-lg font-semibold mb-2'>Verify Your Identity</h3>
        <p className='text-sm text-muted-foreground'>
          We need to verify both your email and phone number to secure your
          account
        </p>
      </div>

      <div className='border rounded-lg p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Mail className='w-4 h-4 text-blue-600' />
            <Label className='text-sm font-medium'>Email Verification</Label>
          </div>
          {otpStatus.email.sent && (
            <CheckCircle2 className='w-4 h-4 text-green-600' />
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            value={formData.email}
            onChange={e => onFieldChange('email', e.target.value)}
            disabled
            className='bg-gray-50'
          />
          {errors.email && (
            <p className='text-xs text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-3 h-3' />
              {errors.email}
            </p>
          )}
        </div>

        {otpStatus.email.sent && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle2 className='h-4 w-4 stroke-green-600' />
            <AlertDescription className='text-green-700'>
              Verification code sent to your email
            </AlertDescription>
          </Alert>
        )}

        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-xs font-medium text-muted-foreground'>
              Enter 6-digit email code
            </Label>
            <button
              type='button'
              onClick={onResendEmailOTP}
              disabled={otpStatus.email.countdown > 0 || isLoading}
              className='text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400'
            >
              {otpStatus.email.countdown > 0
                ? `Resend in ${otpStatus.email.countdown}s`
                : otpStatus.email.sent
                  ? 'Resend Code'
                  : ''}
            </button>
          </div>

          <InputOTP
            maxLength={6}
            value={formData.emailOtp}
            onChange={value => onFieldChange('emailOtp', value)}
            className='justify-center'
          >
            <InputOTPGroup className='gap-1'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <InputOTPSlot
                  key={idx}
                  index={idx}
                  className='w-8 h-8 text-sm'
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {errors.emailOtp && (
            <p className='text-xs text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-3 h-3' />
              {errors.emailOtp}
            </p>
          )}
        </div>

        {!otpStatus.email.sent && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              if (onValidateEmail()) {
                onSendEmailOTP();
              }
            }}
            disabled={isLoading || !formData.email}
            className='w-full'
          >
            {isLoading ? 'Sending...' : 'Send Email Code'}
          </Button>
        )}
      </div>

      <div className='border rounded-lg p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Smartphone className='w-4 h-4 text-green-600' />
            <Label className='text-sm font-medium'>Mobile Verification</Label>
          </div>
          {otpStatus.mobile.sent && (
            <CheckCircle2 className='w-4 h-4 text-green-600' />
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone'>Mobile Number</Label>
          <Input
            id='phone'
            type='tel'
            placeholder='9876543210'
            value={formData.phone}
            onChange={e =>
              onFieldChange('phone', e.target.value.replace(/\D/g, ''))
            }
            className={cn(
              errors.phone &&
                'border-destructive-300 focus:border-destructive-500'
            )}
            maxLength={10}
          />
          {errors.phone && (
            <p className='text-xs text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-3 h-3' />
              {errors.phone}
            </p>
          )}
          <p className='text-xs text-muted-foreground'>
            Enter your 10-digit mobile number
          </p>
        </div>

        {otpStatus.mobile.sent && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle2 className='h-4 w-4 stroke-green-600' />
            <AlertDescription className='text-green-700'>
              Verification code sent to your mobile
            </AlertDescription>
          </Alert>
        )}

        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-xs font-medium text-muted-foreground'>
              Enter 6-digit mobile code
            </Label>
            <button
              type='button'
              onClick={onResendMobileOTP}
              disabled={otpStatus.mobile.countdown > 0 || isLoading}
              className='text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400'
            >
              {otpStatus.mobile.countdown > 0
                ? `Resend in ${otpStatus.mobile.countdown}s`
                : otpStatus.mobile.sent
                  ? 'Resend Code'
                  : ''}
            </button>
          </div>

          <InputOTP
            maxLength={6}
            value={formData.mobileOtp}
            onChange={value => onFieldChange('mobileOtp', value)}
            className='justify-center'
          >
            <InputOTPGroup className='gap-1'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <InputOTPSlot
                  key={idx}
                  index={idx}
                  className='w-8 h-8 text-sm'
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {errors.mobileOtp && (
            <p className='text-xs text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-3 h-3' />
              {errors.mobileOtp}
            </p>
          )}
        </div>

        {!otpStatus.mobile.sent && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              if (onValidatePhone()) {
                onSendMobileOTP();
              }
            }}
            disabled={
              isLoading || !formData.phone || formData.phone.length !== 10
            }
            className='w-full'
          >
            {isLoading ? 'Sending...' : 'Send Mobile Code'}
          </Button>
        )}
      </div>

      {errors.submit && (
        <Alert variant='destructive'>
          <AlertCircleIcon className='h-4 w-4' />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      {errors.success && (
        <Alert className='border-green-200 bg-green-50'>
          <CheckCircle2 className='h-4 w-4 stroke-green-600' />
          <AlertDescription className='text-green-700'>
            {errors.success}
          </AlertDescription>
        </Alert>
      )}

      <div className='space-y-4 mt-6 md:mt-8'>
        <Button
          onClick={onVerify}
          disabled={!canVerify || isLoading}
          className='w-full cursor-pointer'
        >
          {isLoading ? 'Verifying...' : 'Verify & Create Account'}
        </Button>

        <button
          type='button'
          onClick={onBack}
          className='w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to previous step
        </button>
      </div>
    </div>
  );
}
