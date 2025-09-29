import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import LayoutAnimation from '@/components/animations/LayoutAnimation';
import { Separator } from '@/components/ui/separator';

export default function PublicLayout() {
  return (
    <div className='flex flex-col min-h-screen w-full bg-gradient-to-b from-background via-background/95 to-muted/30'>
      <header className='fixed top-0 left-0 right-0 z-50 px-4 pt-4'>
        <div className='max-w-7xl mx-auto'>
          <Navbar />
        </div>
      </header>

      <LayoutAnimation className='flex-1'>
        <main className='pt-28 pb-16 px-4'>
          <div className='flex-1 mx-auto w-full'>
            <Outlet />
          </div>
        </main>
      </LayoutAnimation>

      <Separator className='mx-auto' />

      <footer className='mt-auto'>
        <Footer />
      </footer>
    </div>
  );
}
