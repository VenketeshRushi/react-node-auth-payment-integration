import Cookies from 'js-cookie';
import type { RefObject } from 'react';

export const delay = (ms: number): Promise<void> =>
  new Promise(res => setTimeout(res, ms));

// Encode any data as base64
export const encodeData = (data: unknown): string => {
  const jsonString = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(jsonString))); // handles UTF-8 correctly
};

// Decode base64 back to object
export const decodeData = <T = unknown>(encoded: string): T | null => {
  const jsonString = decodeURIComponent(escape(atob(encoded)));
  return JSON.parse(jsonString) as T;
};

export const getCookies = () => {
  const machineId = Cookies.get('machineId');
  return {
    machineId,
  };
};

export const removeAllCookies = () => {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  Cookies.remove('user', { path: '/' });
  Cookies.remove('machineId', { path: '/' });
};

export const scrollToBottom = (containerRef: RefObject<HTMLElement>) => {
  const container = containerRef.current;
  if (!container) return;

  const lastMessage = container.lastElementChild as HTMLElement | null;
  lastMessage?.scrollIntoView({ behavior: 'smooth', block: 'end' });
};

export const getPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  return {
    score: strength,
    label: strength <= 2 ? 'Weak' : strength <= 4 ? 'Good' : 'Strong',
    color:
      strength <= 2
        ? 'bg-red-500'
        : strength <= 4
          ? 'bg-yellow-500'
          : 'bg-green-500',
  };
};
