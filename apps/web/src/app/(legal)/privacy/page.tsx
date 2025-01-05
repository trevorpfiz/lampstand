import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lampstand',
};

const Privacy = () => {
  redirect(
    'https://lampstand-ai.notion.site/Lampstand-Privacy-Policy-16d6e3861793803c83ceeae8502ff283?pvs=4'
  );
};

export default Privacy;
