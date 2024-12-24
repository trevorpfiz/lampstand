import type { Config } from 'drizzle-kit';

import { env } from '@lamp/env/db';

const nonPoolingUrl = env.POSTGRES_URL.replace(':6543', ':5432');

export default {
  schema: './src/schema',
  schemaFilter: ['public'],
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: nonPoolingUrl },
  tablesFilter: ['lamp_*'],
  casing: 'snake_case',
} satisfies Config;
