import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface Step1Props {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onFieldChange: (field: string, value: string) => void;
  onNext: () => void;
  onGoogleSignup: () => void;
}

export default function Step1BasicInfo({
  formData,
  errors,
  isLoading,
  onFieldChange,
  onNext,
  onGoogleSignup,
}: Step1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleGoogleClick = (e: React.FormEvent) => {
    e.preventDefault();
    onGoogleSignup();
  };

  return (
    <div className='space-y-6'>
      <Button
        type='button'
        variant='outline'
        onClick={handleGoogleClick}
        disabled={isLoading}
        className='w-full flex items-center justify-center gap-3 cursor-pointer px-4 py-6'
      >
        <svg
          className='w-5 h-5'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            fill='#4285F4'
          />
          <path
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            fill='#34A853'
          />
          <path
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            fill='#FBBC05'
          />
          <path
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            fill='#EA4335'
          />
        </svg>
        {isLoading ? 'Please wait...' : 'Continue with Google'}
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

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='firstName'>First Name</Label>
            <Input
              id='firstName'
              placeholder='John'
              value={formData.firstName}
              onChange={e => onFieldChange('firstName', e.target.value)}
              className={cn(
                errors.firstName &&
                  'border-destructive-300 focus:border-destructive-500'
              )}
            />
            {errors.firstName && (
              <p className='text-sm text-destructive-600 flex items-center gap-1'>
                <AlertCircleIcon className='w-4 h-4' />
                {errors.firstName}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input
              id='lastName'
              placeholder='Doe'
              value={formData.lastName}
              onChange={e => onFieldChange('lastName', e.target.value)}
              className={cn(
                errors.lastName &&
                  'border-destructive-300 focus:border-destructive-500'
              )}
            />
            {errors.lastName && (
              <p className='text-sm text-destructive flex items-center gap-1'>
                <AlertCircleIcon className='w-4 h-4' />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            placeholder='john@gmail.com'
            value={formData.email}
            onChange={e => onFieldChange('email', e.target.value)}
            className={cn(
              errors.email &&
                'border-destructive-300 focus:border-destructive-500'
            )}
          />
          {errors.email && (
            <p className='text-sm text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-4 h-4' />
              {errors.email}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={formData.password}
              onChange={e => onFieldChange('password', e.target.value)}
              className={cn(
                'pr-10',
                errors.password &&
                  'border-destructive-300 focus:border-destructive-500'
              )}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
            >
              {showPassword ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-sm text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-4 h-4' />
              {errors.password}
            </p>
          )}
          <p className='text-xs text-muted-foreground'>
            Must be at least 8 characters with uppercase, lowercase, number, and
            special character
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={e => onFieldChange('confirmPassword', e.target.value)}
              className={cn(
                'pr-10',
                errors.confirmPassword &&
                  'border-destructive-300 focus:border-destructive-500'
              )}
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
            >
              {showConfirmPassword ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='text-sm text-destructive flex items-center gap-1'>
              <AlertCircleIcon className='w-4 h-4' />
              {errors.confirmPassword}
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

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full mt-4 md:mt-6'
        >
          {isLoading ? 'Please wait...' : 'Continue'}
        </Button>
      </form>
    </div>
  );
}
