import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircleIcon,
  Mail,
  Smartphone,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  Clock,
} from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { otpSchema, signupSchema } from '@/validation/signup.schema';
import { ZodError } from 'zod';
import { getPasswordStrength } from '@/utils/ext';

type Step = 'signup' | 'verify';

interface FormErrors {
  [key: string]: string;
}

export default function EnhancedSignup() {
  const [currentStep, setCurrentStep] = useState<Step>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emailOtp: '',
    mobileOtp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState<Record<string, boolean>>({
    email: false,
    mobile: false,
  });
  const [otpSent, setOtpSent] = useState<Record<string, boolean>>({
    email: false,
    mobile: false,
  });
  const [countdown, setCountdown] = useState<Record<string, number>>({
    email: 0,
    mobile: 0,
  });

  const navigate = useNavigate();

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific errors on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateSignupForm = (): boolean => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateOtpFields = (): boolean => {
    try {
      otpSchema.parse({
        emailOtp: formData.emailOtp,
        mobileOtp: formData.mobileOtp,
      });
      setErrors(prev => ({ ...prev, emailOtp: '', mobileOtp: '' }));
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
      return false;
    }
  };

  // Mock API calls with realistic delays
  const sendEmailOtp = async (email: string) => {
    console.log('Sending email OTP to:', email);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.random() > 0.1; // 90% success rate
  };

  const sendMobileOtp = async (phone: string) => {
    console.log('Sending mobile OTP to:', phone);
    await new Promise(resolve => setTimeout(resolve, 1200));
    return Math.random() > 0.1; // 90% success rate
  };

  const verifyOtp = async (emailOtp: string, mobileOtp: string) => {
    console.log('Verifying OTPs:', { emailOtp, mobileOtp });
    await new Promise(resolve => setTimeout(resolve, 2000));
    return emailOtp.length === 6 && mobileOtp.length === 6;
  };

  const startCountdown = (type: 'email' | 'mobile') => {
    setCountdown(prev => ({ ...prev, [type]: 60 }));
    const timer = setInterval(() => {
      setCountdown(prev => {
        const newCount = prev[type] - 1;
        if (newCount <= 0) {
          clearInterval(timer);
          return { ...prev, [type]: 0 };
        }
        return { ...prev, [type]: newCount };
      });
    }, 1000);
  };

  const handleSignupSubmit = async () => {
    if (!validateSignupForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const [emailSent, mobileSent] = await Promise.all([
        sendEmailOtp(formData.email),
        sendMobileOtp(formData.phone),
      ]);

      if (emailSent && mobileSent) {
        setOtpSent({ email: true, mobile: true });
        startCountdown('email');
        startCountdown('mobile');
        setCurrentStep('verify');
      } else {
        throw new Error('Failed to send verification codes. Please try again.');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!validateOtpFields()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const isValid = await verifyOtp(formData.emailOtp, formData.mobileOtp);

      if (isValid) {
        setErrors(prev => ({
          ...prev,
          success: 'Account created successfully! Redirecting to sign in...',
        }));

        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        throw new Error(
          'Invalid verification codes. Please check and try again.'
        );
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : 'Verification failed. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async (type: 'email' | 'mobile') => {
    if (countdown[type] > 0) return;

    setIsResending(prev => ({ ...prev, [type]: true }));
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      let success = false;
      if (type === 'email') {
        success = await sendEmailOtp(formData.email);
      } else {
        success = await sendMobileOtp(formData.phone);
      }

      if (success) {
        handleFieldChange(type === 'email' ? 'emailOtp' : 'mobileOtp', '');
        startCountdown(type);
      } else {
        throw new Error(`Failed to resend ${type} verification code`);
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : `Failed to resend ${type} code`,
      }));
    } finally {
      setIsResending(prev => ({ ...prev, [type]: false }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4'>
            <Shield className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Welcome to Acme Inc.</h1>
          <p>Create your account to get started</p>
        </div>

        {/* Progress Indicator */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm font-medium'>
              {currentStep === 'signup' ? 'Account Details' : 'Verification'}
            </span>
            <span className='text-sm'>
              Step {currentStep === 'signup' ? '1' : '2'} of 2
            </span>
          </div>
          <div className='flex space-x-2'>
            <div className='h-2 flex-1 bg-blue-600 rounded-full' />
            <div
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-300',
                currentStep === 'verify' ? 'bg-blue-600' : 'bg-gray-200'
              )}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className='bg-card rounded-2xl shadow-xl p-8'>
          {/* Step 1: Signup Form */}
          {currentStep === 'signup' && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSignupSubmit();
              }}
              className='space-y-6'
            >
              {/* Name Fields */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='text-sm font-semibold'>
                    First Name
                  </Label>
                  <Input
                    id='firstName'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={e =>
                      handleFieldChange('firstName', e.target.value)
                    }
                    className={cn(
                      'h-11 transition-all duration-200',
                      errors.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'focus:border-blue-500 focus:ring-blue-200'
                    )}
                    autoComplete='given-name'
                  />
                  {errors.firstName && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircleIcon className='w-4 h-4' />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='text-sm font-semibold'>
                    Last Name
                  </Label>
                  <Input
                    id='lastName'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={e =>
                      handleFieldChange('lastName', e.target.value)
                    }
                    className={cn(
                      'h-11 transition-all duration-200',
                      errors.lastName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'focus:border-blue-500 focus:ring-blue-200'
                    )}
                    autoComplete='family-name'
                  />
                  {errors.lastName && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircleIcon className='w-4 h-4' />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-semibold'>
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  value={formData.email}
                  onChange={e => handleFieldChange('email', e.target.value)}
                  className={cn(
                    'h-11 transition-all duration-200',
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'focus:border-blue-500 focus:ring-blue-200'
                  )}
                  autoComplete='email'
                />
                {errors.email && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <AlertCircleIcon className='w-4 h-4' />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <Label htmlFor='phone' className='text-sm font-semibold'>
                  Mobile Number
                </Label>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='9876543210'
                  value={formData.phone}
                  onChange={e =>
                    handleFieldChange(
                      'phone',
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                  className={cn(
                    'h-11 transition-all duration-200',
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'focus:border-blue-500 focus:ring-blue-200'
                  )}
                  autoComplete='tel'
                />
                {errors.phone && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <AlertCircleIcon className='w-4 h-4' />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <Label htmlFor='password' className='text-sm font-semibold'>
                  Password
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={e =>
                      handleFieldChange('password', e.target.value)
                    }
                    className={cn(
                      'h-11 pr-10 transition-all duration-200',
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'focus:border-blue-500 focus:ring-blue-200'
                    )}
                    autoComplete='new-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 bg-gray-200 rounded-full h-1.5'>
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            passwordStrength.color
                          )}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          passwordStrength.score <= 2
                            ? 'text-red-600'
                            : passwordStrength.score <= 4
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        )}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <AlertCircleIcon className='w-4 h-4' />
                    {errors.password}
                  </p>
                )}

                <p className='text-xs text-gray-600'>
                  Must contain 8+ characters with uppercase, lowercase, number,
                  and special character
                </p>
              </div>

              {/* Confirm Password */}
              <div className='space-y-2'>
                <Label
                  htmlFor='confirmPassword'
                  className='text-sm font-semibold'
                >
                  Confirm Password
                </Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleFieldChange('confirmPassword', e.target.value)
                    }
                    className={cn(
                      'h-11 pr-10 transition-all duration-200',
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'focus:border-blue-500 focus:ring-blue-200'
                    )}
                    autoComplete='new-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-sm text-red-600 flex items-center gap-1'>
                    <AlertCircleIcon className='w-4 h-4' />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Error Display */}
              {errors.submit && (
                <Alert
                  variant='destructive'
                  className='border-red-200 bg-red-50'
                >
                  <AlertCircleIcon className='h-4 w-4' />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={isSubmitting}
                className='cursor-pointer w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none'
              >
                {isSubmitting ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 rounded-full animate-spin' />
                    Sending verification codes...
                  </div>
                ) : (
                  'Send Verification Codes'
                )}
              </Button>

              {/* Sign In Link */}
              <div className='text-center pt-4 border-t border-muted-100'>
                <p className='text-sm text-foreground'>
                  Already have an account?{' '}
                  <Link
                    to='/signin'
                    className='font-semibold text-blue-600 hover:text-blue-700 transition-colors'
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 'verify' && (
            <div className='space-y-6'>
              {/* Success Alert */}
              <Alert className='border-blue-200 bg-blue-50'>
                <CheckCircle2 className='h-5 w-5 text-blue-600' />
                <AlertTitle className='text-blue-800'>
                  Verification codes sent!
                </AlertTitle>
                <AlertDescription className='text-blue-700 mt-2'>
                  <p className='mb-3'>We've sent 6-digit codes to:</p>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 font-medium'>
                      <Mail className='h-4 w-4' />
                      <span>{formData.email}</span>
                    </div>
                    <div className='flex items-center gap-2 font-medium'>
                      <Smartphone className='h-4 w-4' />
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleVerificationSubmit();
                }}
                className='space-y-6'
              >
                {/* Email OTP */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm font-semibold flex items-center gap-2'>
                      <Mail className='w-4 h-4' />
                      Email Verification Code
                    </Label>
                    <button
                      type='button'
                      onClick={() => handleResendOtp('email')}
                      disabled={isResending.email || countdown.email > 0}
                      className='text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors flex items-center gap-1'
                    >
                      {isResending.email ? (
                        <>
                          <div className='w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin' />
                          Resending...
                        </>
                      ) : countdown.email > 0 ? (
                        <>
                          <Clock className='w-3 h-3' />
                          Resend in {countdown.email}s
                        </>
                      ) : (
                        'Resend code'
                      )}
                    </button>
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={formData.emailOtp}
                    onChange={value =>
                      handleFieldChange('emailOtp', value.replace(/\D/g, ''))
                    }
                    className='justify-center'
                  >
                    <InputOTPGroup className='gap-2'>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <InputOTPSlot
                          key={idx}
                          index={idx}
                          className='w-12 h-12 text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {errors.emailOtp && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircleIcon className='w-4 h-4' />
                      {errors.emailOtp}
                    </p>
                  )}
                </div>

                {/* Mobile OTP */}
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm font-semibold flex items-center gap-2'>
                      <Smartphone className='w-4 h-4' />
                      Mobile Verification Code
                    </Label>
                    <button
                      type='button'
                      onClick={() => handleResendOtp('mobile')}
                      disabled={isResending.mobile || countdown.mobile > 0}
                      className='text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors flex items-center gap-1'
                    >
                      {isResending.mobile ? (
                        <>
                          <div className='w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin' />
                          Resending...
                        </>
                      ) : countdown.mobile > 0 ? (
                        <>
                          <Clock className='w-3 h-3' />
                          Resend in {countdown.mobile}s
                        </>
                      ) : (
                        'Resend code'
                      )}
                    </button>
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={formData.mobileOtp}
                    onChange={value =>
                      handleFieldChange('mobileOtp', value.replace(/\D/g, ''))
                    }
                    className='justify-center'
                  >
                    <InputOTPGroup className='gap-2'>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <InputOTPSlot
                          key={idx}
                          index={idx}
                          className='w-12 h-12 text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {errors.mobileOtp && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircleIcon className='w-4 h-4' />
                      {errors.mobileOtp}
                    </p>
                  )}
                </div>

                {/* Error/Success Display */}
                {errors.submit && (
                  <Alert
                    variant='destructive'
                    className='border-red-200 bg-red-50'
                  >
                    <AlertCircleIcon className='h-4 w-4' />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                {errors.success && (
                  <Alert className='border-green-200 bg-green-50'>
                    <CheckCircle2 className='h-4 w-4 text-green-600' />
                    <AlertDescription className='text-green-700'>
                      {errors.success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className='space-y-3'>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none'
                  >
                    {isSubmitting ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Verifying codes...
                      </div>
                    ) : (
                      'Verify & Create Account'
                    )}
                  </Button>

                  <button
                    type='button'
                    onClick={() => setCurrentStep('signup')}
                    className='w-full flex items-center justify-center gap-2 h-11 text-gray-600 hover:text-gray-800 font-medium transition-colors'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Back to signup form
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='text-center mt-8'>
          <p className='text-xs text-gray-500'>
            By creating an account, you agree to our{' '}
            <a href='#' className='text-blue-600 hover:underline'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='text-blue-600 hover:underline'>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
