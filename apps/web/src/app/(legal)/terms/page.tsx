import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Lampstand',
};

const Terms = () => {
  redirect(
    'https://lampstand-ai.notion.site/Lampstand-Terms-Conditions-16e6e38617938013b19bdeeacf4e4a15?pvs=4'
  );
};

export default Terms;
