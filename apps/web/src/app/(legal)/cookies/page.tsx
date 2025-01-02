import { createMetadata } from '@lamp/seo/metadata';
import type { Metadata } from 'next';

const meta = {
  title: 'Cookie Policy',
  description:
    'Lampstand is a Bible study app for the next generation. It helps you study the Bible faster and easier.',
};

export const metadata: Metadata = createMetadata(meta);

const Cookies = async () => {
  return <></>;
};

export default Cookies;
