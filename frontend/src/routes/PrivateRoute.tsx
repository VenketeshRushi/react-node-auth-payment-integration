import { Navigate, Outlet } from 'react-router-dom';
import { getCookies } from '@/utils/ext';

const PrivateRoute = () => {
  const { machineId } = getCookies();
  const isAuthenticated = Boolean(machineId);

  console.log('Auth Check:', { isAuthenticated, machineId });

  if (!isAuthenticated) {
    return <Navigate to='/signin' replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
