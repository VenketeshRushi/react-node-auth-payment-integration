import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import LayoutAnimation from '@/components/animations/LayoutAnimation';
import { Separator } from '@/components/ui/separator';
import NavbarWrapper from '@/components/animations/NavbarWrapper';

export default function PublicLayout() {
  return (
    <div className='flex flex-col min-h-screen w-full bg-gradient-to-b from-background via-background/95 to-muted/30'>
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>

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
