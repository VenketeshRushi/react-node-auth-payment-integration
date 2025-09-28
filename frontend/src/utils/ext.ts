import Cookies from 'js-cookie';
import type { RefObject } from 'react';

/**
 * Returns a promise that resolves after a specified delay.
 * @param ms - The number of milliseconds to wait.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise(res => setTimeout(res, ms));

/**
 * Encodes any data into a Base64 string.
 * @param data - The data to encode.
 * @returns A Base64-encoded string.
 */
export const encodeData = (data: unknown): string => {
  const jsonString = JSON.stringify(data);
  return btoa(encodeURIComponent(jsonString));
};

/**
 * Decodes a Base64 string back into the original data.
 * @param encoded - The Base64-encoded string.
 * @returns The decoded data, or null if decoding fails.
 */
export const decodeData = <T = unknown>(encoded: string): T | null => {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('Failed to decode data:', e);
    return null;
  }
};

/**
 * Sets multiple cookies at once with optional attributes.
 * @param cookies - An object containing cookie names and values.
 * @param options - Optional cookie attributes such as expiration, path, etc.
 */
export const setCookies = (
  cookies: Record<string, string>,
  options?: Cookies.CookieAttributes
): void => {
  Object.entries(cookies).forEach(([key, value]) => {
    Cookies.set(key, value, { path: '/', ...options });
  });
};

/**
 * Retrieves the values of the specified cookies.
 * @param keys - Optional array of cookie names. Returns all cookies if omitted.
 * @returns An object containing cookie names and their corresponding values.
 */
export const getCookies = (
  keys?: string[]
): Record<string, string | undefined> => {
  if (!keys || keys.length === 0) return Cookies.get();
  const result: Record<string, string | undefined> = {};
  keys.forEach(key => {
    result[key] = Cookies.get(key);
  });
  return result;
};

/**
 * Removes the specified cookies.
 * @param keys - Array of cookie names to remove. Defaults to common auth cookies.
 */
export const removeCookies = (
  keys: string[] = ['accessToken', 'refreshToken', 'user', 'machineId']
): void => {
  keys.forEach(key => Cookies.remove(key, { path: '/' }));
};

/**
 * Scrolls the referenced container element to its bottom.
 * @param containerRef - React ref pointing to the container element.
 * @param smooth - Whether to animate the scroll. Default is true.
 */
export const scrollToBottom = (
  containerRef: RefObject<HTMLElement>,
  smooth = true
) => {
  const container = containerRef.current;
  if (!container) return;
  const lastMessage = container.lastElementChild as HTMLElement | null;
  lastMessage?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'end',
  });
};

/**
 * Evaluates the strength of a password.
 * @param password - The password to evaluate.
 * @param minLength - Minimum required length. Default is 8.
 * @returns An object with score, label, and Tailwind color class.
 */
export const getPasswordStrength = (password: string, minLength = 8) => {
  let strength = 0;
  if (password.length >= minLength) strength++;
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
