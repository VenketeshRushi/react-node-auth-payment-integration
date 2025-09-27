import type { ApiResponse } from '@/types/api';
import { authAxios } from '@/axios/instance';

export async function fetchMachineId(): Promise<string> {
  const response =
    await authAxios.get<ApiResponse<{ id: string }>>('/auth/machine-id');
  if (response.data.success) {
    return response.data.data.id;
  } else {
    throw new Error(response.data.message || 'Failed to fetch machine id');
  }
}
