import { getCookies } from '@/utils/ext';
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosResponse,
} from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const commonConfig = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const authAxios: AxiosInstance = axios.create(commonConfig);

authAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const { machineId } = getCookies();
      if (machineId) {
        config.headers!['X-Machine-Id'] = machineId;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error?.response) {
      const apiError = error?.response?.data as any;

      const normalizedError = Object.assign(
        new Error(apiError?.message || 'API Error'),
        {
          success: false,
          statusCode: error?.response?.status,
          errorCode: apiError?.errorCode,
          data: apiError?.data,
        }
      );

      return Promise.reject(normalizedError);
    }

    // Network or unexpected errors
    return Promise.reject(new Error(error.message || 'Network error occurred'));
  }
);
