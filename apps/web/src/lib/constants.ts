import { env } from '@lamp/env';

export const webUrl =
  env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : env.NEXT_PUBLIC_SITE_URL;

export const appUrl =
  env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : env.NEXT_PUBLIC_APP_URL;
