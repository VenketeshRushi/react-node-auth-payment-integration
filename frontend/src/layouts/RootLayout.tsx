import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import LayoutAnimation from '@/components/animations/LayoutAnimation';

export default function PublicLayout() {
  return (
    <div className='flex flex-1 flex-col min-h-screen w-full bg-gradient-to-b from-background via-background/90 to-muted/30'>
      <header className='mx-auto sticky top-4 z-50 w-[90%]'>
        <Navbar />
      </header>

      <LayoutAnimation>
        <main className='flex-1'>
          <div className='mx-auto w-full py-6'>
            <Outlet />
          </div>
        </main>
      </LayoutAnimation>

      <footer className='mt-auto'>
        <Footer />
      </footer>
    </div>
  );
}
