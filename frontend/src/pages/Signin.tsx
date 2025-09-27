import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  AlertCircle,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Shield,
  X,
  Clock,
  CheckCircle2,
  Chrome,
} from 'lucide-react';
import {
  emailSigninSchema,
  mobileSigninSchema,
} from '@/validation/signin.schema';
import { ZodError } from 'zod';

type TabType = 'email' | 'mobile';

interface FormErrors {
  [key: string]: string;
}

export default function EnhancedSignin() {
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [oauthLoading, setOauthLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [oauthError, setOauthError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle OAuth errors from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');

    if (errorParam) {
      const errorMessages: Record<string, string> = {
        google_auth_failed: 'Google authentication failed. Please try again.',
        authentication_failed: 'Authentication failed. Please try again.',
        account_not_activated:
          'Your account is not activated. Please complete verification first.',
        signup_required:
          'You need to sign up with this email first before using social login.',
        oauth_failed: 'Authentication failed. Please try again.',
      };

      const errorMessage =
        (messageParam ? decodeURIComponent(messageParam) : null) ||
        errorMessages[errorParam] ||
        'An error occurred during authentication. Please try again.';

      setOauthError(errorMessage);
    }

    // Clean up URL parameters
    if (errorParam || messageParam) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('error');
      newSearchParams.delete('message');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'mobile') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field errors on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear submit errors
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }

    // Real-time validation for touched fields
    if (touchedFields[field]) {
      validateSingleField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    validateSingleField(field, value);
  };

  const validateSingleField = (field: string, value: string) => {
    try {
      if (activeTab === 'email') {
        if (field === 'email') {
          emailSigninSchema.shape.email.parse(value);
        } else if (field === 'password') {
          emailSigninSchema.shape.password.parse(value);
        }
      } else {
        if (field === 'mobile') {
          mobileSigninSchema.shape.mobile.parse(value);
        } else if (field === 'otp') {
          mobileSigninSchema.shape.otp.parse(value);
        }
      }
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0].message }));
      }
    }
  };

  const validateEmailForm = (): boolean => {
    try {
      emailSigninSchema.parse({
        email: formData.email,
        password: formData.password,
      });
      setErrors(prev => ({ ...prev, email: '', password: '' }));
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

  const validateMobileForm = (): boolean => {
    try {
      mobileSigninSchema.parse({
        mobile: formData.mobile,
        otp: formData.otp,
      });
      setErrors(prev => ({ ...prev, mobile: '', otp: '' }));
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

  const handleSendOtp = async () => {
    try {
      mobileSigninSchema.shape.mobile.parse(formData.mobile);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(prev => ({ ...prev, mobile: error.issues[0].message }));
        return;
      }
    }

    setIsOtpSending(true);
    setErrors(prev => ({ ...prev, mobile: '', submit: '' }));

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random failure for demo
      if (Math.random() > 0.9) {
        throw new Error('Failed to send OTP');
      }

      setIsOtpSent(true);
      setCountdown(60);
      setFormData(prev => ({ ...prev, otp: '' })); // Clear previous OTP
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : 'Failed to send OTP. Please try again.',
      }));
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!validateEmailForm()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      // Mock login API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate login logic
      console.log('Email login:', {
        email: formData.email,
        password: formData.password,
      });

      // Mock success/failure
      if (
        formData.email === 'test@example.com' &&
        formData.password === 'password123'
      ) {
        navigate('/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit:
          error instanceof Error
            ? error.message
            : 'Login failed. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileSubmit = async () => {
    if (!validateMobileForm()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Mobile login:', {
        mobile: formData.mobile,
        otp: formData.otp,
      });

      // Mock verification
      if (formData.otp === '123456') {
        navigate('/dashboard');
      } else {
        throw new Error('Invalid OTP. Please try again.');
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

  const handleGoogleSignin = async () => {
    setOauthError(null);
    setOauthLoading(true);

    try {
      const backendUrl =
        import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000';

      // Simulate redirect delay
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = `${backendUrl}/auth/google`;
    } catch {
      setOauthError('Failed to initiate Google login. Please try again.');
      setOauthLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'email' || value === 'mobile') {
      setActiveTab(value);
      setErrors({});
      setIsOtpSent(false);
      setTouchedFields({});
      setCountdown(0);
    }
  };

  const isEmailFormValid =
    formData.email && formData.password && !errors.email && !errors.password;
  const isMobileFormValid =
    formData.mobile &&
    formData.otp &&
    !errors.mobile &&
    !errors.otp &&
    isOtpSent;

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4'>
            <Shield className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>
        {/* Main Card */}
        <div className='bg-card rounded-2xl shadow-xl p-8'>
          {/* OAuth Error */}
          {oauthError && (
            <Alert variant='destructive' className='mb-6'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription className='flex items-center justify-between'>
                <span>{oauthError}</span>
                <button
                  onClick={() => setOauthError(null)}
                  className='ml-2 hover:opacity-70 transition-opacity'
                  aria-label='Dismiss error'
                >
                  <X className='h-4 w-4' />
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Google Sign In */}
          <div className='mb-6'>
            <Button
              type='button'
              variant='outline'
              onClick={handleGoogleSignin}
              disabled={isSubmitting || oauthLoading}
              className='w-full h-11 transition-all duration-200'
            >
              {oauthLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 rounded-full animate-spin' />
                  Connecting to Google...
                </div>
              ) : (
                <div className='flex items-center gap-3'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                      fill='currentColor'
                    />
                  </svg>
                  <span className='sr-only'>Sign In with Google</span>
                  Continue with Google
                </div>
              )}
            </Button>

            <div className='relative mt-6'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-border' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='px-2 bg-card text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-6'>
              <TabsTrigger
                value='email'
                className='flex items-center gap-2 cursor-pointer'
              >
                <Mail className='h-4 w-4' />
                Email
              </TabsTrigger>
              <TabsTrigger
                value='mobile'
                className='flex items-center gap-2 cursor-pointer'
              >
                <Smartphone className='h-4 w-4' />
                Mobile OTP
              </TabsTrigger>
            </TabsList>

            {/* Email Tab */}
            <TabsContent value='email' className='space-y-6 mt-0'>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleEmailSubmit();
                }}
                className='space-y-5'
              >
                {/* Email Field */}
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
                    onBlur={() => handleFieldBlur('email')}
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
                      <AlertCircle className='w-4 h-4' />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
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
                      onBlur={() => handleFieldBlur('password')}
                      className={cn(
                        'h-11 pr-10 transition-all duration-200',
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'focus:border-blue-500 focus:ring-blue-200'
                      )}
                      autoComplete='current-password'
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
                  {errors.password && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className='flex justify-end'>
                  <Link
                    to='/reset-password'
                    className='text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors'
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <Alert
                    variant='destructive'
                    className='border-red-200 bg-red-50'
                  >
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type='submit'
                  disabled={isSubmitting || !isEmailFormValid}
                  className='w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none'
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Mobile Tab */}
            <TabsContent value='mobile' className='space-y-6 mt-0'>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleMobileSubmit();
                }}
                className='space-y-5'
              >
                {/* Mobile Number Field */}
                <div className='space-y-3'>
                  <Label htmlFor='mobile' className='text-sm font-semibold'>
                    Mobile Number
                  </Label>
                  <div className='flex gap-3'>
                    <Input
                      id='mobile'
                      type='tel'
                      placeholder='9876543210'
                      value={formData.mobile}
                      onChange={e =>
                        handleFieldChange('mobile', e.target.value)
                      }
                      onBlur={() => handleFieldBlur('mobile')}
                      className={cn(
                        'h-11 flex-1 transition-all duration-200',
                        errors.mobile
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'focus:border-blue-500 focus:ring-blue-200'
                      )}
                      autoComplete='tel'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleSendOtp}
                      disabled={
                        isOtpSending ||
                        countdown > 0 ||
                        !formData.mobile ||
                        !!errors.mobile
                      }
                      className='h-11 px-4 whitespace-nowrap border-gray-300 hover:bg-gray-50'
                    >
                      {isOtpSending ? (
                        <div className='flex items-center gap-2'>
                          <div className='w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin' />
                          Sending...
                        </div>
                      ) : countdown > 0 ? (
                        <div className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' />
                          {countdown}s
                        </div>
                      ) : isOtpSent ? (
                        'Resend OTP'
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </div>
                  {errors.mobile && (
                    <p className='text-sm text-red-600 flex items-center gap-1'>
                      <AlertCircle className='w-4 h-4' />
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* OTP Field */}
                <div className='space-y-3'>
                  <Label className='text-sm font-semibold'>Enter OTP</Label>
                  <div className='space-y-3'>
                    <InputOTP
                      maxLength={6}
                      value={formData.otp}
                      onChange={value =>
                        handleFieldChange('otp', value.replace(/\D/g, ''))
                      }
                      onComplete={() => handleFieldBlur('otp')}
                      disabled={!isOtpSent}
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

                    {isOtpSent && (
                      <div className='flex items-center gap-2 justify-start'>
                        <CheckCircle2 className='w-4 h-4 text-green-600' />
                        <p className='text-sm text-green-600 font-medium'>
                          OTP sent to +91-{formData.mobile}
                        </p>
                      </div>
                    )}

                    {!isOtpSent && (
                      <p className='text-sm text-gray-500 text-center'>
                        Please send OTP to your mobile number first
                      </p>
                    )}
                  </div>

                  {errors.otp && (
                    <p className='text-sm text-red-600 flex items-center gap-1 justify-center'>
                      <AlertCircle className='w-4 h-4' />
                      {errors.otp}
                    </p>
                  )}
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <Alert
                    variant='destructive'
                    className='border-red-200 bg-red-50'
                  >
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type='submit'
                  disabled={isSubmitting || !isMobileFormValid}
                  className='cursor-pointer w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none'
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2rounded-full animate-spin' />
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Sign Up Link */}
          <div className='text-center pt-4'>
            <p className='text-sm text-foreground'>
              Don't have an account?{' '}
              <Link to='/signup' className='font-semibold transition-colors'>
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center mt-8'>
          <p className='text-xs text-gray-500'>
            By signing in, you agree to our{' '}
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
