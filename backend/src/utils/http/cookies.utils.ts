import type { CookieOptions, Response } from 'express';

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  const defaultOptions: CookieOptions = {
    httpOnly: name === 'refreshToken' ? true : false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as
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
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as
      | boolean
      | 'lax'
      | 'strict'
      | 'none',
  };

  // Clear with both httpOnly true and false to ensure complete cleanup
  const cookiesToClear = ['accessToken', 'refreshToken', 'user'];

  cookiesToClear.forEach(cookieName => {
    res.clearCookie(cookieName, { ...cookieBaseOptions, httpOnly: false });
    res.clearCookie(cookieName, { ...cookieBaseOptions, httpOnly: true });
  });
};
