import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createMetadata } from '@lamp/seo/metadata';

import { webUrl } from '~/lib/constants';

const meta = {
  metadataBase: new URL(webUrl),
  title: 'Privacy Policy',
  description:
    'Lampstand is a Bible study app for the next generation. It helps you study the Bible faster and easier.',
};

export const metadata: Metadata = createMetadata(meta);

const Privacy = () => {
  redirect(
    'https://lampstand-ai.notion.site/Lampstand-Privacy-Policy-16d6e3861793803c83ceeae8502ff283?pvs=4'
  );
};

export default Privacy;
