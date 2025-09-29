import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center px-6 lg:px-8'>
      <div className='flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-6 animate-bounce'>
        <AlertTriangle className='w-10 h-10' />
      </div>

      <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-primary mb-4'>
        404 - Page Not Found
      </h1>
      <p className='text-lg text-muted-foreground max-w-md text-center mb-8'>
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved. Let&apos;s get you back on track.
      </p>

      <div className='flex'>
        <Link
          to='/'
          className='inline-flex items-center gap-2 px-6 py-3 text-primary rounded-xl transition-all duration-300 hover:outline-1 hover:shadow-lg'
        >
          <ArrowLeft className='w-5 h-5' />
          Return Home
        </Link>
      </div>
    </div>
  );
}
