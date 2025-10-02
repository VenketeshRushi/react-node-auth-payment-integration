import { config } from '@/config/loadEnv.js';
import type { CookieOptions, Response } from 'express';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  const defaultOptions: CookieOptions = {
    httpOnly: name === 'refreshToken' ? true : false,
    secure: config.NODE_ENV === 'production',
    sameSite: (config.NODE_ENV === 'production' ? 'strict' : 'lax') as
      | boolean
      | 'lax'
      | 'strict'
      | 'none',
    path: '/',
    ...options,
  };

  res.cookie(name, value, defaultOptions);
};

export const clearAllCookies = (res: Response): void => {
  const cookieBaseOptions: CookieOptions = {
    path: '/',
    secure: config.NODE_ENV === 'production',
    sameSite: (config.NODE_ENV === 'production' ? 'strict' : 'lax') as
      | boolean
      | 'lax'
      | 'strict'
      | 'none',
  };

  const cookiesToClear = ['accessToken', 'refreshToken', 'user'];

  cookiesToClear.forEach(cookieName => {
    res.clearCookie(cookieName, { ...cookieBaseOptions, httpOnly: false });
    res.clearCookie(cookieName, { ...cookieBaseOptions, httpOnly: true });
  });
};
