import { getCookies } from '@/utils/ext';
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
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
      if (machineId) config.headers!['X-Machine-Id'] = machineId;
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => Promise.reject(error)
);
