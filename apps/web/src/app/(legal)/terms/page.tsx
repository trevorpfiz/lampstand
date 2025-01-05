import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createMetadata } from '@lamp/seo/metadata';

import { webUrl } from '~/lib/constants';

const meta = {
  metadataBase: new URL(webUrl),
  title: 'Terms & Conditions',
  description:
    'Lampstand is a Bible study app for the next generation. It helps you study the Bible faster and easier.',
};

export const metadata: Metadata = createMetadata(meta);

const Terms = () => {
  redirect(
    'https://lampstand-ai.notion.site/Lampstand-Terms-Conditions-16e6e38617938013b19bdeeacf4e4a15?pvs=4'
  );
};

export default Terms;
