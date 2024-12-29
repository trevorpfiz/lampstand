import { env } from '@lamp/env';

const TRAILING_SLASH_REGEX = /\/+$/;
const LEADING_SLASH_REGEX = /^\/+/;

export const getURL = (path = '') => {
  const appUrl =
    env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : env.NEXT_PUBLIC_APP_URL.trim() || env.VERCEL_URL?.trim() || '';

  // Make sure to include `https://` when not localhost
  const baseUrl = appUrl.includes('http') ? appUrl : `https://${appUrl}`;
  // Remove trailing slash if exists
  const cleanBaseUrl = baseUrl.replace(TRAILING_SLASH_REGEX, '');
  // Remove leading slash from path if exists
  const cleanPath = path.replace(LEADING_SLASH_REGEX, '');

  return cleanPath ? `${cleanBaseUrl}/${cleanPath}` : cleanBaseUrl;
};

export const toDateTime = (secs: number) => {
  const t = new Date(0); // Unix epoch start
  t.setSeconds(secs);
  return t;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date();
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
  );
  return Math.floor(trialEnd.getTime() / 1000);
};

const toastKeyMap = {
  status: ['status', 'status_description'] as const,
  error: ['error', 'error_description'] as const,
};

const getToastRedirect = (
  path: string,
  toastType: keyof typeof toastKeyMap,
  toastName: string,
  toastDescription = '',
  disableButton = false,
  arbitraryParams = ''
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];
  const params = new URLSearchParams();

  params.set(nameKey, toastName);

  if (toastDescription) {
    params.set(descriptionKey, toastDescription);
  }

  if (disableButton) {
    params.set('disable_button', 'true');
  }

  if (arbitraryParams) {
    params.append('params', arbitraryParams);
  }

  return `${path}?${params.toString()}`;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription = '',
  disableButton = false,
  arbitraryParams = ''
) =>
  getToastRedirect(
    path,
    'status',
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription = '',
  disableButton = false,
  arbitraryParams = ''
) =>
  getToastRedirect(
    path,
    'error',
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );
