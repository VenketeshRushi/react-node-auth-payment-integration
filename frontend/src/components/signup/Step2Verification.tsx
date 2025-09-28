import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircleIcon,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface Step2Props {
  formData: {
    phone: string;
    otp: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  otpSent: boolean;
  countdown: number;
  onFieldChange: (field: string, value: string) => void;
  onSendOTP: () => void;
  onVerify: () => void;
  onBack: () => void;
  onResendOTP: () => void;
}

export default function Step2Verification({
  formData,
  errors,
  isLoading,
  otpSent,
  countdown,
  onFieldChange,
  onSendOTP,
  onVerify,
  onBack,
  onResendOTP,
}: Step2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      onSendOTP();
    } else {
      onVerify();
    }
  };

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {!otpSent && (
          <div className='space-y-2'>
            <Label htmlFor='phone' className='flex items-center gap-2'>
              <Smartphone className='w-4 h-4' />
              Mobile Number
            </Label>
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
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircleIcon className='w-4 h-4' />
                {errors.phone}
              </p>
            )}
            <p className='text-xs text-muted-foreground'>
              We'll send a 6-digit verification code to this number
            </p>
          </div>
        )}

        {otpSent && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle2 className='h-4 w-4 stroke-green-600' />
            <AlertDescription className='text-green-700'>
              Verification code sent to +91-{formData.phone}
            </AlertDescription>
          </Alert>
        )}

        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-sm font-medium'>Enter 6-digit code</Label>
            <button
              type='button'
              onClick={onResendOTP}
              disabled={countdown > 0}
              className='text-sm text-blue-600 hover:text-blue-700'
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
          </div>

          <InputOTP
            maxLength={6}
            value={formData.otp}
            onChange={value => onFieldChange('otp', value)}
            className='justify-center'
          >
            <InputOTPGroup className='gap-2'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <InputOTPSlot
                  key={idx}
                  index={idx}
                  className='w-12 h-12 text-lg font-semibold'
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {errors.otp && (
            <p className='text-sm text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-4 h-4' />
              {errors.otp}
            </p>
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
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading
              ? 'Please wait...'
              : otpSent
                ? 'Verify & Create Account'
                : 'Send Verification Code'}
          </Button>

          <p
            onClick={onBack}
            className='w-full flex items-center justify-center gap-2 py-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to previous step
          </p>
        </div>
      </form>
    </div>
  );
}
