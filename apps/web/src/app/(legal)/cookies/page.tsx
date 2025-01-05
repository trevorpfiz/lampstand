import type { Metadata } from 'next';

import { createMetadata } from '@lamp/seo/metadata';

import { webUrl } from '~/lib/constants';

const meta = {
  metadataBase: new URL(webUrl),
  title: 'Cookie Policy',
  description:
    'Lampstand is a Bible study app for the next generation. It helps you study the Bible faster and easier.',
};

export const metadata: Metadata = createMetadata(meta);

const Cookies = async () => {
  return <></>;
};

export default Cookies;
