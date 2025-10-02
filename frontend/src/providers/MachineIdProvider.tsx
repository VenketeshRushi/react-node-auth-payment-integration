import { useEffect, useRef } from 'react';
import { authAxios } from '@/axios/instance';
import { setCookies } from '@/utils/ext';

export function MachineIdProvider({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMachineId = async () => {
      try {
        const res = await authAxios.get('/auth/machine-id');
        const machineId = res.data?.data?.machineId;
        if (machineId) {
          setCookies({ machineId });
        }
      } catch (err) {
        console.error('Failed to fetch machine ID', err);
      }
    };

    fetchMachineId();
  }, []);

  return <>{children}</>;
}
