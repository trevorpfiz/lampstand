/**
 * Represents an array of routes that are publicly accessible.
 * Users do not need to be logged in to access these routes.
 * @type {string[]} publicRoutes - The public routes.
 */
export const publicRoutes: string[] = [];

/**
 * Represents an array of routes that require authentication.
 * Users must be logged in to access these routes.
 * @type {string[]} protectedRoutes - The protected routes.
 */
export const protectedRoutes = [
  '/',
  '/onboarding',
  '/dashboard',
  '/settings',
  '/account',
];

/**
 * Represents an array of routes used for authentication.
 * Logged in users will be redirected to DEFAULT_LOGIN_REDIRECT when accessing these routes.
 * @type {string[]} authRoutes - The authentication routes.
 */
export const authRoutes = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/auth/callback',
  '/auth/confirm',
];

/**
 * The default path to which users are redirected after logging in.
 * @type {string} DEFAULT_LOGIN_REDIRECT - The default login redirect path.
 */
export const DEFAULT_LOGIN_REDIRECT = '/';

/**
 * The default path to which users are redirected to authenticate.
 * @type {string} DEFAULT_AUTH_ROUTE - The default auth route.
 */
export const DEFAULT_AUTH_ROUTE = '/signin';

/**
 * The route to which users are redirected to reset their password.
 * @type {string} RESET_PASSWORD_ROUTE - The reset password route.
 */
export const RESET_PASSWORD_ROUTE = '/account/update-password';
