import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, Eye, EyeOff } from 'lucide-react';

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
}

export default function Step1BasicInfo({
  formData,
  errors,
  isLoading,
  onFieldChange,
  onNext,
}: Step1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
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

      <Button
        type='submit'
        disabled={isLoading}
        className='w-full mt-4 md:mt-6'
      >
        {isLoading ? 'Please wait...' : 'Continue'}
      </Button>
    </form>
  );
}
