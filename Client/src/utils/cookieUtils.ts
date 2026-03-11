// ─────────────────────────────────────────────
//  COOKIE UTILITY FUNCTIONS
//
//  Handles setting, getting, and removing cookies
//  with proper expiration and security settings
// ─────────────────────────────────────────────

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Set a cookie with the specified options
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options (maxAge in seconds, default 30 days)
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  const {
    maxAge = 30 * 24 * 60 * 60, // 30 days default
    path = '/',
    secure = true,
    sameSite = 'Lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (maxAge) {
    cookieString += `; Max-Age=${maxAge}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (secure) {
    cookieString += '; Secure';
  }

  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Remove a cookie by name
 * @param name - Cookie name
 */
export const removeCookie = (name: string, path: string = '/'): void => {
  setCookie(name, '', {
    maxAge: -1,
    path
  });
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = (): void => {
  removeCookie('auth_token');
  removeCookie('auth_user');
};

/**
 * Set authentication cookies with user and token
 * @param user - User object
 * @param token - JWT token
 */
export const setAuthCookies = (user: any, token: string): void => {
  setCookie('auth_token', token, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    secure: true,
    sameSite: 'Lax'
  });

  setCookie('auth_user', JSON.stringify(user), {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    secure: true,
    sameSite: 'Lax'
  });
};

/**
 * Get authentication data from cookies
 * @returns Object with token and user or null
 */
export const getAuthFromCookies = (): { token: string; user: any } | null => {
  const token = getCookie('auth_token');
  const userJson = getCookie('auth_user');

  if (token && userJson) {
    try {
      const user = JSON.parse(userJson);
      return { token, user };
    } catch (error) {
      console.error('Failed to parse auth user cookie', error);
      clearAuthCookies();
      return null;
    }
  }

  return null;
};

