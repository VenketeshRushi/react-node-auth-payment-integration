import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';
import LayoutAnimation from '@/components/animations/LayoutAnimation';
import AppSidebar from '@/components/AppSidebar';
import SiteHeader from '@/components/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function PrivateLayout() {
  return (
    <div className='flex flex-col min-h-screen w-full bg-gradient-to-b from-background via-background/90 to-muted/30'>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className='flex flex-col h-screen'>
          <SiteHeader />

          <Suspense
            fallback={
              <div className='flex-1 flex items-center justify-center'>
                <Loader />
              </div>
            }
          >
            <LayoutAnimation className='flex flex-col flex-1 min-h-0'>
              <main className='flex flex-col flex-1 w-full min-h-0'>
                <div className='flex flex-col flex-1 min-h-0'>
                  <Outlet />
                </div>
              </main>
            </LayoutAnimation>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
