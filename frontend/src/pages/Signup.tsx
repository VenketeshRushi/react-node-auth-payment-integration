import Step1BasicInfo from '@/components/signup/Step1BasicInfo';
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupSchema, otpSchema } from '@/validation/signup.schema';
import { ZodError } from 'zod';
import Step2Verification from '@/components/signup/Step2Verification';

type Step = 'account' | 'verification';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  otp: string;
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
    otp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
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
        const phoneError = error.errors[0]?.message || 'Invalid phone number';
        setErrors(prev => ({ ...prev, phone: phoneError }));
      }
      return false;
    }
  };

  const validateOTP = (): boolean => {
    try {
      otpSchema.shape.mobileOtp.parse(formData.otp);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.otp;
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const otpError = error.errors[0]?.message || 'Invalid OTP';
        setErrors(prev => ({ ...prev, otp: otpError }));
      }
      return false;
    }
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    console.log('Sending OTP to:', phone);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Math.random() > 0.1;
  };

  const verifyOTPAndCreateAccount = async (otp: string): Promise<boolean> => {
    console.log('Verifying OTP and creating account:', otp);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return otp === '123456';
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

  const handleSendOTP = async () => {
    if (!validatePhone()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await sendOTP(formData.phone);
      if (success) {
        setOtpSent(true);
        setCountdown(60);
        handleFieldChange('otp', ''); // Clear any existing OTP
      } else {
        setErrors({
          submit: 'Failed to send verification code. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to send verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndCreate = async () => {
    if (!validateOTP()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await verifyOTPAndCreateAccount(formData.otp);
      if (success) {
        setErrors({
          success: 'Account created successfully! Redirecting to sign in...',
        });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setErrors({ submit: 'Invalid verification code. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const success = await sendOTP(formData.phone);
      if (success) {
        setCountdown(60);
        handleFieldChange('otp', '');
      } else {
        setErrors({
          submit: 'Failed to resend verification code. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to resend verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep('account');
    setOtpSent(false);
    setCountdown(0);
    setErrors({});
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4'>
            <Shield className='w-8 h-8 text-white' />
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
                currentStep === 'verification' ? 'bg-primary' : 'bg-gray-200'
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
            />
          )}

          {currentStep === 'verification' && (
            <Step2Verification
              formData={{ phone: formData.phone, otp: formData.otp }}
              errors={errors}
              isLoading={isLoading}
              otpSent={otpSent}
              countdown={countdown}
              onFieldChange={handleFieldChange}
              onSendOTP={handleSendOTP}
              onVerify={handleVerifyAndCreate}
              onBack={handleBack}
              onResendOTP={handleResendOTP}
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
            <p className='text-xs text-muted'>
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
        )}
      </div>
    </div>
  );
}
