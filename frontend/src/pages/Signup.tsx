import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Step1BasicInfo from '@/components/signup/Step1BasicInfo';
import Step2Verification from '@/components/signup/Step2Verification';
import { signupSchema, otpSchema } from '@/validation/signup.schema';
import { ZodError } from 'zod';

type Step = 'account' | 'verification';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  emailOtp: string;
  mobileOtp: string;
}

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

export default function Signup() {
  const [currentStep, setCurrentStep] = useState<Step>('account');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    emailOtp: '',
    mobileOtp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState<OTPStatus>({
    email: { sent: false, countdown: 0 },
    mobile: { sent: false, countdown: 0 },
  });

  const navigate = useNavigate();

  // Countdown timers for OTP resend
  useEffect(() => {
    let emailTimer: NodeJS.Timeout;
    let mobileTimer: NodeJS.Timeout;

    if (otpStatus.email.countdown > 0) {
      emailTimer = setTimeout(
        () =>
          setOtpStatus(prev => ({
            ...prev,
            email: { ...prev.email, countdown: prev.email.countdown - 1 },
          })),
        1000
      );
    }

    if (otpStatus.mobile.countdown > 0) {
      mobileTimer = setTimeout(
        () =>
          setOtpStatus(prev => ({
            ...prev,
            mobile: { ...prev.mobile, countdown: prev.mobile.countdown - 1 },
          })),
        1000
      );
    }

    return () => {
      clearTimeout(emailTimer);
      clearTimeout(mobileTimer);
    };
  }, [otpStatus.email.countdown, otpStatus.mobile.countdown]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    try {
      signupSchema.parse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateEmail = (): boolean => {
    try {
      signupSchema.shape.email.parse(formData.email);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const emailError = error.issues[0]?.message || 'Invalid email address';
        setErrors(prev => ({ ...prev, email: emailError }));
      }
      return false;
    }
  };

  const validatePhone = (): boolean => {
    try {
      signupSchema.shape.phone.parse(formData.phone);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const phoneError = error.issues[0]?.message || 'Invalid phone number';
        setErrors(prev => ({ ...prev, phone: phoneError }));
      }
      return false;
    }
  };

  const validateEmailOTP = (): boolean => {
    try {
      otpSchema.shape.emailOtp.parse(formData.emailOtp);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.emailOtp;
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const otpError = error.issues[0]?.message || 'Invalid email OTP';
        setErrors(prev => ({ ...prev, emailOtp: otpError }));
      }
      return false;
    }
  };

  const validateMobileOTP = (): boolean => {
    try {
      otpSchema.shape.mobileOtp.parse(formData.mobileOtp);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.mobileOtp;
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const otpError = error.issues[0]?.message || 'Invalid mobile OTP';
        setErrors(prev => ({ ...prev, mobileOtp: otpError }));
      }
      return false;
    }
  };

  const sendEmailOTP = async (email: string): Promise<boolean> => {
    console.log('Sending email OTP to:', email);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.random() > 0.1;
  };

  const sendMobileOTP = async (phone: string): Promise<boolean> => {
    console.log('Sending mobile OTP to:', phone);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.random() > 0.1;
  };

  const verifyOTPAndCreateAccount = async (
    emailOtp: string,
    mobileOtp: string
  ): Promise<boolean> => {
    console.log('Verifying OTPs and creating account:', {
      emailOtp,
      mobileOtp,
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    return emailOtp === '123456' && mobileOtp === '654321';
  };

  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate checking if email already exists
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock email check (10% chance of existing email)
      if (Math.random() < 0.1) {
        setErrors({ submit: 'An account with this email already exists' });
        return;
      }

      setCurrentStep('verification');
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await sendEmailOTP(formData.email);
      if (success) {
        setOtpStatus(prev => ({
          ...prev,
          email: { sent: true, countdown: 60 },
        }));
        handleFieldChange('emailOtp', ''); // Clear any existing OTP
      } else {
        setErrors({
          submit: 'Failed to send email verification code. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to send email verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMobileOTP = async () => {
    if (!validatePhone()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await sendMobileOTP(formData.phone);
      if (success) {
        setOtpStatus(prev => ({
          ...prev,
          mobile: { sent: true, countdown: 60 },
        }));
        handleFieldChange('mobileOtp', ''); // Clear any existing OTP
      } else {
        setErrors({
          submit: 'Failed to send mobile verification code. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to send mobile verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndCreate = async () => {
    const emailValid = validateEmailOTP();
    const mobileValid = validateMobileOTP();

    if (!emailValid || !mobileValid) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await verifyOTPAndCreateAccount(
        formData.emailOtp,
        formData.mobileOtp
      );
      if (success) {
        setErrors({
          success: 'Account created successfully! Redirecting to sign in...',
        });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setErrors({ submit: 'Invalid verification codes. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailOTP = async () => {
    if (otpStatus.email.countdown > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await sendEmailOTP(formData.email);
      if (success) {
        setOtpStatus(prev => ({
          ...prev,
          email: { sent: true, countdown: 60 },
        }));
        handleFieldChange('emailOtp', '');
      } else {
        setErrors({
          submit: 'Failed to resend email verification code. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to resend email verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendMobileOTP = async () => {
    if (otpStatus.mobile.countdown > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await sendMobileOTP(formData.phone);
      if (success) {
        setOtpStatus(prev => ({
          ...prev,
          mobile: { sent: true, countdown: 60 },
        }));
        handleFieldChange('mobileOtp', '');
      } else {
        setErrors({
          submit:
            'Failed to resend mobile verification code. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to resend mobile verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep('account');
    setOtpStatus({
      email: { sent: false, countdown: 0 },
      mobile: { sent: false, countdown: 0 },
    });
    setErrors({});
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-24'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4'>
            <Shield className='w-8 h-8 text-primary-foreground' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Welcome to Acme Inc.</h1>
          <p>Create your account to get started</p>
        </div>
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm font-medium text-muted-foreground'>
              {currentStep === 'account' ? 'Account Details' : 'Verification'}
            </span>
            <span className='text-sm text-muted-foreground'>
              Step {currentStep === 'account' ? '1' : '2'} of 2
            </span>
          </div>
          <div className='flex space-x-2'>
            <div className='h-2 flex-1 bg-primary rounded-full' />
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                currentStep === 'verification' ? 'bg-primary' : 'bg-accent'
              }`}
            />
          </div>
        </div>

        <div className='bg-card rounded-lg shadow-md p-8'>
          {currentStep === 'account' && (
            <Step1BasicInfo
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              onFieldChange={handleFieldChange}
              onNext={handleStep1Next}
              onGoogleSignup={() => {
                console.log('Google signup clicked');
              }}
            />
          )}

          {currentStep === 'verification' && (
            <Step2Verification
              formData={{
                email: formData.email,
                phone: formData.phone,
                emailOtp: formData.emailOtp,
                mobileOtp: formData.mobileOtp,
              }}
              errors={errors}
              isLoading={isLoading}
              otpStatus={otpStatus}
              onFieldChange={handleFieldChange}
              onSendEmailOTP={handleSendEmailOTP}
              onSendMobileOTP={handleSendMobileOTP}
              onVerify={handleVerifyAndCreate}
              onBack={handleBack}
              onResendEmailOTP={handleResendEmailOTP}
              onResendMobileOTP={handleResendMobileOTP}
              onValidateEmail={validateEmail}
              onValidatePhone={validatePhone}
            />
          )}
        </div>

        {currentStep === 'account' && (
          <div className='text-center mt-6 space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link
                to='/signin'
                className='text-blue-600 hover:text-blue-700 font-medium'
              >
                Sign In
              </Link>
            </p>
            <p className='text-xs text-muted-foreground'>
              By creating an account, you agree to our{' '}
              <Link to='/' className='text-blue-600 hover:underline'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='/' className='text-blue-600 hover:underline'>
                Privacy Policy
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
