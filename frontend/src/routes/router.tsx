import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';
import PublicRoute from '@/routes/PublicRoute';
import PrivateRoute from '@/routes/PrivateRoute';
import RoleGuard from '@/routes/RoleGuard';
import PrivateLayout from '@/layouts/PrivateLayout';
import RootLayout from '@/layouts/RootLayout';

const NotFound = lazy(() => import('@/pages/NotFound'));

const Home = lazy(() => import('@/pages/Home'));
const AboutUs = lazy(() => import('@/pages/Aboutus'));
const ContactUs = lazy(() => import('@/pages/Contactus'));

const Signin = lazy(() => import('@/pages/Signin'));
const Signup = lazy(() => import('@/pages/Signup'));

const Dashboard = lazy(() => import('@/pages/Dashboard'));

const FullPageLoader = (
  <div className='flex items-center justify-center w-screen h-screen'>
    <Loader />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      /* ---------- Public Routes ---------- */
      {
        element: (
          <Suspense fallback={FullPageLoader}>
            <PublicRoute />
          </Suspense>
        ),
        children: [
          {
            element: <RootLayout />,
            children: [
              { index: true, element: <Home /> },
              { path: 'aboutus', element: <AboutUs /> },
              { path: 'contactus', element: <ContactUs /> },
              { path: 'signin', element: <Signin /> },
              { path: 'signup', element: <Signup /> },
              { path: '*', element: <NotFound /> },
            ],
          },
        ],
      },

      /* ---------- Protected User Routes ---------- */
      {
        element: (
          <Suspense fallback={FullPageLoader}>
            <PrivateRoute />
          </Suspense>
        ),
        children: [
          {
            element: (
              <RoleGuard role='user'>
                <PrivateLayout />
              </RoleGuard>
            ),
            children: [{ path: 'dashboard', element: <Dashboard /> }],
          },
        ],
      },
    ],
  },
]);

export default router;
