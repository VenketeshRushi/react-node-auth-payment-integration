export default function Contactus() {
  return (
    <div className='px-2 w-full'>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl'>
          Contact Us
        </h2>
        <p className='mt-2 text-lg leading-8 text-muted-foreground'>
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>
      <form
        method='POST'
        className='mx-auto mt-10 max-w-2xl sm:mt-12 bg-card p-8 rounded-lg'
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
          <div>
            <label
              htmlFor='first-name'
              className='block text-sm leading-6 font-semibold text-foreground'
            >
              First name
            </label>
            <div className='mt-1'>
              <input
                id='first-name'
                name='first-name'
                type='text'
                autoComplete='given-name'
                className='block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors'
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='last-name'
              className='block text-sm leading-6 font-semibold text-foreground'
            >
              Last name
            </label>
            <div className='mt-1'>
              <input
                id='last-name'
                name='last-name'
                type='text'
                autoComplete='family-name'
                className='block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors'
              />
            </div>
          </div>
          <div className='sm:col-span-2'>
            <label
              htmlFor='company'
              className='block text-sm leading-6 font-semibold text-foreground'
            >
              Company
            </label>
            <div className='mt-1'>
              <input
                id='company'
                name='company'
                type='text'
                autoComplete='organization'
                className='block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors'
              />
            </div>
          </div>
          <div className='sm:col-span-2'>
            <label
              htmlFor='email'
              className='block text-sm leading-6 font-semibold text-foreground'
            >
              Email
            </label>
            <div className='mt-1'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                className='block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors'
              />
            </div>
          </div>
          <div className='sm:col-span-2'>
            <label
              htmlFor='phone-number'
              className='block text-sm leading-6 font-semibold text-foreground'
            >
              Phone number
            </label>
            <div className='mt-1'>
              <div className='flex rounded-md bg-background border border-input has-[:focus]:border-ring has-[:focus]:ring-2 has-[:focus]:ring-ring has-[:focus]:ring-offset-2 has-[:focus]:ring-offset-background transition-colors'>
                <input
                  id='phone-number'
                  name='phone-number'
                  type='text'
                  className='block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-sm leading-6'
                />
              </div>
            </div>
          </div>
          <div className='sm:col-span-2'>
            <label
              htmlFor='message'
              className='block text-sm leading-6 font-semibold text-foreground'
            >
              Message
            </label>
            <div className='mt-1'>
              <textarea
                id='message'
                name='message'
                rows={4}
                className='block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors resize-none'
                defaultValue={''}
              />
            </div>
          </div>
          <div className='flex gap-x-4 sm:col-span-2'>
            <div className='flex h-6 items-center'>
              <div className='group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-muted transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background data-[checked]:bg-primary'>
                <span
                  aria-hidden='true'
                  className='pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow transform ring-0 transition duration-200 ease-in-out translate-x-0 group-data-[checked]:translate-x-5'
                />
                <input
                  id='agree-to-policies'
                  name='agree-to-policies'
                  type='checkbox'
                  aria-label='Agree to policies'
                  className='absolute inset-0 h-full w-full cursor-pointer opacity-0 focus:outline-none'
                />
              </div>
            </div>
            <label
              htmlFor='agree-to-policies'
              className='text-sm leading-6 text-muted-foreground cursor-pointer'
            >
              By selecting this, you agree to our{' '}
              <a className='font-semibold whitespace-nowrap text-primary hover:text-primary/80 transition-colors'>
                privacy policy
              </a>
              .
            </label>
          </div>
        </div>
        <div className='mt-10'>
          <button
            type='submit'
            className='block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors'
          >
            Let's talk
          </button>
        </div>
      </form>
    </div>
  );
}
