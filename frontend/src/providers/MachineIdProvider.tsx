import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { fetchMachineId } from '@/api/auth';

export function MachineIdProvider({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const existingId = Cookies.get('machineId');
    if (!existingId) {
      const getMachineId = async () => {
        try {
          const id = await fetchMachineId();
          Cookies.set('machineId', id);
        } catch (err) {
          console.error('Failed to get machine ID:', (err as Error).message);
        }
      };
      getMachineId();
    }
  }, []);

  return <>{children}</>;
}
