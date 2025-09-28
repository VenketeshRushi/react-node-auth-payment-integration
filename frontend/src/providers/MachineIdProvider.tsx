import { useEffect, useRef } from 'react';
import { authAxios } from '@/axios/instance';
import { setCookies } from '@/utils/ext';
import type { ApiResponse } from '@/types/api';

export function MachineIdProvider({ children }: { children: React.ReactNode }) {
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    authAxios
      .get<ApiResponse<{ id: string }>>('/auth/machine-id')
      .then(
        res => res.data.data?.id && setCookies({ machineId: res.data.data.id })
      );
  }, []);

  return <>{children}</>;
}
