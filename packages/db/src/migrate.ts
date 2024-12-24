import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';

import { env } from '@lamp/env/db';

const runMigrate = async () => {
  if (!env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const db = drizzle(sql);

  const _start = Date.now();

  await migrate(db, { migrationsFolder: 'migrations' });

  const _end = Date.now();

  process.exit(0);
};

runMigrate().catch((_err) => {
  process.exit(1);
});
