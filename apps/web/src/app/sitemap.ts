import fs from 'node:fs';
import type { MetadataRoute } from 'next';

import { blog, legal } from '@lamp/cms';
import { env } from '@lamp/env';

const appFolders = fs.readdirSync('src/app', { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith('_'))
  .filter((folder) => !folder.name.startsWith('('))
  .map((folder) => folder.name);

const blogs = (await blog.getPosts()).map((post) => post._slug);

const legals = (await legal.getPosts()).map((post) => post._slug);

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  {
    url: env.VERCEL_PROJECT_PRODUCTION_URL ?? env.NEXT_PUBLIC_SITE_URL,
    lastModified: new Date(),
  },
  ...pages.map((page) => ({
    url: new URL(page, env.VERCEL_PROJECT_PRODUCTION_URL).href,
    lastModified: new Date(),
  })),
  ...blogs.map((blog) => ({
    url: new URL(`blog/${blog}`, env.VERCEL_PROJECT_PRODUCTION_URL).href,
    lastModified: new Date(),
  })),
  ...legals.map((legal) => ({
    url: new URL(`legal/${legal}`, env.VERCEL_PROJECT_PRODUCTION_URL).href,
    lastModified: new Date(),
  })),
];

export default sitemap;
