import { Navigate } from 'react-router-dom';
import { getCookies, removeAllCookies } from '@/utils/ext';

interface RoleGuardProps {
  role: string;
  children: React.ReactNode;
}

const RoleGuard = ({ role, children }: RoleGuardProps) => {
  const { machineId } = getCookies();

  if (!machineId) {
    removeAllCookies();
    return <Navigate to='/signin' replace />;
  }

  //   const userRole = user?.role?.toLowerCase();

  const userRole = 'user';

  if (userRole === role.toLowerCase()) return children;

  //   if (userRole === 'admin') return <Navigate to='/admin' replace />;

  return <Navigate to='/dashboard' replace />;
};

export default RoleGuard;
