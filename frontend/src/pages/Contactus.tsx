import React, { useState } from 'react';

export default function ContactUs() {
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className='px-4 w-full min-h-screen'>
      <div className='mx-auto max-w-4xl'>
        <div className='text-center mb-16'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4'>
            <svg
              className='w-8 h-8 text-primary'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
          </div>
          <h1 className='text-5xl font-bold tracking-tight text-foreground sm:text-6xl mb-4'>
            Get in <span className='text-primary'>Touch</span>
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>

        <div className='bg-card rounded-2xl shadow-xl border border-border overflow-hidden'>
          <div className='p-8 sm:p-12'>
            <div className='space-y-8'>
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='group'>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-semibold text-foreground mb-2'
                  >
                    First Name
                  </label>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className='block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-primary/50'
                    placeholder='Enter your first name'
                  />
                </div>
                <div className='group'>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-semibold text-foreground mb-2'
                  >
                    Last Name
                  </label>
                  <input
                    id='lastName'
                    name='lastName'
                    type='text'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className='block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-primary/50'
                    placeholder='Enter your last name'
                  />
                </div>
              </div>

              <div className='group'>
                <label
                  htmlFor='company'
                  className='block text-sm font-semibold text-foreground mb-2'
                >
                  Company
                </label>
                <input
                  id='company'
                  name='company'
                  type='text'
                  value={formData.company}
                  onChange={handleInputChange}
                  className='block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-primary/50'
                  placeholder='Your company name'
                />
              </div>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='group'>
                  <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-foreground mb-2'
                  >
                    Email Address
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-primary/50'
                    placeholder='your@email.com'
                    required
                  />
                </div>
                <div className='group'>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-semibold text-foreground mb-2'
                  >
                    Phone Number
                  </label>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-primary/50'
                    placeholder='+91 123 456 7890'
                  />
                </div>
              </div>

              <div className='group'>
                <label
                  htmlFor='message'
                  className='block text-sm font-semibold text-foreground mb-2'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className='block w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none hover:border-primary/50 resize-none'
                  placeholder='Tell us about your project or question...'
                  required
                />
              </div>

              <div className='flex items-start space-x-3'>
                <div className='relative flex-shrink-0'>
                  <input
                    id='agree-to-policies'
                    name='agree-to-policies'
                    type='checkbox'
                    checked={isChecked}
                    onChange={e => setIsChecked(e.target.checked)}
                    className='peer h-5 w-5 rounded border-2 border-input text-primary focus:ring-4 focus:ring-primary/20 focus:ring-offset-0 transition-all duration-200 cursor-pointer bg-background'
                    required
                  />
                  <div className='pointer-events-none absolute inset-0 rounded border-2 border-transparent bg-primary opacity-0 transition-opacity duration-200 peer-checked:opacity-100'>
                    <svg
                      className='h-full w-full p-0.5 text-primary-foreground'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor='agree-to-policies'
                  className='text-sm text-muted-foreground leading-5 cursor-pointer'
                >
                  I agree to the{' '}
                  <a
                    href='#'
                    className='font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-2'
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href='#'
                    className='font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-2'
                  >
                    Terms of Service
                  </a>
                </label>
              </div>

              <div className='pt-4'>
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={!isChecked}
                  className='group relative w-full overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg hover:bg-primary/90'
                >
                  <span className='relative z-10 flex items-center justify-center space-x-2'>
                    <span>Send Message</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className='bg-muted/50 px-8 py-6 sm:px-12 border-t border-border'>
            <div className='flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0'>
              <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                <div className='flex items-center space-x-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>Response within 24 hours</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
