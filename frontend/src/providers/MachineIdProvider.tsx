import { useEffect, useRef } from 'react';
import { authAxios } from '@/axios/instance';
import { setCookies } from '@/utils/ext';

export function MachineIdProvider({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    authAxios
      .get('/auth/machine-id')
      .then(
        res =>
          res.data.data?.machineId &&
          setCookies({ machineId: res.data.data.machineId })
      );
  }, []);

  return <>{children}</>;
}
